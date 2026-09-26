// Expo Router API route (server-side). Mints a short-lived Stream user token for
// the signed-in Clerk user. The Stream secret stays here on the server.
import { AuthError, getStreamServer, requireClerkUser } from "@/lib/server/stream";

export async function POST(request: Request) {
  try {
    const user = await requireClerkUser(request);
    const { apiKey, client } = getStreamServer();

    // Ensure the Stream user exists so they can be a member of the lesson call.
    await client.upsertUsers([
      { id: user.userId, name: user.name, image: user.image },
    ]);

    // ~4h token; the client's tokenProvider re-hits this route before expiry.
    const token = client.generateUserToken({
      user_id: user.userId,
      validity_in_seconds: 60 * 60 * 4,
    });

    return Response.json({
      apiKey,
      userId: user.userId,
      userName: user.name,
      userImage: user.image,
      token,
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return Response.json({ error: err.message }, { status: 401 });
    }
    // Don't leak internal error detail to the client on 5xx.
    console.error("stream-token route error:", err);
    return Response.json({ error: "Internal error" }, { status: 500 });
  }
}
