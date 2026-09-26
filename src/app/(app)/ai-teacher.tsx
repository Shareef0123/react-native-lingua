import BellIcon from "@/assets/icons/bell.svg";
import ChevronLeftIcon from "@/assets/icons/chevron-left.svg";
import MicIcon from "@/assets/icons/mic.svg";
import PhoneEndIcon from "@/assets/icons/phone-end.svg";
import ProfileIcon from "@/assets/icons/profile.svg";
import SpeakerIcon from "@/assets/icons/speaker.svg";
import SubtitlesIcon from "@/assets/icons/subtitles.svg";
import VideoIcon from "@/assets/icons/video.svg";
import { images } from "@/constants/images";
import { getLanguageById } from "@/data/languages";
import { getLessonById, getLessonsForLanguage } from "@/data/lessons";
import { useLessonCall } from "@/hooks/useLessonCall";
import { useLanguageStore } from "@/store/language";
import { useUser } from "@clerk/clerk-expo";
import { Image as ExpoImage } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { styled } from "nativewind";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// expo-image isn't NativeWind-aware by default, so wrap it with styled() to
// map `className` onto its `style` — lets us size/position images with Tailwind.
const Image = styled(ExpoImage, { className: "style" });

// Subtle card elevation — shadow syntax differs per platform, so it lives in a
// style object rather than NativeWind classes (see AGENTS Style Exception rules).
const cardShadow = {
  shadowColor: "#0D132B",
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.08,
  shadowRadius: 14,
  elevation: 3,
} as const;

// Lesson feedback is mock for now — there's no real speech evaluation yet.
const FEEDBACK = [
  { label: "Speaking", value: "Excellent", color: "#21C16B" },
  { label: "Pronunciation", value: "Great", color: "#4D8BFF" },
  { label: "Grammar", value: "Good", color: "#6C4EF5" },
] as const;

// Shown in the teacher bubble when a lesson has no greeting or phrases of its own.
const DEFAULT_LINE = { text: "¡Muy bien!", sub: "That was great! 👏" };

