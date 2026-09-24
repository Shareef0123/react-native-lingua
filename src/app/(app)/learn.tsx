import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LearnScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View className="flex-1 items-center justify-center px-6">
        <Text className="h2 text-[#0D132B]">Learn</Text>
        <Text className="body-md text-[#6B7280] mt-1">Coming soon</Text>
      </View>
    </SafeAreaView>
  );
}
