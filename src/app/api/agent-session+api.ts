// Expo Router API route (server-side). Starts/stops the AI teacher (Vision Agent)
// for a lesson call by proxying to the Vision Agent HTTP server. The proxy keeps
// the agent server URL and any shared token out of the mobile bundle, and lets us
// grant the agent the permissions it needs (admin membership + goLive) before it
// joins — so it can publish audio in the audio_room.
import {
  AuthError,
  getStreamServer,
  getVisionAgentConfig,
  requireClerkUser,
} from "@/lib/server/stream";
import {
  AI_TEACHER_USER_ID,
  buildLessonCallCustom,
  LESSON_CALL_TYPE,
  lessonCallId,
} from "@/lib/server/lessonCallData";

// Start the AI teacher: grant it admin rights on the lesson call, make sure the
// call is live, then ask the Vision Agent server to spawn an agent that joins it.
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

    // The teacher's Stream user must exist before it can be a call member.
    await client.upsertUsers([
      { id: AI_TEACHER_USER_ID, name: "AI Language Teacher" },
    ]);

    // Make sure the call carries the latest lesson context (in case it was
    // created before this data existed), and grant the teacher admin so it is
    // allowed to publish audio in the audio_room.
    await call.update({ custom });
    await call.updateCallMembers({
      update_members: [{ user_id: AI_TEACHER_USER_ID, role: "admin" }],
    });
    // audio_room gates publishing behind goLive — ensure we're live before the
    // agent joins. Idempotent in practice; ignore "already live".
    await call.goLive({}).catch(() => {});

    // Ask the Vision Agent server to spawn an agent that joins this call.
    const { baseUrl, authHeader } = getVisionAgentConfig();
    const res = await fetch(
      `${baseUrl}/calls/${encodeURIComponent(callId)}/sessions`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(authHeader ?? {}) },
        body: JSON.stringify({ call_type: LESSON_CALL_TYPE }),
      }
    ).catch(() => null);

    if (!res || !res.ok) {
      console.error(
        "agent-session start failed:",
        res ? `${res.status} ${await res.text().catch(() => "")}` : "no response"
      );
      return Response.json(
        { error: "Could not reach the AI teacher service" },
        { status: 502 }
      );
    }

    const data = (await res.json().catch(() => ({}))) as {
      session_id?: string;
    };
    return Response.json({
      sessionId: data.session_id ?? null,
      callId,
      callType: LESSON_CALL_TYPE,
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return Response.json({ error: err.message }, { status: 401 });
    }
    console.error("agent-session start error:", err);
    return Response.json({ error: "Internal error" }, { status: 500 });
  }
}

// Stop the AI teacher: tell the Vision Agent server to close the session so the
// agent leaves the call and its resources are freed.
export async function DELETE(request: Request) {
  try {
    const user = await requireClerkUser(request);
    const body = (await request.json().catch(() => ({}))) as {
      lessonId?: string;
      sessionId?: string;
    };
    if (!body.lessonId || !body.sessionId) {
      return Response.json(
        { error: "lessonId and sessionId are required" },
        { status: 400 }
      );
    }

    const callId = lessonCallId(body.lessonId, user.userId);
    const { baseUrl, authHeader } = getVisionAgentConfig();
    const res = await fetch(
      `${baseUrl}/calls/${encodeURIComponent(callId)}/sessions/${encodeURIComponent(
        body.sessionId
      )}`,
      { method: "DELETE", headers: { ...(authHeader ?? {}) } }
    ).catch(() => null);

    // Treat a missing session as already-stopped so cleanup is idempotent.
    if (!res || (!res.ok && res.status !== 404)) {
      console.error(
        "agent-session stop failed:",
        res ? `${res.status}` : "no response"
      );
      return Response.json(
        { error: "Could not stop the AI teacher service" },
        { status: 502 }
      );
    }

    return Response.json({ ok: true });
  } catch (err) {
    if (err instanceof AuthError) {
      return Response.json({ error: err.message }, { status: 401 });
    }
    console.error("agent-session stop error:", err);
    return Response.json({ error: "Internal error" }, { status: 500 });
  }
}
