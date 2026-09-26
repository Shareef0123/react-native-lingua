import BookmarkIcon from "@/assets/icons/bookmark.svg";
import CheckIcon from "@/assets/icons/check.svg";
import ChevronLeftIcon from "@/assets/icons/chevron-left.svg";
import LockIcon from "@/assets/icons/lock.svg";
import { images } from "@/constants/images";
import { getLessonsForLanguage } from "@/data/lessons";
import { useLanguageStore } from "@/store/language";
import type { Lesson } from "@/types/learning";
import { Image as ExpoImage } from "expo-image";
import { router } from "expo-router";
import { styled } from "nativewind";
import { useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// expo-image isn't NativeWind-aware by default, so wrap it with styled() to
// map `className` onto its `style` — lets us size/position images with Tailwind.
const Image = styled(ExpoImage, { className: "style" });

// Lesson status is mock/local for now (no XP/progress store yet). The lesson the
// learner is currently on is `activeIndex`: everything before it is completed,
// that lesson is in progress, and everything after is not started yet.
type LessonStatus = "completed" | "in-progress" | "not-started";

// Subtle card elevation — shadow syntax differs per platform, so it lives in a
// style object rather than NativeWind classes (see AGENTS Style Exception rules).
const cardShadow = {
  shadowColor: "#0D132B",
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.05,
  shadowRadius: 12,
  elevation: 2,
} as const;

// Each lesson shows its own image on the in-progress card. There are no per-lesson
// art assets yet, so we fall back to a stable Picsum placeholder seeded by id.
function lessonImageUri(lessonId: string): string {
  return `https://picsum.photos/seed/lingua-${lessonId}/120`;
}

export default function LearnScreen() {
  const selectedLanguage = useLanguageStore((s) => s.selectedLanguage);

  const lessons = useMemo(
    () => (selectedLanguage ? getLessonsForLanguage(selectedLanguage.id) : []),
    [selectedLanguage]
  );

  // Mock "current lesson" so the screen shows completed + in-progress + locked
  // states like the design (clamped for languages with fewer lessons).
  const activeIndex = Math.min(2, Math.max(lessons.length - 1, 0));
  const [tab, setTab] = useState<"lessons" | "practice">("lessons");

  if (!selectedLanguage) return null;

  const statusFor = (index: number): LessonStatus => {
    if (index < activeIndex) return "completed";
    if (index === activeIndex) return "in-progress";
    return "not-started";
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }} edges={["top"]}>
      {/* Header: back control, unit/language title + progress, bookmark. */}
      <View className="flex-row items-center px-6 pt-1 pb-3">
        <TouchableOpacity
          activeOpacity={0.7}
          // Learn is a tab root, so it usually has no back history — only pop if
          // we actually navigated here from another screen. Kept for design parity.
          onPress={() => {
            if (router.canGoBack()) router.back();
          }}
          className="w-9 h-9 -ml-1 items-center justify-center"
        >
          <ChevronLeftIcon width={26} height={26} color="#0D132B" />
        </TouchableOpacity>

        <View className="flex-1 ml-1">
          <Text
            numberOfLines={1}
            className="font-poppins-bold text-[22px] text-[#0D132B]"
          >
            {selectedLanguage.name}
          </Text>
          {/* "A1" is a placeholder level — there's no CEFR field in the data yet. */}
          <Text className="font-poppins-medium text-[14px] text-[#9CA3AF] mt-0.5">
            A1 · {activeIndex + 1} / {lessons.length} lessons
          </Text>
        </View>

        <TouchableOpacity activeOpacity={0.7} className="w-9 h-9 items-center justify-center">
          <BookmarkIcon width={24} height={24} color="#FF9A03" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Hero banner — playful mascot on a soft sky + grass scene. */}
        <View className="h-[200px] bg-[#DCEBF9] overflow-hidden items-center justify-end">
          <View className="absolute -top-8 -right-6 w-28 h-28 rounded-full bg-white/50" />
          <View className="absolute bottom-0 left-0 right-0 h-14 bg-[#CFEAC7]" />
          <Image
            source={images.mascotWelcome}
            className="w-[186px] h-[186px]"
            contentFit="contain"
          />
        </View>

        {/* Segmented control floating over the hero's bottom edge. */}
        <View
          className="mx-6 -mt-8 flex-row rounded-2xl bg-white overflow-hidden"
          style={cardShadow}
        >
          {(["lessons", "practice"] as const).map((key) => {
            const active = tab === key;
            return (
              <TouchableOpacity
                key={key}
                activeOpacity={0.8}
                onPress={() => setTab(key)}
                className="flex-1 items-center pt-4 pb-4"
              >
                <Text
                  className={
                    active
                      ? "font-poppins-semibold text-[16px] text-lingua-purple"
                      : "font-poppins-medium text-[16px] text-[#9CA3AF]"
                  }
                >
                  {key === "lessons" ? "Lessons" : "Practice"}
                </Text>
                {active ? (
                  <View className="absolute bottom-0 h-[3px] w-24 rounded-full bg-lingua-purple" />
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>

        {tab === "lessons" ? (
          <View className="px-6 mt-5">
            {lessons.map((lesson, index) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                index={index}
                totalLessons={lessons.length}
                status={statusFor(index)}
                onPress={() =>
                  router.push({
                    pathname: "/ai-teacher",
                    params: { lessonId: lesson.id },
                  })
                }
              />
            ))}
          </View>
        ) : (
          <View className="px-6 mt-10 items-center">
            <Image
              source={images.mascotWelcome}
              className="w-28 h-28"
              contentFit="contain"
            />
            <Text className="font-poppins-semibold text-[18px] text-[#0D132B] mt-4">
              Practice mode
            </Text>
            <Text className="font-poppins text-[14px] text-[#9CA3AF] mt-1 text-center">
              Review words and phrases you&apos;ve learned. Coming soon!
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// A single lesson row. Every lesson is tappable (no locking) — tapping "opens"
// it by making it the current in-progress lesson.
function LessonCard({
  lesson,
  index,
  totalLessons,
  status,
  onPress,
}: {
  lesson: Lesson;
  index: number;
  totalLessons: number;
  status: LessonStatus;
  onPress: () => void;
}) {
  const inProgress = status === "in-progress";

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={cardShadow}
      className={`mb-3 flex-row items-center rounded-2xl px-5 py-4 ${
        inProgress
          ? "border-2 border-lingua-purple bg-[#F5F3FF]"
          : "border border-[#EFEFF3] bg-white"
      }`}
    >
      <View className="flex-1 pr-3">
        <Text
          className={`font-poppins text-[13px] ${
            inProgress ? "text-lingua-purple" : "text-[#9CA3AF]"
          }`}
        >
          Lesson {index + 1}
        </Text>
        <Text className="font-poppins-semibold text-[17px] text-[#0D132B] mt-0.5">
          {lesson.title}
        </Text>
        {status === "in-progress" ? (
          <Text className="font-poppins-medium text-[13px] text-lingua-purple mt-1">
            In progress
          </Text>
        ) : null}
        {status === "not-started" ? (
          <Text className="font-poppins text-[12px] text-[#9CA3AF] mt-1">
            0 / {totalLessons} lessons
          </Text>
        ) : null}
      </View>

      {status === "completed" ? (
        <View className="w-8 h-8 rounded-full bg-lingua-green items-center justify-center">
          <CheckIcon width={18} height={18} color="#FFFFFF" />
        </View>
      ) : null}

      {status === "in-progress" ? (
        <Image
          source={{ uri: lessonImageUri(lesson.id) }}
          className="w-12 h-12 rounded-xl bg-[#E9E4FF]"
          contentFit="cover"
        />
      ) : null}

      {/* The lock is a visual status cue only (matches the design). Every card
          is still tappable — there is no locking logic, per the feature spec. */}
      {status === "not-started" ? (
        <LockIcon width={22} height={22} color="#9CA3AF" />
      ) : null}
    </TouchableOpacity>
  );
}