export default function AiTeacherScreen() {
  const params = useLocalSearchParams<{ lessonId?: string }>();
  const lessonId = Array.isArray(params.lessonId)
    ? params.lessonId[0]
    : params.lessonId;
  const selectedLanguage = useLanguageStore((s) => s.selectedLanguage);

  // Resolve the lesson from the tapped id; fall back to the selected language's
  // first AI-teacher lesson (or its first lesson) when opened from the tab.
  const lesson = useMemo(() => {
    if (lessonId) {
      const found = getLessonById(lessonId);
      if (found) return found;
    }
    if (selectedLanguage) {
      const langLessons = getLessonsForLanguage(selectedLanguage.id);
      return langLessons.find((l) => l.type === "ai-teacher") ?? langLessons[0];
    }
    return undefined;
  }, [lessonId, selectedLanguage]);

  const language = lesson ? getLanguageById(lesson.languageId) : selectedLanguage;

  // The lines the AI teacher can "speak": greeting first, then lesson phrases.
  const lines = useMemo(() => {
    if (!lesson) return [DEFAULT_LINE];
    const arr: { text: string; sub: string }[] = [];
    const greeting = lesson.aiTeacherPrompt?.initialGreeting;
    if (greeting) {
      arr.push({
        text: greeting,
        sub: lesson.aiTeacherPrompt?.topic ?? "Let's practice together!",
      });
    }
    lesson.phrases.forEach((p) => arr.push({ text: p.phrase, sub: p.translation }));
    return arr.length > 0 ? arr : [DEFAULT_LINE];
  }, [lesson]);

  const [lineIndex, setLineIndex] = useState(0);
  const [cameraOn, setCameraOn] = useState(true);
  const [subtitlesOn, setSubtitlesOn] = useState(true);

  // Real Stream audio call for this lesson: live status + mute/unmute + end.
  const { status, muted, toggleMute, endCall, retry } = useLessonCall({
    lessonId: lesson?.id,
    languageId: lesson?.languageId,
    lessonTitle: lesson?.title,
  });

  const { user } = useUser();
  const displayName = user?.firstName ?? user?.username ?? "You";

  const exit = () => {
    if (router.canGoBack()) router.back();
    else router.navigate("/learn");
  };

  // End Call leaves the Stream call, then navigates out of the lesson.
  const leaveAndExit = async () => {
    await endCall();
    exit();
  };

  if (!lesson || !language) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }} edges={["top"]}>
        <View className="flex-1 items-center justify-center px-8">
          <Text className="font-poppins-semibold text-[18px] text-[#0D132B]">
            No lesson selected
          </Text>
          <Text className="font-poppins text-[14px] text-[#9CA3AF] mt-1 text-center">
            Pick a lesson from the Learn tab to start an AI Teacher session.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const line = lines[Math.min(lineIndex, lines.length - 1)];

  // Map the call status to the header's session indicator.
  const statusLabel =
    status === "joined"
      ? "Online"
      : status === "connecting"
        ? "Connecting…"
        : status === "loading"
          ? "Starting lesson…"
          : status === "ended"
            ? "Call ended"
            : "Connection failed";
  const statusDotClass =
    status === "joined"
      ? "bg-lingua-green"
      : status === "error"
        ? "bg-error"
        : status === "ended"
          ? "bg-[#9CA3AF]"
          : "bg-warning";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }} edges={["top"]}>
      {/* Header: back, title + live session status, session chips. */}
      <View className="flex-row items-center px-6 pt-1 pb-3">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={exit}
          className="w-9 h-9 -ml-1 items-center justify-center"
        >
          <ChevronLeftIcon width={26} height={26} color="#0D132B" />
        </TouchableOpacity>

        <View className="flex-1 ml-1">
          <Text className="font-poppins-bold text-[20px] text-[#0D132B]">
            AI Teacher
          </Text>
          <TouchableOpacity
            activeOpacity={status === "error" || status === "ended" ? 0.6 : 1}
            onPress={status === "error" || status === "ended" ? retry : undefined}
            className="flex-row items-center mt-0.5"
          >
            <View className={`w-2 h-2 rounded-full mr-1.5 ${statusDotClass}`} />
            <Text className="font-poppins-medium text-[13px] text-[#9CA3AF]">
              {statusLabel}
              {status === "error" || status === "ended" ? " · Tap to retry" : ""}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center">
          <View className="w-9 h-9 rounded-full border border-[#EDEDF2] items-center justify-center">
            <VideoIcon width={18} height={18} color="#0D132B" />
          </View>
          <View className="w-9 h-9 rounded-full border border-[#EDEDF2] items-center justify-center ml-2">
            <Text className="font-poppins-semibold text-[13px] text-[#0D132B]">
              {lesson.xpReward}
            </Text>
          </View>
          <View className="w-9 h-9 rounded-full border border-[#EDEDF2] items-center justify-center ml-2">
            <BellIcon width={18} height={18} color="#0D132B" />
          </View>
        </View>
      </View>

      {/* Teacher "video" area — audio-only, so the mascot is a static preview. */}
      <View className="flex-1 mx-5 rounded-3xl overflow-hidden bg-[#E4DACB]">
        <View className="absolute -top-10 -left-8 w-40 h-40 rounded-full bg-white/20" />
        <View className="absolute bottom-8 -right-10 w-48 h-48 rounded-full bg-black/5" />

        <View className="flex-1 items-center justify-center">
          <Image
            source={images.mascotWelcome}
            className="w-[80%] h-[80%]"
            contentFit="contain"
          />
        </View>

        {/* Lesson context: language, title, and goal from the hardcoded data. */}
        <View className="absolute top-3 left-3 max-w-[58%] rounded-2xl bg-black/35 px-3 py-2">
          <View className="flex-row items-center">
            <Image
              source={{ uri: language.flag }}
              className="w-4 h-4 rounded-full mr-1.5"
              contentFit="cover"
            />
            <Text
              numberOfLines={1}
              className="font-poppins-semibold text-[13px] text-white"
            >
              {language.name}
            </Text>
          </View>
          <Text
            numberOfLines={1}
            className="font-poppins-medium text-[12px] text-white/90 mt-1"
          >
            {lesson.title}
          </Text>
          {lesson.goals[0] ? (
            <Text
              numberOfLines={1}
              className="font-poppins text-[11px] text-white/75 mt-0.5"
            >
              🎯 {lesson.goals[0]}
            </Text>
          ) : null}
        </View>

        {/* Self-view: camera is a placeholder only (audio-only experience). */}
        {cameraOn ? (
          <View className="absolute top-3 right-3 w-[86px] h-[112px] rounded-2xl overflow-hidden bg-[#2A2F45] items-center justify-center border-2 border-white/70">
            <ProfileIcon width={30} height={30} color="#FFFFFF" />
            <Text
              numberOfLines={1}
              className="font-poppins-medium text-[11px] text-white/90 mt-1 px-1"
            >
              {displayName}
            </Text>
            {muted ? (
              <View className="absolute bottom-1.5 flex-row items-center rounded-full bg-black/55 px-2 py-0.5">
                <MicIcon width={10} height={10} color="#FF4D4F" />
                <Text className="font-poppins-medium text-[9px] text-white ml-1">
                  Muted
                </Text>
              </View>
            ) : null}
          </View>
        ) : null}

        {/* Teacher response bubble — tap the speaker to hear the next line. */}
        <View className="absolute left-5 right-5 bottom-4">
          <View className="self-start max-w-[88%]">
            <View className="rounded-3xl bg-white px-4 py-3" style={cardShadow}>
              <View className="flex-row items-start">
                {/* `shrink` (not flex-1): flex-1 would collapse to 0 width
                    inside this hug-to-content bubble and hide the text. */}
                <View className="shrink pr-2">
                  <Text className="font-poppins-semibold text-[16px] text-[#0D132B]">
                    {line.text}
                  </Text>
                  {subtitlesOn ? (
                    <Text className="font-poppins text-[14px] text-[#6B7280] mt-0.5">
                      {line.sub}
                    </Text>
                  ) : null}
                </View>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setLineIndex((i) => (i + 1) % lines.length)}
                  className="pt-0.5"
                >
                  <SpeakerIcon width={24} height={24} color="#6C4EF5" />
                </TouchableOpacity>
              </View>
            </View>
            <View className="absolute -bottom-1 right-10 w-4 h-4 bg-white rotate-45" />
          </View>
        </View>
      </View>

      {/* Audio lesson controls. */}
      <View className="flex-row justify-between px-8 mt-4">
        <ControlButton
          label="Camera"
          active={cameraOn}
          onPress={() => setCameraOn((v) => !v)}
        >
          <VideoIcon width={26} height={26} color={cameraOn ? "#0D132B" : "#9CA3AF"} />
        </ControlButton>
        <ControlButton
          label={muted ? "Unmute" : "Mic"}
          active={!muted}
          onPress={toggleMute}
        >
          <MicIcon width={26} height={26} color={!muted ? "#0D132B" : "#9CA3AF"} />
        </ControlButton>
        <ControlButton
          label="Subtitles"
          active={subtitlesOn}
          onPress={() => setSubtitlesOn((v) => !v)}
        >
          <SubtitlesIcon
            width={26}
            height={26}
            color={subtitlesOn ? "#0D132B" : "#9CA3AF"}
          />
        </ControlButton>
        <ControlButton label="End Call" danger onPress={leaveAndExit}>
          <PhoneEndIcon width={26} height={26} color="#FFFFFF" />
        </ControlButton>
      </View>

      {/* Lesson feedback. */}
      <View
        className="mx-5 mt-4 mb-3 flex-row rounded-2xl bg-white px-2 py-4"
        style={cardShadow}
      >
        {FEEDBACK.map((item, index) => (
          <View
            key={item.label}
            className={`flex-1 items-center ${
              index > 0 ? "border-l border-[#EEF0F4]" : ""
            }`}
          >
            <Text className="font-poppins-semibold text-[14px] text-[#0D132B]">
              {item.label}
            </Text>
            <Text
              className="font-poppins-semibold text-[15px] mt-1.5"
              style={{ color: item.color }}
            >
              {item.value}
            </Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

// A round call-control button with a label underneath. `danger` renders the red
// end-call variant; `active` toggles the white vs. muted look.
function ControlButton({
  label,
  children,
  onPress,
  active = true,
  danger = false,
}: {
  label: string;
  children: ReactNode;
  onPress: () => void;
  active?: boolean;
  danger?: boolean;
}) {
  return (
    <View className="items-center">
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        style={cardShadow}
        className={`w-[62px] h-[62px] rounded-full items-center justify-center ${
          danger ? "bg-error" : active ? "bg-white" : "bg-[#EDEDF2]"
        }`}
      >
        {children}
      </TouchableOpacity>
      <Text className="font-poppins-medium text-[12px] text-[#4B5563] mt-2">
        {label}
      </Text>
    </View>
  );
}
