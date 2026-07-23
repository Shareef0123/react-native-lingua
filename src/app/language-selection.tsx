import { useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { images } from "@/constants/images";
import { LANGUAGES } from "@/data/languages";
import { Language } from "@/types/learning";

export default function LanguageSelectionScreen() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string>("es");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredLanguages = LANGUAGES.filter(
    (lang: Language) =>
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConfirm = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View className="flex-1 relative bg-white">
        {/* Fixed Top Header & Search Bar */}
        <View className="bg-white z-10">
          {/* Navigation Header */}
          <View className="flex-row items-center justify-between px-5 pt-2 pb-2">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.back()}
              className="w-10 h-10 items-center justify-center rounded-full active:bg-gray-100"
            >
              <SymbolView
                name="chevron.left"
                size={20}
                weight="semibold"
                tintColor="#0D132B"
              />
            </TouchableOpacity>

            <Text className="font-poppins-semibold text-[20px] text-[#0D132B]">
              Choose a language
            </Text>

            <View className="w-10" />
          </View>

          {/* Search Bar */}
          <View className="mx-5 my-2 flex-row items-center bg-[#F6F7FB] border border-[#E5E7EB] rounded-full px-4 py-3">
            <SymbolView name="magnifyingglass" size={18} tintColor="#9CA3AF" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search languages"
              placeholderTextColor="#9CA3AF"
              className="flex-1 ml-3 font-poppins text-[15px] text-[#0D132B] p-0"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <SymbolView name="xmark.circle.fill" size={18} tintColor="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Scrollable Language Options List */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 250,
          }}
        >
          {/* Section Header */}
          <Text className="font-poppins-bold text-[18px] text-[#0D132B] mt-3 mb-2">
            Popular
          </Text>

          {/* Languages List */}
          {filteredLanguages.map((lang: Language) => {
            const isSelected = selectedId === lang.id;
            return (
              <TouchableOpacity
                key={lang.id}
                activeOpacity={0.75}
                onPress={() => setSelectedId(lang.id)}
                className={`flex-row items-center justify-between p-4 mb-3 rounded-[24px] border ${
                  isSelected
                    ? "border-[#5B3BF6] bg-[#F4F0FF]/40 border-2"
                    : "border-[#E5E7EB] bg-white"
                }`}
              >
                {/* Flag & Text Info */}
                <View className="flex-row items-center flex-1 mr-3">
                  <View className="w-12 h-12 rounded-full overflow-hidden mr-3.5 bg-gray-100 items-center justify-center border border-gray-100">
                    <Image
                      source={{ uri: lang.flag }}
                      style={{ width: 48, height: 48, borderRadius: 24 }}
                      resizeMode="cover"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="font-poppins-semibold text-[16px] text-[#0D132B]">
                      {lang.name}
                    </Text>
                    <Text className="font-poppins text-[13px] text-[#6B7280] mt-0.5">
                      {lang.learners || "10M learners"}
                    </Text>
                  </View>
                </View>

                {/* Status Indicator */}
                {isSelected ? (
                  <View className="w-7 h-7 rounded-full bg-[#5B3BF6] items-center justify-center">
                    <SymbolView
                      name="checkmark"
                      size={14}
                      weight="bold"
                      tintColor="#FFFFFF"
                    />
                  </View>
                ) : (
                  <SymbolView
                    name="chevron.right"
                    size={16}
                    weight="medium"
                    tintColor="#9CA3AF"
                  />
                )}
              </TouchableOpacity>
            );
          })}

          {filteredLanguages.length === 0 && (
            <View className="items-center justify-center py-10">
              <Text className="font-poppins text-base text-[#6B7280]">
                No languages found
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Sticky Bottom Footer: White background container containing Continue Button + Fully Visible Earth Image */}
        <View className="absolute bottom-0 left-0 right-0 z-20 bg-white pt-2">
          {/* Continue Button */}
          <View className="w-full px-5 mb-2 z-10">
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleConfirm}
              className="w-full bg-[#5B3BF6] rounded-[24px] py-4 items-center justify-center shadow-lg"
              style={{
                shadowColor: "#5B3BF6",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.35,
                shadowRadius: 10,
                elevation: 6,
              }}
            >
              <Text className="font-poppins-semibold text-[17px] text-white">
                Continue
              </Text>
            </TouchableOpacity>
          </View>

          {/* Earth Image Illustration (Fully visible with solid white background behind) */}
          <View className="w-full items-center justify-center bg-white" pointerEvents="none">
            <Image
              source={images.earth}
              style={{ width: "100%", height: 160 }}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
