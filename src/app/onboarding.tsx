import { images } from "@/constants/images";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OnboardingScreen() {
  const router = useRouter();

  const handleGetStarted = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View className="flex-1 px-6 pt-2 pb-4 justify-between">
        {/* Top Header Logo */}
        <View className="flex-row items-center justify-center pt-2">
          <Image
            source={images.mascotLogo}
            style={{ width: 40, height: 40 }}
            resizeMode="contain"
          />
          <Text className="font-poppins-bold text-[26px] text-[#0D132B] ml-2 tracking-tight">
            muolingo
          </Text>
        </View>

        {/* Text Section */}
        <View className="mt-4 px-2">
          <Text className="font-poppins-bold text-[30px] leading-[38px] text-[#0D132B]">
            Your AI language
          </Text>
          <Text className="font-poppins-bold text-[30px] leading-[38px] text-[#5B3BF6]">
            teacher
            <Text className="text-[#0D132B]">.</Text>
          </Text>
          <Text className="font-poppins text-[15px] leading-[23px] text-[#6B7280] mt-2.5">
            Real conversations, personalized{"\n"}lessons, anytime, anywhere.
          </Text>
        </View>

        {/* Mascot & Floating Speech Bubbles Container */}
        <View className="flex-1 items-center justify-center relative my-2 min-h-[220px] max-h-[360px]">
          {/* Bubble 1: "Hello!" (Top-Left) */}
          <View
            className="absolute top-1 left-2 bg-[#EBF5FF] px-3.5 py-2 rounded-2xl border border-[#D0E7FF]/60 shadow-sm z-10"
            style={{
              shadowColor: "#4D8BFF",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 6,
              elevation: 2,
            }}
          >
            <Text className="font-poppins-semibold text-[15px] text-[#0D132B]">
              Hello!
            </Text>
            {/* Bubble Tail */}
            <View
              className="absolute -bottom-1.5 right-4 w-3 h-3 bg-[#EBF5FF] border-r border-b border-[#D0E7FF]/60"
              style={{ transform: [{ rotate: "45deg" }] }}
            />
          </View>

          {/* Bubble 2: "¡Hola!" (Top-Right) */}
          <View
            className="absolute top-0 right-3 bg-[#F4F0FF] px-3.5 py-2 rounded-2xl border border-[#E9DDFD]/60 shadow-sm z-10"
            style={{
              shadowColor: "#5B3BF6",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 6,
              elevation: 2,
            }}
          >
            <Text className="font-poppins-semibold text-[15px] text-[#5B3BF6]">
              ¡Hola!
            </Text>
            {/* Bubble Tail */}
            <View
              className="absolute -bottom-1.5 left-4 w-3 h-3 bg-[#F4F0FF] border-r border-b border-[#E9DDFD]/60"
              style={{ transform: [{ rotate: "45deg" }] }}
            />
          </View>

          {/* Bubble 3: "你好!" (Middle-Right) */}
          <View
            className="absolute top-[76px] right-0 bg-[#FFF0ED] px-3.5 py-2 rounded-2xl border border-[#FFE0D8]/60 shadow-sm z-10"
            style={{
              shadowColor: "#FF4D4F",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 6,
              elevation: 2,
            }}
          >
            <Text className="font-poppins-semibold text-[15px] text-[#FF4D4F]">
              你好!
            </Text>
            {/* Bubble Tail */}
            <View
              className="absolute top-3 -left-1.5 w-3 h-3 bg-[#FFF0ED] border-l border-b border-[#FFE0D8]/60"
              style={{ transform: [{ rotate: "45deg" }] }}
            />
          </View>

          {/* Mascot Image - Scaling dynamically */}
          <Image
            source={images.mascotWelcome}
            style={{ width: "100%", height: "100%", maxHeight: 280 }}
            resizeMode="contain"
          />
        </View>

        {/* Bottom CTA Section */}
        <View className="mb-2 shrink-0">
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleGetStarted}
            className="bg-[#5B3BF6] rounded-[24px] py-4 px-6 flex-row items-center justify-between shadow-md"
            style={{
              shadowColor: "#5B3BF6",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 10,
              elevation: 5,
            }}
          >
            <View style={{ width: 24 }} />

            <Text className="font-poppins-semibold text-[18px] text-white text-center">
              Get Started
            </Text>

            <View className="w-6 items-end justify-center">
              <SymbolView
                name="chevron.right"
                size={18}
                weight="bold"
                tintColor="#FFFFFF"
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
