import { useAuth } from "@clerk/clerk-expo";
import { Link, Redirect } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const { isLoaded, isSignedIn } = useAuth();

  if (isLoaded && isSignedIn) {
    return <Redirect href="/home" />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="font-poppins-bold text-3xl text-[#0D132B] mb-2">
          muolingo
        </Text>
        <Text className="font-poppins text-base text-[#6B7280] mb-8 text-center">
          Learn languages with your AI teacher
        </Text>

        <Link href="/onboarding" asChild>
          <TouchableOpacity
            activeOpacity={0.8}
            className="bg-[#5B3BF6] px-8 py-4 rounded-[20px]"
            style={{
              shadowColor: "#5B3BF6",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Text className="font-poppins-semibold text-white text-base">
              Open Onboarding Screen
            </Text>
          </TouchableOpacity>
        </Link>

        {/* Link to the language selection screen */}
        <Link href="/language-selection" asChild>
          <TouchableOpacity activeOpacity={0.7} className="mt-4 px-8 py-3">
            <Text className="font-poppins-semibold text-[#5B3BF6] text-base">
              Choose a language
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}

