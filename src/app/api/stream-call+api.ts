// Expo Router API route (server-side). Creates (or fetches) the audio call for a
// lesson with the signed-in Clerk user as creator + member. The lesson is stored
// as call metadata so the session is tied to the selected lesson/language.
import { AuthError, getStreamServer, requireClerkUser } from "@/lib/server/stream";

// A plain 1:1 audio session — we use the "default" call type and simply never
// publish video on the client (audio-only experience).
const CALL_TYPE = "default";

// Stream call ids allow letters, numbers, "_" and "-". Sanitize defensively.
function sanitizeId(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "-");
}

export async function POST(request: Request) {
  try {
    const user = await requireClerkUser(request);
    const body = (await request.json().catch(() => ({}))) as {
      lessonId?: string;
      languageId?: string;
      lessonTitle?: string;
    };
    if (!body.lessonId) {
      return Response.json({ error: "lessonId is required" }, { status: 400 });
    }

    const { client } = getStreamServer();

    // Deterministic per (lesson, user) so re-entering the lesson resumes the
    // same call instead of spawning a new one each time.
    const callId = sanitizeId(`lesson-${body.lessonId}-${user.userId}`);
    const call = client.video.call(CALL_TYPE, callId);

    await call.getOrCreate({
      data: {
        created_by_id: user.userId,
        members: [{ user_id: user.userId }],
        custom: {
          kind: "ai-teacher-audio",
          lessonId: body.lessonId,
          languageId: body.languageId ?? null,
          lessonTitle: body.lessonTitle ?? null,
        },
      },
    });

    return Response.json({ callId, callType: CALL_TYPE });
  } catch (err) {
    if (err instanceof AuthError) {
      return Response.json({ error: err.message }, { status: 401 });
    }
    // Don't leak internal error detail to the client on 5xx.
    console.error("stream-call route error:", err);
    return Response.json({ error: "Internal error" }, { status: 500 });
  }
}
