import TabBar from "@/components/TabBar";
import { useLanguageStore } from "@/store/language";
import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { Tabs } from "expo-router/js-tabs";

// Protected group: only signed-in users can reach these routes.
export default function AppLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const selectedLanguage = useLanguageStore((s) => s.selectedLanguage);
  const hasHydrated = useLanguageStore((s) => s.hasHydrated);

  // Wait for auth + the persisted language to load before deciding.
  if (!isLoaded || !hasHydrated) return null;
  if (!isSignedIn) return <Redirect href="/sign-in" />;

  // Signed in but no language chosen yet → force language selection first.
  if (!selectedLanguage) return <Redirect href="/language-selection" />;

  // Bottom tab navigation with a custom animated tab bar. Screen order here
  // controls the order of the tabs in the bar.
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="learn" />
      <Tabs.Screen name="ai-teacher" />
      <Tabs.Screen name="chat" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
