import type { Language } from "@/types/learning";
import { SymbolView } from "expo-symbols";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface LanguageCardProps {
  language: Language;
  selected: boolean;
  onPress: (language: Language) => void;
}

export default function LanguageCard({
  language,
  selected,
  onPress,
}: LanguageCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onPress(language)}
      className={`flex-row items-center rounded-[20px] px-4 py-3.5 mb-3 border ${
        selected
          ? "border-[#5B3BF6] bg-[#F6F4FE]"
          : "border-[#F0F0F3] bg-white"
      }`}
      style={
        selected
          ? undefined
          : {
              shadowColor: "#0D132B",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.05,
              shadowRadius: 10,
              elevation: 2,
            }
      }
    >
      {/* Flag */}
      <View className="w-[52px] h-[52px] rounded-full overflow-hidden bg-[#F1F5F9]">
        <Image
          source={{ uri: language.flag }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      </View>

      {/* Name + learners */}
      <View className="flex-1 ml-4">
        <Text className="font-poppins-semibold text-[18px] text-[#0D132B]">
          {language.name}
        </Text>
        <Text className="font-poppins text-[14px] text-[#6B7280] mt-0.5">
          {language.learners}
        </Text>
      </View>

      {/* Trailing indicator */}
      {selected ? (
        <View className="w-8 h-8 rounded-full bg-[#5B3BF6] items-center justify-center">
          <Text
            className="text-white"
            style={{ fontSize: 16, lineHeight: 18, fontWeight: "900" }}
          >
            ✓
          </Text>
        </View>
      ) : (
        <SymbolView
          name="chevron.right"
          size={18}
          weight="semibold"
          tintColor="#94A3B8"
        />
      )}
    </TouchableOpacity>
  );
}
