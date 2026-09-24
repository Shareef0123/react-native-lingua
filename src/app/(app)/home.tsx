import { useLanguageStore } from "@/store/language";
import { useAuth, useUser } from "@clerk/clerk-expo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
  const selectedLanguage = useLanguageStore((s) => s.selectedLanguage);
  const clearLanguage = useLanguageStore((s) => s.clearLanguage);

  const displayName =
    user?.firstName || user?.primaryEmailAddress?.emailAddress || "learner";

  const handleSignOut = async () => {
    await signOut();
    router.replace("/");
  };

  // Dev/testing helper: wipe the persisted language so the app routes back
  // to language selection. Resetting the store re-triggers the (app) gate.
  const handleClearStorage = async () => {
    await AsyncStorage.clear();
    clearLanguage();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View className="flex-1 px-6 pt-4 pb-6 justify-between">
        <View>
          <Text className="h1 text-[#0D132B]">Welcome, {displayName} 👋</Text>
          <Text className="body-md text-[#6B7280] mt-1">
            {selectedLanguage
              ? `You're learning ${selectedLanguage.name}.`
              : "Pick a language to start learning."}
          </Text>

          {/* Shows the selected language; tap to change it. */}
          <Link href="/language-selection" asChild>
            <TouchableOpacity
              activeOpacity={0.85}
              className="mt-6 flex-row items-center rounded-[20px] px-4 py-4 border border-[#F0F0F3] bg-white"
              style={{
                shadowColor: "#0D132B",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.05,
                shadowRadius: 10,
                elevation: 2,
              }}
            >
              {selectedLanguage ? (
                <View className="w-10 h-10 rounded-full overflow-hidden bg-[#F1F5F9]">
                  <Image
                    source={{ uri: selectedLanguage.flag }}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                  />
                </View>
              ) : (
                <View className="w-10 h-10 rounded-full bg-[#F1F5F9] items-center justify-center">
                  <Text style={{ fontSize: 18 }}>🌐</Text>
                </View>
              )}
              <View className="flex-1 ml-3">
                <Text className="font-poppins-semibold text-[16px] text-[#0D132B]">
                  {selectedLanguage ? selectedLanguage.name : "Choose a language"}
                </Text>
                <Text className="font-poppins text-[13px] text-[#6B7280] mt-0.5">
                  {selectedLanguage
                    ? "Tap to change your language"
                    : "Browse all supported languages"}
                </Text>
              </View>
              <Text className="font-poppins-bold text-[20px] text-[#94A3B8]">
                ›
              </Text>
            </TouchableOpacity>
          </Link>
        </View>

        <View>
          {/* Dev-only: clear AsyncStorage to test the language selection flow */}
          <TouchableOpacity
            onPress={handleClearStorage}
            activeOpacity={0.7}
            className="mb-3 rounded-[22px] py-4 items-center justify-center border border-[#E5E7EB] bg-white"
          >
            <Text className="font-poppins-semibold text-[15px] text-[#6B7280]">
              Clear storage (dev)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSignOut}
            activeOpacity={0.85}
            className="bg-lingua-deep-purple rounded-[22px] py-4 items-center justify-center"
            style={{
              shadowColor: "#5B3BF6",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Text className="font-poppins-semibold text-[17px] text-white">
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
