// Drives a Stream audio call for the selected lesson: creates/joins the call,
// exposes mute/unmute and end-call actions, and surfaces reactive status so the
// custom AI Teacher UI can render loading / connecting / joined / muted / error
// / ended states. No <StreamCall> context is needed because the UI is fully
// custom (audio-only, no video tiles) — we read the call's observables directly.
import { fetchLessonCall } from "@/lib/stream";
import { useAuth } from "@clerk/clerk-expo";
import {
  type Call,
  CallingState,
  useStreamVideoClient,
} from "@stream-io/video-react-native-sdk";
import { useCallback, useEffect, useRef, useState } from "react";

export type LessonCallStatus =
  | "loading" // creating/fetching the call on the server (or client not ready)
  | "connecting" // joining the SFU
  | "joined" // live
  | "ended" // the user left
  | "error"; // failed to create/join

type Params = {
  lessonId?: string;
  languageId?: string;
  lessonTitle?: string;
};

function mapCallingState(cs: CallingState): LessonCallStatus {
  switch (cs) {
    case CallingState.JOINED:
      return "joined";
    case CallingState.LEFT:
      return "ended";
    case CallingState.RECONNECTING_FAILED:
    case CallingState.OFFLINE:
      return "error";
    default:
      // UNKNOWN / IDLE / RINGING / JOINING / RECONNECTING / MIGRATING
      return "connecting";
  }
}

export function useLessonCall({ lessonId, languageId, lessonTitle }: Params) {
  const client = useStreamVideoClient();
  const { getToken } = useAuth();

  // Clerk's getToken isn't stable across renders; hold the latest in a ref so the
  // call effect doesn't re-run (resetting to "loading" and re-joining) endlessly.
  const getTokenRef = useRef(getToken);
  useEffect(() => {
    getTokenRef.current = getToken;
  }, [getToken]);

  const [status, setStatus] = useState<LessonCallStatus>("loading");
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState<string>();
  const [attempt, setAttempt] = useState(0);
  const callRef = useRef<Call | null>(null);

  useEffect(() => {
    if (!client || !lessonId) return;
    let cancelled = false;
    let call: Call | undefined;
    const subs: { unsubscribe: () => void }[] = [];

    (async () => {
      try {
        setError(undefined);
        setStatus("loading");

        const { callId, callType } = await fetchLessonCall(getTokenRef.current, {
          lessonId,
          languageId: languageId ?? "",
          lessonTitle,
        });
        if (cancelled) return;

        // The call already exists server-side (getOrCreate); reuse any instance
        // the SDK may already hold for this (type, id) pair.
        call = client.call(callType, callId, { reuseInstance: true });
        callRef.current = call;
        // Keep the call alive through brief network drops instead of ending it.
        call.setDisconnectionTimeout(60);

        // Reactive state straight from the call's observables.
        subs.push(
          call.state.callingState$.subscribe((cs) => {
            if (!cancelled) setStatus(mapCallingState(cs));
          })
        );
        subs.push(
          call.microphone.state.status$.subscribe((s) => {
            if (!cancelled) setMuted(s !== "enabled");
          })
        );

        setStatus("connecting");
        await call.join();
        if (cancelled) return;
        // Audio-only: never enable the camera; enable the mic so the learner can
        // speak. Failure here shouldn't strand the UI.
        await call.microphone.enable().catch(() => {});
      } catch (err) {
        if (cancelled) return;
        setError((err as Error).message);
        setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
      subs.forEach((s) => s.unsubscribe());
      const c = call;
      // Guard the leave so a hangup + unmount (or strict-mode double effect)
      // doesn't throw "Cannot leave call that has already been left".
      if (c && c.state.callingState !== CallingState.LEFT) {
        c.leave().catch(() => {});
      }
      callRef.current = null;
    };
  }, [client, lessonId, languageId, lessonTitle, attempt]);

  const toggleMute = useCallback(async () => {
    await callRef.current?.microphone.toggle().catch(() => {});
  }, []);

  const endCall = useCallback(async () => {
    const c = callRef.current;
    if (c && c.state.callingState !== CallingState.LEFT) {
      await c.leave().catch(() => {});
    }
    setStatus("ended");
  }, []);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return {
    status,
    muted,
    error,
    connected: status === "joined",
    toggleMute,
    endCall,
    retry,
  };
}
