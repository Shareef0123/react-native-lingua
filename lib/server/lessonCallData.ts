// SERVER-ONLY. Builds the Stream call's custom data for an AI-teacher audio
// lesson from our hardcoded lesson content. The Vision Agent reads this custom
// data when it joins the call, so everything the teacher needs to run the lesson
// (target language, goals, vocabulary, phrases, and the AI teacher prompt) is
// packed here — no secrets, just lesson content.
//
// Imported only by Expo Router API routes (`+api.ts`). The lesson/language data
// files are pure TS (they import types only), so they are safe on the server.
import { getLanguageById } from "@/data/languages";
import { getLessonById } from "@/data/lessons";

// A plain multi-party audio session. `audio_room` is the semantically correct
// call type for a voice room (learner + AI teacher) and — unlike `default` —
// needs an explicit `goLive()` before members can publish, which is what lets us
// gate publishing to admins (the learner and the AI teacher).
export const LESSON_CALL_TYPE = "audio_room";

// The Stream user id the Python Vision Agent joins as (see vision-agent/agent.py,
// `User(id="ai-teacher")`). Kept in one place so the backend grants permissions
// to the same id the agent uses.
export const AI_TEACHER_USER_ID = "ai-teacher";

// Stream call ids allow letters, numbers, "_" and "-". Sanitize defensively.
function sanitizeId(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "-");
}

// Deterministic call id per (lesson, user) so re-entering the lesson resumes the
// same call, and the stream-call + agent-session routes always target the same one.
export function lessonCallId(lessonId: string, userId: string) {
  return sanitizeId(`lesson-${lessonId}-${userId}`);
}

// The shape the Python agent expects to read from `call.custom`. Keep this in
// sync with `_read_lesson_context()` in vision-agent/agent.py.
export type LessonCallCustom = {
  kind: "ai-teacher-audio";
  lessonId: string;
  lessonTitle: string;
  lessonDescription: string;
  languageId: string;
  languageName: string;
  languageNativeName: string;
  goals: string[];
  vocabulary: { word: string; translation: string; phonetic?: string }[];
  phrases: { phrase: string; translation: string; context?: string }[];
  // Flattened AI teacher prompt (null when the lesson has none). Flattened rather
  // than nested so it maps cleanly onto Stream's custom-data key/value store.
  aiTeacherRole: string | null;
  aiTeacherPersona: string | null;
  aiTeacherTopic: string | null;
  aiTeacherGoal: string | null;
  aiTeacherSystemPrompt: string | null;
  aiTeacherGreeting: string | null;
};

// Build the custom-data payload for a lesson, or null if the lesson is unknown.
export function buildLessonCallCustom(lessonId: string): LessonCallCustom | null {
  const lesson = getLessonById(lessonId);
  if (!lesson) return null;

  const language = getLanguageById(lesson.languageId);
  const prompt = lesson.aiTeacherPrompt ?? null;

  return {
    kind: "ai-teacher-audio",
    lessonId: lesson.id,
    lessonTitle: lesson.title,
    lessonDescription: lesson.description,
    languageId: lesson.languageId,
    languageName: language?.name ?? lesson.languageId,
    languageNativeName: language?.nativeName ?? language?.name ?? lesson.languageId,
    goals: lesson.goals,
    // Keep only the fields the teacher actually uses to keep custom data small.
    vocabulary: lesson.vocabulary.map((v) => ({
      word: v.word,
      translation: v.translation,
      phonetic: v.phonetic,
    })),
    phrases: lesson.phrases.map((p) => ({
      phrase: p.phrase,
      translation: p.translation,
      context: p.context,
    })),
    aiTeacherRole: prompt?.role ?? null,
    aiTeacherPersona: prompt?.persona ?? null,
    aiTeacherTopic: prompt?.topic ?? null,
    aiTeacherGoal: prompt?.goal ?? null,
    aiTeacherSystemPrompt: prompt?.systemPrompt ?? null,
    aiTeacherGreeting: prompt?.initialGreeting ?? null,
  };
}
