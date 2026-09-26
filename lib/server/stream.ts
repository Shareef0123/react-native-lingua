// SERVER-ONLY. Imported exclusively by Expo Router API routes (`+api.ts`), so
// the Stream API secret and the Clerk secret key never reach the client bundle.
// Do NOT import this file from any client component or screen.
import { createClerkClient, verifyToken } from "@clerk/backend";
import { StreamClient } from "@stream-io/node-sdk";

const streamApiKey = process.env.EXPO_STREAM_API_KEY;
const streamApiSecret = process.env.EXPO_STREAM_API_SECRET;
const clerkSecretKey = process.env.CLERK_SECRET_KEY;

// The Vision Agent HTTP server (vision-agents `serve`). Server-side only — the
// mobile app never talks to it directly; the Expo API routes proxy to it so the
// URL (and any shared token) stays out of the client bundle.
const visionAgentUrl = process.env.VISION_AGENT_URL ?? "http://localhost:8000";
const visionAgentToken = process.env.VISION_AGENT_TOKEN;

// URL + optional bearer token for reaching the Vision Agent server.
export function getVisionAgentConfig() {
  return {
    baseUrl: visionAgentUrl.replace(/\/$/, ""),
    // Optional shared secret — sent as `Authorization: Bearer …` when the agent
    // server is configured to require it (ServeOptions.can_start_session).
    authHeader: visionAgentToken
      ? { Authorization: `Bearer ${visionAgentToken}` }
      : undefined,
  };
}

// Thrown for auth failures so routes can map them to HTTP 401.
export class AuthError extends Error {}

// Build a server-side Stream client (holds the secret) plus the public API key
// the client needs to construct its own StreamVideoClient.
export function getStreamServer() {
  if (!streamApiKey || !streamApiSecret) {
    throw new Error(
      "Missing EXPO_STREAM_API_KEY / EXPO_STREAM_API_SECRET on the server."
    );
  }
  return {
    apiKey: streamApiKey,
    client: new StreamClient(streamApiKey, streamApiSecret),
  };
}

export type AuthedUser = { userId: string; name: string; image?: string };

// Verify the Clerk session token from the Authorization header and resolve the
// authenticated user server-side. The Stream user id is derived here — never
// from the request body — so a client can't mint a token for another user.
export async function requireClerkUser(request: Request): Promise<AuthedUser> {
  if (!clerkSecretKey) {
    throw new AuthError("Missing CLERK_SECRET_KEY on the server.");
  }
  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) throw new AuthError("Missing bearer token.");

  // @clerk/backend's verifyToken returns the JWT payload directly and throws on
  // an invalid/expired token (it's wrapped with withLegacyReturn).
  let claims: Record<string, unknown>;
  try {
    claims = (await verifyToken(token, {
      secretKey: clerkSecretKey,
    })) as unknown as Record<string, unknown>;
  } catch (err) {
    throw new AuthError(`Invalid session token: ${(err as Error).message}`);
  }
  const userId = (claims?.sub ?? claims?.user_id) as string | undefined;
  if (!userId) throw new AuthError("Invalid session token: no subject claim");
  // Best-effort profile lookup for a friendly display name / avatar.
  let name = userId;
  let image: string | undefined;
  try {
    const clerk = createClerkClient({ secretKey: clerkSecretKey });
    const u = await clerk.users.getUser(userId);
    name =
      [u.firstName, u.lastName].filter(Boolean).join(" ") ||
      u.username ||
      u.emailAddresses[0]?.emailAddress ||
      userId;
    image = u.imageUrl;
  } catch {
    // Non-fatal — fall back to the user id as the display name.
  }
  return { userId, name, image };
}
