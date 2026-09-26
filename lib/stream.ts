// Client-side helpers for talking to our Expo API routes that mint Stream
// tokens and create lesson calls. The Stream API *secret* never lives here —
// these functions only ever receive short-lived user tokens from the server.
import Constants from "expo-constants";

// Resolve the origin the device can reach our Expo API routes on. In dev,
// Expo Router serves API routes from the same host/port as the JS bundle, which
// `expoConfig.hostUri` exposes (e.g. "192.168.1.5:8081"). In production this
// falls back to the `origin` configured for API routes.
function getApiBaseUrl(): string {
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) return `http://${hostUri}`;
  const origin =
    (Constants.expoConfig?.extra?.apiOrigin as string | undefined) ??
    process.env.EXPO_PUBLIC_API_ORIGIN;
  if (origin) return origin;
  throw new Error(
    "Unable to resolve the API base URL for Stream. Set expo.extra.apiOrigin or EXPO_PUBLIC_API_ORIGIN."
  );
}

type GetToken = () => Promise<string | null>;

// Fetch wrapper that forwards the signed-in user's Clerk session token so the
// server can derive the Stream user id itself — the client never names a user.
async function authedFetch<T>(
  path: string,
  getToken: GetToken,
  init?: RequestInit
): Promise<T> {
  const jwt = await getToken();
  if (!jwt) throw new Error("Not signed in");
  const res = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`${path} failed (${res.status})${body ? `: ${body}` : ""}`);
  }
  return res.json() as Promise<T>;
}

export type StreamSession = {
  apiKey: string;
  userId: string;
  userName: string;
  userImage?: string;
  token: string;
};

// Identity + Stream token for the signed-in user. Used to build the client and
// as the token provider the SDK re-hits when the token nears expiry.
export function fetchStreamSession(getToken: GetToken): Promise<StreamSession> {
  return authedFetch<StreamSession>("/api/stream-token", getToken, {
    method: "POST",
  });
}

export type LessonCall = { callId: string; callType: string };

// Create (or fetch) the audio call for a lesson, server-side, with the
// signed-in user as creator + admin member. The full lesson content is packed
// into the call's custom data by the server from the lesson id alone.
export function fetchLessonCall(
  getToken: GetToken,
  params: { lessonId: string }
): Promise<LessonCall> {
  return authedFetch<LessonCall>("/api/stream-call", getToken, {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export type TeacherAgentSession = {
  sessionId: string | null;
  callId: string;
  callType: string;
};

// Start the AI teacher (Vision Agent) for a lesson: the server grants the agent
// permission to publish and asks the Vision Agent server to join the call.
export function startTeacherAgent(
  getToken: GetToken,
  params: { lessonId: string }
): Promise<TeacherAgentSession> {
  return authedFetch<TeacherAgentSession>("/api/agent-session", getToken, {
    method: "POST",
    body: JSON.stringify(params),
  });
}

// Stop the AI teacher session so the agent leaves the call and frees resources.
export function stopTeacherAgent(
  getToken: GetToken,
  params: { lessonId: string; sessionId: string }
): Promise<{ ok: boolean }> {
  return authedFetch<{ ok: boolean }>("/api/agent-session", getToken, {
    method: "DELETE",
    body: JSON.stringify(params),
  });
}
