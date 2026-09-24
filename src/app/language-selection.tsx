import LanguageCard from "@/components/LanguageCard";
import { images } from "@/constants/images";
import { getLanguages } from "@/data/languages";
import { useLanguageStore } from "@/store/language";
import type { Language } from "@/types/learning";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useMemo, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LanguageSelectionScreen() {
  const router = useRouter();
  const setLanguage = useLanguageStore((s) => s.setLanguage);
  const allLanguages = useMemo(() => getLanguages(), []);

  const [selectedId, setSelectedId] = useState<string>(allLanguages[0]?.id);
  const [query, setQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const trimmedQuery = query.trim().toLowerCase();
  const isSearching = trimmedQuery.length > 0;

  const visibleLanguages = useMemo(() => {
    if (!isSearching) return allLanguages;
    return allLanguages.filter((l) =>
      l.name.toLowerCase().includes(trimmedQuery)
    );
  }, [allLanguages, isSearching, trimmedQuery]);

  const selectedLanguage = allLanguages.find((l) => l.id === selectedId);

  const handleSelect = (language: Language) => {
    setSelectedId(language.id);
  };

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/");
  };

  const handleConfirm = () => {
    if (!selectedLanguage) return;
    // Persist the chosen language, then head to the home route.
    setLanguage(selectedLanguage);
    router.replace("/home");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }} edges={["top"]}>
      {/* Fixed header */}
      <View className="flex-row items-center justify-center px-6 pt-2 pb-4">
        <TouchableOpacity
          onPress={handleBack}
          activeOpacity={0.7}
          className="absolute left-6 w-10 h-10 items-center justify-center -ml-2 rounded-full"
        >
          <SymbolView
            name="chevron.left"
            size={22}
            weight="bold"
            tintColor="#0D132B"
          />
        </TouchableOpacity>
        <Text className="h3 text-[#0D132B]">Choose a language</Text>
      </View>

      {/* Fixed search */}
      <View className="px-6">
        <View
          className={`flex-row items-center rounded-full px-4 h-[52px] ${
            isSearchFocused
              ? "bg-white border border-lingua-deep-purple"
              : "bg-[#F5F5F7]"
          }`}
        >
          <SymbolView
            name="magnifyingglass"
            size={18}
            weight="regular"
            tintColor="#9CA3AF"
          />
          <TextInput
            value={query}
            onChangeText={setQuery}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            placeholder="Search languages"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none"
            autoCorrect={false}
            style={{
              flex: 1,
              marginLeft: 10,
              fontSize: 16,
              fontFamily: "Poppins-Regular",
              color: "#0D132B",
            }}
          />
        </View>
      </View>

      {/* Fixed section label */}
      {!isSearching && (
        <Text className="font-poppins-bold text-[18px] text-[#0D132B] px-6 mt-6 mb-3">
          Popular
        </Text>
      )}

      {/* Scrollable language list (this is the ONLY scrollable area) */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: isSearching ? 20 : 0,
          paddingBottom: 8,
        }}
      >
        {visibleLanguages.map((language) => (
          <LanguageCard
            key={language.id}
            language={language}
            selected={language.id === selectedId}
            onPress={handleSelect}
          />
        ))}

        {isSearching && visibleLanguages.length === 0 && (
          <Text className="font-poppins text-[14px] text-[#6B7280] text-center mt-4">
            No languages match &quot;{query.trim()}&quot;.
          </Text>
        )}
      </ScrollView>

      {/* Fixed footer: confirmation button + earth illustration */}
      <View>
        <View className="px-6 pt-2">
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleConfirm}
            disabled={!selectedLanguage}
            className="bg-lingua-deep-purple rounded-[22px] py-4 items-center justify-center"
            style={{
              shadowColor: "#5B3BF6",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 8,
              elevation: 4,
              opacity: selectedLanguage ? 1 : 0.6,
            }}
          >
            <Text className="font-poppins-semibold text-[17px] text-white">
              {selectedLanguage
                ? `Continue with ${selectedLanguage.name}`
                : "Choose a language"}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="w-full items-center mt-3 px-6" pointerEvents="none">
          <Image
            source={images.earth}
            style={{ width: "100%", height: 170 }}
            resizeMode="cover"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
