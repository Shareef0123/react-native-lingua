// Connects the signed-in Clerk user to Stream Video once per session and mounts
// the <StreamVideo> provider so any screen (the AI Teacher lesson) can start a
// call. Uses getOrCreateInstance + a tokenProvider that re-hits our API route —
// the Stream secret never reaches the client.
import { fetchStreamSession } from "@/lib/stream";
import { useAuth } from "@clerk/clerk-expo";
import {
  StreamVideo,
  StreamVideoClient,
  type User,
} from "@stream-io/video-react-native-sdk";
import { type ReactNode, useEffect, useRef, useState } from "react";

export default function StreamVideoProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { getToken, userId, isSignedIn } = useAuth();
  const [client, setClient] = useState<StreamVideoClient>();

  // Clerk's getToken isn't a stable reference across renders; keep the latest in
  // a ref so the connect effect doesn't re-run (and thrash the client) every
  // render. The effect depends only on the signed-in user identity.
  const getTokenRef = useRef(getToken);
  useEffect(() => {
    getTokenRef.current = getToken;
  }, [getToken]);

  useEffect(() => {
    if (!isSignedIn || !userId) return;
    let cancelled = false;
    let created: StreamVideoClient | undefined;

    (async () => {
      try {
        const session = await fetchStreamSession(getTokenRef.current);
        if (cancelled) return;
        const user: User = {
          id: session.userId,
          name: session.userName,
          image: session.userImage,
        };
        // tokenProvider re-hits the same authenticated route on refresh, so the
        // SDK never sees a secret and the user id is always server-derived.
        created = StreamVideoClient.getOrCreateInstance({
          apiKey: session.apiKey,
          user,
          token: session.token,
          tokenProvider: async () =>
            (await fetchStreamSession(getTokenRef.current)).token,
        });
        if (cancelled) {
          created.disconnectUser().catch(() => {});
          return;
        }
        setClient(created);
      } catch (err) {
        console.error("Stream connect failed", err);
      }
    })();

    return () => {
      cancelled = true;
      created?.disconnectUser().catch(() => {});
      setClient(undefined);
    };
  }, [userId, isSignedIn]);

  // Until the client connects, render the app without the video provider so the
  // rest of the tabs work immediately; the AI Teacher screen shows its own
  // loading state until a client is available.
  if (!client) return <>{children}</>;

  return <StreamVideo client={client}>{children}</StreamVideo>;
}
