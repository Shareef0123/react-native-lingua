import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Stack } from "expo-router";

// Protected group: only signed-in users can reach these routes.
export default function AppLayout() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return null;
  if (!isSignedIn) return <Redirect href="/sign-in" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
