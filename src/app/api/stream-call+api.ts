// Expo Router API route (server-side). Creates (or fetches) the audio-room call
// for a lesson with the signed-in Clerk user as creator + admin member. The full
// lesson content is stored as call custom data so the AI teacher (Vision Agent)
// can read it on join. The call is taken live so admins can publish audio.
import {
  AuthError,
  getStreamServer,
  requireClerkUser,
} from "@/lib/server/stream";
import {
  buildLessonCallCustom,
  LESSON_CALL_TYPE,
  lessonCallId,
} from "@/lib/server/lessonCallData";

export async function POST(request: Request) {
  try {
    const user = await requireClerkUser(request);
    const body = (await request.json().catch(() => ({}))) as {
      lessonId?: string;
    };
    if (!body.lessonId) {
      return Response.json({ error: "lessonId is required" }, { status: 400 });
    }

    const custom = buildLessonCallCustom(body.lessonId);
    if (!custom) {
      return Response.json({ error: "Unknown lessonId" }, { status: 404 });
    }

    const { client } = getStreamServer();
    const callId = lessonCallId(body.lessonId, user.userId);
    const call = client.video.call(LESSON_CALL_TYPE, callId);

    // Creator is an admin member so they can publish audio (audio_room gates
    // publishing to admins/hosts). The AI teacher is added as an admin member by
    // the agent-session route when it starts the agent.
    await call.getOrCreate({
      data: {
        created_by_id: user.userId,
        members: [{ user_id: user.userId, role: "admin" }],
        custom,
      },
    });

    // audio_room starts in backstage; take it live so admins can publish audio.
    // Idempotent in practice — ignore "already live" on re-entry.
    await call.goLive({}).catch(() => {});

    return Response.json({ callId, callType: LESSON_CALL_TYPE });
  } catch (err) {
    if (err instanceof AuthError) {
      return Response.json({ error: err.message }, { status: 401 });
    }
    // Don't leak internal error detail to the client on 5xx.
    console.error("stream-call route error:", err);
    return Response.json({ error: "Internal error" }, { status: 500 });
  }
}
