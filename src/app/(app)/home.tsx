import BellIcon from "@/assets/icons/bell.svg";
import CheckIcon from "@/assets/icons/check.svg";
import HeadphonesIcon from "@/assets/icons/headphones.svg";
import BookIcon from "@/assets/icons/learn.svg";
import WordsIcon from "@/assets/icons/words.svg";
import { images } from "@/constants/images";
import { getLessonsForLanguage } from "@/data/lessons";
import { getUnitById } from "@/data/units";
import { useLanguageStore } from "@/store/language";
import { useUser } from "@clerk/clerk-expo";
import { Image as ExpoImage } from "expo-image";
import { Link } from "expo-router";
import { styled } from "nativewind";
import type { FC } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { SvgProps } from "react-native-svg";

// expo-image isn't NativeWind-aware by default, so wrap it with styled() to
// map `className` onto its `style` — lets us size/position images with Tailwind.
const Image = styled(ExpoImage, { className: "style" });

// Native "hello" per language, so the greeting matches the chosen language.
const HELLO: Record<string, string> = {
  es: "Hola",
  fr: "Bonjour",
  de: "Hallo",
  it: "Ciao",
  ja: "こんにちは",
  kr: "안녕하세요",
  zh: "你好",
};

// Daily goal + streak have no data source yet (no XP store), so these are
// placeholder demo values matching the design until that feature lands.
const EARNED_XP = 15;
const DAILY_GOAL_XP = 20;
const STREAK = 12;

