// Drives the AI teacher (Vision Agent) for a lesson call. Once the learner has
// joined the Stream call, this hook asks our Expo API to start the agent, then
// watches the call's participants for the agent's user id to know when it has
// actually joined and can be heard. It exposes a simple connection status
// (idle / connecting / connected / failed) for the UI and cleans the session up
// both when the learner ends the call and when the screen unmounts.
import type { LessonCallHandle } from "@/hooks/useLessonCall";
import { startTeacherAgent, stopTeacherAgent } from "@/lib/stream";
import { useAuth } from "@clerk/clerk-expo";
import { useCallback, useEffect, useRef, useState } from "react";

// The Stream user id the Python agent joins as (vision-agent/agent.py). Must
// match AI_TEACHER_USER_ID on the server.
const AI_TEACHER_USER_ID = "ai-teacher";

export type TeacherAgentStatus =
  | "idle" // not started yet (call not ready)
  | "connecting" // start requested / agent joining
  | "connected" // agent is in the call
  | "failed"; // start failed

type Params = {
  lessonId?: string;
  // The joined lesson call handle from useLessonCall; null until the call joins.
  handle: LessonCallHandle | null;
  // Only start the agent once the learner's call is live.
  enabled: boolean;
};

export function useTeacherAgent({ lessonId, handle, enabled }: Params) {
  const { getToken } = useAuth();
  const getTokenRef = useRef(getToken);
  useEffect(() => {
    getTokenRef.current = getToken;
  }, [getToken]);

  const [status, setStatus] = useState<TeacherAgentStatus>("idle");
  const [error, setError] = useState<string>();
  // Latest session id, held in a ref so cleanup always sees the current value.
  const sessionIdRef = useRef<string | null>(null);
  // The call id we've already kicked off a start for — so a transient reconnect
  // (which briefly flips `enabled`) doesn't start a second agent.
  const startedCallIdRef = useRef<string | null>(null);

  const call = handle?.call ?? null;
  const callId = handle?.callId ?? null;

  // Stop the agent session on the server. Safe to call repeatedly; clears state.
  const stop = useCallback(async () => {
    const sessionId = sessionIdRef.current;
    sessionIdRef.current = null;
    startedCallIdRef.current = null;
    if (lessonId && sessionId) {
      await stopTeacherAgent(getTokenRef.current, { lessonId, sessionId }).catch(
        () => {}
      );
    }
    setStatus("idle");
  }, [lessonId]);

  // Start the agent once the call is joined. Latched per call id so it only fires
  // once even if `enabled` toggles during a reconnect. This effect never stops the
  // session on cleanup — teardown lives in the effect below so reconnects don't
  // kill the teacher mid-lesson.
  useEffect(() => {
    if (!enabled || !lessonId || !call || !callId) return;
    if (startedCallIdRef.current === callId) return;
    startedCallIdRef.current = callId;
    let cancelled = false;

    (async () => {
      try {
        setError(undefined);
        setStatus("connecting");
        const { sessionId } = await startTeacherAgent(getTokenRef.current, {
          lessonId,
        });
        if (cancelled) {
          // Screen went away mid-start — undo the session we just created.
          if (sessionId) {
            await stopTeacherAgent(getTokenRef.current, {
              lessonId,
              sessionId,
            }).catch(() => {});
          }
          return;
        }
        sessionIdRef.current = sessionId;
        // If the agent is already present (fast join / rejoin), reflect it now;
        // otherwise the participants subscription below flips us to "connected".
        const present = call.state.participants.some(
          (p) => p.userId === AI_TEACHER_USER_ID
        );
        if (present) setStatus("connected");
      } catch (err) {
        if (cancelled) return;
        startedCallIdRef.current = null; // allow a retry on the next enable
        setError((err as Error).message);
        setStatus("failed");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled, lessonId, call, callId]);

  // Watch the call for the agent joining/leaving, and tear the session down when
  // the call changes or the screen unmounts. Keyed on `call` (not `enabled`) so a
  // transient reconnect never triggers cleanup.
  useEffect(() => {
    if (!call) return;
    const sub = call.state.participants$.subscribe((participants) => {
      const present = participants.some((p) => p.userId === AI_TEACHER_USER_ID);
      // Only promote to connected — don't fight "connecting"/"failed" set above.
      if (present) setStatus("connected");
    });
    return () => {
      sub.unsubscribe();
      void stop();
    };
  }, [call, stop]);

  return { status, error, stop };
}
