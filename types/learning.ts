// Shared content types for the duolingo-clone learning data (data/*.ts).
// No database — all content is hardcoded and typed against these shapes.

export interface Language {
  id: string;
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  description?: string;
  totalUnits: number;
  accentColor: string;
  order: number;
  learners?: string;
}

export interface Unit {
  id: string;
  languageId: string;
  order: number;
  title: string;
  description: string;
  color: string;
  icon: string;
  totalLessons: number;
}

export interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  phonetic?: string;
  exampleSentence?: string;
}

export interface Phrase {
  id: string;
  phrase: string;
  translation: string;
  context?: string;
}

export interface ActivityOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface MatchingPair {
  id: string;
  leftText: string;
  rightText: string;
}

export interface AITeacherPrompt {
  role: string;
  persona: string;
  topic: string;
  goal: string;
  systemPrompt: string;
  initialGreeting: string;
}

export type ActivityType =
  | 'standard'
  | 'multiple-choice'
  | 'translate'
  | 'matching'
  | 'fill-in-blank'
  | 'ai-teacher';

export interface LessonActivity {
  id: string;
  type: ActivityType;
  prompt: string;
  options?: ActivityOption[];
  correctAnswer?: string;
  textToTranslate?: string;
  pairs?: MatchingPair[];
  sentenceTokens?: string[];
  blankIndex?: number;
  aiTeacherPrompt?: AITeacherPrompt;
}

export type LessonType = ActivityType;

export interface Lesson {
  id: string;
  unitId: string;
  languageId: string;
  order: number;
  title: string;
  description: string;
  type: LessonType;
  xpReward: number;
  estimatedMinutes: number;
  goals: string[];
  vocabulary: VocabularyItem[];
  phrases: Phrase[];
  activities: LessonActivity[];
  aiTeacherPrompt?: AITeacherPrompt;
}