export default function HomeScreen() {
  const { user } = useUser();
  const selectedLanguage = useLanguageStore((s) => s.selectedLanguage);

  const firstName =
    user?.firstName ||
    user?.primaryEmailAddress?.emailAddress?.split("@")[0] ||
    "there";
  const hello = (selectedLanguage && HELLO[selectedLanguage.code]) || "Hello";

  // Derive the current lesson / unit / today's plan from the learning data.
  const lessons = selectedLanguage
    ? getLessonsForLanguage(selectedLanguage.id)
    : [];
  const currentLesson =
    lessons.find((l) => l.type === "standard") ?? lessons[0];
  const currentUnit = currentLesson
    ? getUnitById(currentLesson.unitId)
    : undefined;
  const aiLesson = lessons.find((l) => l.type === "ai-teacher");
  const wordsCount = currentLesson?.vocabulary.length ?? 0;

  const progress = Math.min(EARNED_XP / DAILY_GOAL_XP, 1);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 8, paddingBottom: 28 }}
      >
        {/* Header: flag + greeting on the left, streak + bell on the right. */}
        <View className="flex-row items-center justify-between mt-1">
          <View className="flex-row items-center flex-1 mr-3">
            <View className="w-10 h-10 rounded-full overflow-hidden bg-[#F1F5F9]">
              {selectedLanguage ? (
                <Image
                  source={{ uri: selectedLanguage.flag }}
                  className="w-full h-full"
                  contentFit="cover"
                />
              ) : null}
            </View>
            <Text
              numberOfLines={1}
              className="font-poppins-bold text-[20px] text-[#0D132B] ml-3 flex-1"
            >
              {hello}, {firstName}! 👋
            </Text>
          </View>

          <View className="flex-row items-center">
            <View className="flex-row items-center mr-4">
              <Image
                source={images.streakFire}
                className="w-[22px] h-[22px]"
                contentFit="contain"
              />
              <Text className="font-poppins-bold text-[16px] text-[#0D132B] ml-1">
                {STREAK}
              </Text>
            </View>
            <BellIcon width={24} height={24} color="#0D132B" />
          </View>
        </View>

        {/* Daily goal card */}
        <View className="mt-6 rounded-[20px] bg-[#FFF3E8] p-5 overflow-hidden">
          <Text className="font-poppins-medium text-[15px] text-[#0D132B]">
            Daily goal
          </Text>
          <View className="flex-row items-baseline mt-1">
            <Text className="font-poppins-bold text-[28px] text-[#0D132B]">
              {EARNED_XP}
            </Text>
            <Text className="font-poppins-medium text-[15px] text-[#9CA3AF] ml-1">
              / {DAILY_GOAL_XP} XP
            </Text>
          </View>

          {/* Progress bar — width is a runtime value, so it stays inline. */}
          <View className="h-2.5 rounded-full bg-[#F7DCC0] mt-4 overflow-hidden">
            <View
              className="h-full rounded-full bg-[#FF9A03]"
              style={{ width: `${progress * 100}%` }}
            />
          </View>

          <Image
            source={images.treasure}
            className="absolute right-3 top-3 w-24 h-24"
            contentFit="contain"
          />
        </View>

        {/* Continue learning card */}
        <View className="mt-4 rounded-[24px] bg-lingua-purple p-5 overflow-hidden">
          <Text className="font-poppins-medium text-[14px] text-white/85">
            Continue learning
          </Text>
          <Text className="font-poppins-bold text-[26px] text-white mt-1">
            {selectedLanguage?.name ?? "Your language"}
          </Text>
          <Text className="font-poppins-medium text-[15px] text-white/90 mt-0.5">
            A1 · Unit {currentUnit?.order ?? 1}
          </Text>

          <Link href="/learn" asChild>
            <TouchableOpacity
              activeOpacity={0.85}
              className="mt-4 self-start rounded-full bg-white px-6 py-3"
            >
              <Text className="font-poppins-semibold text-[15px] text-lingua-purple">
                Continue
              </Text>
            </TouchableOpacity>
          </Link>

          <Image
            source={images.palace}
            className="absolute -right-2 -bottom-1.5 w-[168px] h-[168px]"
            contentFit="contain"
          />
        </View>

        {/* Today's plan */}
        <View className="mt-7 flex-row items-center justify-between">
          <Text className="font-poppins-bold text-[20px] text-[#0D132B]">
            Today&apos;s plan
          </Text>
          <Link href="/learn" asChild>
            <TouchableOpacity activeOpacity={0.7}>
              <Text className="font-poppins-semibold text-[15px] text-lingua-purple">
                View all
              </Text>
            </TouchableOpacity>
          </Link>
        </View>

        <View className="mt-4">
          <PlanRow
            Icon={BookIcon}
            iconBgClass="bg-lingua-purple"
            title="Lesson"
            subtitle={currentLesson?.title ?? "Start learning"}
            done
          />
          <PlanRow
            Icon={HeadphonesIcon}
            iconBgClass="bg-lingua-purple"
            title="AI Conversation"
            subtitle={aiLesson?.aiTeacherPrompt?.topic ?? "Talk about your day"}
          />
          <PlanRow
            Icon={WordsIcon}
            iconBgClass="bg-[#FF7A6B]"
            title="New words"
            subtitle={`${wordsCount} words`}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// A single row in the "Today's plan" list: colored icon square, title +
// subtitle, and a completion status (filled check when done, empty ring when not).
function PlanRow({
  Icon,
  iconBgClass,
  title,
  subtitle,
  done = false,
}: {
  Icon: FC<SvgProps>;
  iconBgClass: string;
  title: string;
  subtitle: string;
  done?: boolean;
}) {
  return (
    <View className="flex-row items-center mb-4">
      <View
        className={`w-12 h-12 rounded-[14px] items-center justify-center ${iconBgClass}`}
      >
        <Icon width={24} height={24} color="#FFFFFF" />
      </View>

      <View className="flex-1 ml-3">
        <Text className="font-poppins-semibold text-[16px] text-[#0D132B]">
          {title}
        </Text>
        <Text className="font-poppins text-[13px] text-[#6B7280] mt-0.5">
          {subtitle}
        </Text>
      </View>

      {done ? (
        <View className="w-7 h-7 rounded-full bg-lingua-deep-purple items-center justify-center">
          <CheckIcon width={16} height={16} color="#FFFFFF" />
        </View>
      ) : (
        <View className="w-7 h-7 rounded-full border-2 border-[#E5E7EB]" />
      )}
    </View>
  );
}
