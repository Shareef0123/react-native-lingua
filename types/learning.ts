export type LessonType = 'standard' | 'practice' | 'ai-teacher' | 'quiz';

export type ActivityType =
  | 'multiple-choice'
  | 'translate'
  | 'fill-in-blank'
  | 'matching'
  | 'audio-listen'
  | 'ai-teacher';

export type ActivityOption = {
  id: string;
  text: string;
  isCorrect: boolean;
  image?: string;
  audioUrl?: string;
};

export type MatchingPair = {
  id: string;
  leftText: string;
  rightText: string;
};

export type AITeacherPrompt = {
  role: string;
  persona: string;
  topic: string;
  goal: string;
  systemPrompt: string;
  initialGreeting: string;
};

export type VocabularyItem = {
  id: string;
  word: string;
  translation: string;
  phonetic?: string;
  exampleSentence?: string;
  audioUrl?: string;
};

export type PhraseItem = {
  id: string;
  phrase: string;
  translation: string;
  context?: string;
  audioUrl?: string;
};

export type Activity = {
  id: string;
  type: ActivityType;
  prompt: string;
  textToTranslate?: string;
  options?: ActivityOption[];
  correctAnswer?: string | string[];
  pairs?: MatchingPair[];
  sentenceTokens?: string[];
  blankIndex?: number;
  aiTeacherPrompt?: AITeacherPrompt;
};

export type Lesson = {
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
  phrases: PhraseItem[];
  activities: Activity[];
  aiTeacherPrompt?: AITeacherPrompt;
};

export type Unit = {
  id: string;
  languageId: string;
  order: number;
  title: string;
  description: string;
  color: string;
  icon?: string;
  totalLessons: number;
};

export type Language = {
  id: string;
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  description: string;
  totalUnits: number;
  accentColor: string;
  order: number;
  learners?: string;
};
