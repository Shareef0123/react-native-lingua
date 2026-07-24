import { Lesson } from '../types/learning';

export const LESSONS: Lesson[] = [
  // Spanish Unit 1 Lessons
  {
    id: 'es-lesson-1',
    unitId: 'es-unit-1',
    languageId: 'es',
    order: 1,
    title: 'Basic Greetings',
    description: 'Learn how to say hello, goodbye, and introduce yourself in Spanish.',
    type: 'standard',
    xpReward: 15,
    estimatedMinutes: 3,
    goals: [
      'Say hello and goodbye in Spanish',
      'Learn basic courtesy words like "please" and "thank you"',
      'Recognize common Spanish greetings',
    ],
    vocabulary: [
      {
        id: 'vocab-es-1',
        word: 'Hola',
        translation: 'Hello',
        phonetic: 'OH-lah',
        exampleSentence: '¡Hola! ¿Cómo estás?',
      },
      {
        id: 'vocab-es-2',
        word: 'Buenos días',
        translation: 'Good morning',
        phonetic: 'BWAY-nos DEE-as',
        exampleSentence: 'Buenos días, señor.',
      },
      {
        id: 'vocab-es-3',
        word: 'Gracias',
        translation: 'Thank you',
        phonetic: 'GRAH-see-as',
        exampleSentence: 'Muchas gracias por la ayuda.',
      },
      {
        id: 'vocab-es-4',
        word: 'Por favor',
        translation: 'Please',
        phonetic: 'por fah-VOR',
        exampleSentence: 'Un café, por favor.',
      },
      {
        id: 'vocab-es-5',
        word: 'Adiós',
        translation: 'Goodbye',
        phonetic: 'ah-dee-OS',
        exampleSentence: '¡Adiós! Hasta luego.',
      },
    ],
    phrases: [
      {
        id: 'phrase-es-1',
        phrase: '¿Cómo te llamas?',
        translation: 'What is your name?',
        context: 'Used when meeting someone new',
      },
      {
        id: 'phrase-es-2',
        phrase: 'Me llamo Alex',
        translation: 'My name is Alex',
        context: 'Introducing yourself',
      },
      {
        id: 'phrase-es-3',
        phrase: 'Mucho gusto',
        translation: 'Nice to meet you',
        context: 'Polite response after introduction',
      },
    ],
    activities: [
      {
        id: 'act-es-1-1',
        type: 'multiple-choice',
        prompt: 'Select the correct translation for "Hello"',
        options: [
          { id: 'opt-1', text: 'Hola', isCorrect: true },
          { id: 'opt-2', text: 'Adiós', isCorrect: false },
          { id: 'opt-3', text: 'Gracias', isCorrect: false },
          { id: 'opt-4', text: 'Por favor', isCorrect: false },
        ],
        correctAnswer: 'Hola',
      },
      {
        id: 'act-es-1-2',
        type: 'translate',
        prompt: 'Translate this sentence into English',
        textToTranslate: 'Buenos días, ¿cómo estás?',
        options: [
          { id: 'opt-2-1', text: 'Good morning, how are you?', isCorrect: true },
          { id: 'opt-2-2', text: 'Good night, thank you', isCorrect: false },
          { id: 'opt-2-3', text: 'Hello, what is your name?', isCorrect: false },
        ],
        correctAnswer: 'Good morning, how are you?',
      },
      {
        id: 'act-es-1-3',
        type: 'matching',
        prompt: 'Match the Spanish words with their English meanings',
        pairs: [
          { id: 'pair-1', leftText: 'Gracias', rightText: 'Thank you' },
          { id: 'pair-2', leftText: 'Por favor', rightText: 'Please' },
          { id: 'pair-3', leftText: 'Adiós', rightText: 'Goodbye' },
          { id: 'pair-4', leftText: 'Hola', rightText: 'Hello' },
        ],
      },
      {
        id: 'act-es-1-4',
        type: 'fill-in-blank',
        prompt: 'Complete the sentence with the correct word',
        sentenceTokens: ['Un', 'café,', '___', 'favor.'],
        blankIndex: 2,
        options: [
          { id: 'opt-4-1', text: 'por', isCorrect: true },
          { id: 'opt-4-2', text: 'hola', isCorrect: false },
          { id: 'opt-4-3', text: 'adiós', isCorrect: false },
        ],
        correctAnswer: 'por',
      },
    ],
  },
  {
    id: 'es-lesson-2',
    unitId: 'es-unit-1',
    languageId: 'es',
    order: 2,
    title: 'Introducing Yourself',
    description: 'Learn to state your name, ask others their name, and say where you are from.',
    type: 'standard',
    xpReward: 20,
    estimatedMinutes: 4,
    goals: [
      'Ask someone for their name',
      'State your own name and origin',
      'Understand simple responses in conversational Spanish',
    ],
    vocabulary: [
      {
        id: 'vocab-es-6',
        word: 'Nombre',
        translation: 'Name',
        phonetic: 'NOHM-bray',
        exampleSentence: '¿Cuál es tu nombre?',
      },
      {
        id: 'vocab-es-7',
        word: 'De dónde',
        translation: 'Where from',
        phonetic: 'day DOHN-day',
        exampleSentence: '¿De dónde eres?',
      },
      {
        id: 'vocab-es-8',
        word: 'Soy de',
        translation: 'I am from',
        phonetic: 'soy day',
        exampleSentence: 'Soy de España.',
      },
    ],
    phrases: [
      {
        id: 'phrase-es-4',
        phrase: '¿De dónde eres?',
        translation: 'Where are you from?',
        context: 'Asking about origin',
      },
      {
        id: 'phrase-es-5',
        phrase: 'Soy de los Estados Unidos',
        translation: 'I am from the United States',
        context: 'Stating nationality / country',
      },
    ],
    activities: [
      {
        id: 'act-es-2-1',
        type: 'multiple-choice',
        prompt: 'How do you say "My name is" in Spanish?',
        options: [
          { id: 'opt-21-1', text: 'Me llamo', isCorrect: true },
          { id: 'opt-21-2', text: 'Soy de', isCorrect: false },
          { id: 'opt-21-3', text: 'Mucho gusto', isCorrect: false },
        ],
        correctAnswer: 'Me llamo',
      },
      {
        id: 'act-es-2-2',
        type: 'translate',
        prompt: 'Translate into Spanish: "Nice to meet you"',
        options: [
          { id: 'opt-22-1', text: 'Mucho gusto', isCorrect: true },
          { id: 'opt-22-2', text: 'Buenos días', isCorrect: false },
          { id: 'opt-22-3', text: 'Por favor', isCorrect: false },
        ],
        correctAnswer: 'Mucho gusto',
      },
    ],
  },
  {
    id: 'es-lesson-3',
    unitId: 'es-unit-1',
    languageId: 'es',
    order: 3,
    title: 'AI Teacher: Practice Greetings',
    description: 'Have a real-time voice & video conversation with Sofia, your AI Spanish tutor!',
    type: 'ai-teacher',
    xpReward: 30,
    estimatedMinutes: 5,
    goals: [
      'Practice real spoken greetings with AI voice feedback',
      'Introduce yourself out loud in a low-pressure setting',
      'Improve Spanish conversational confidence',
    ],
    vocabulary: [],
    phrases: [],
    aiTeacherPrompt: {
      role: 'Spanish Language Teacher',
      persona: 'Sofia - a warm, encouraging, native Spanish speaker from Madrid',
      topic: 'Greetings and introductions',
      goal: 'Help the student practice saying hello, stating their name, asking how you are doing, and saying goodbye in natural Spanish.',
      systemPrompt:
        'You are Sofia, an AI Spanish teacher on Duolingo Clone. Speak mostly Spanish, but use simple English explanations if the user hesitates. Keep your sentences short, friendly, and conversational.',
      initialGreeting: '¡Hola! Soy Sofía, tu profesora de español. ¿Cómo te llamas?',
    },
    activities: [
      {
        id: 'act-es-3-1',
        type: 'ai-teacher',
        prompt: 'Connect with Sofia for a live AI conversational lesson',
        aiTeacherPrompt: {
          role: 'Spanish Language Teacher',
          persona: 'Sofia - a warm, encouraging native Spanish teacher',
          topic: 'Basic Introductions',
          goal: 'Practice introducing yourself and asking questions in Spanish',
          systemPrompt:
            'You are Sofia, a friendly AI teacher. Speak clearly in simple Spanish. Encourage the learner.',
          initialGreeting: '¡Hola! ¡Qué gusto conocerte! ¿Cómo estás hoy?',
        },
      },
    ],
  },

  // Spanish Unit 2 Lessons
  {
    id: 'es-lesson-4',
    unitId: 'es-unit-2',
    languageId: 'es',
    order: 1,
    title: 'Asking for Directions',
    description: 'Learn key phrases for asking where places are located.',
    type: 'standard',
    xpReward: 20,
    estimatedMinutes: 4,
    goals: ['Ask where a bathroom or hotel is', 'Understand left, right, and straight ahead'],
    vocabulary: [
      {
        id: 'vocab-es-9',
        word: 'Dónde está',
        translation: 'Where is',
        phonetic: 'DOHN-day es-TAH',
      },
      {
        id: 'vocab-es-10',
        word: 'El baño',
        translation: 'The bathroom',
        phonetic: 'el BAH-nyoh',
      },
      {
        id: 'vocab-es-11',
        word: 'A la derecha',
        translation: 'To the right',
        phonetic: 'ah lah day-RAY-chah',
      },
    ],
    phrases: [
      {
        id: 'phrase-es-6',
        phrase: '¿Dónde está el baño?',
        translation: 'Where is the bathroom?',
      },
    ],
    activities: [
      {
        id: 'act-es-4-1',
        type: 'multiple-choice',
        prompt: 'Select the translation for "Where is the bathroom?"',
        options: [
          { id: 'opt-41-1', text: '¿Dónde está el baño?', isCorrect: true },
          { id: 'opt-41-2', text: '¿De dónde eres?', isCorrect: false },
          { id: 'opt-41-3', text: '¿Cómo te llamas?', isCorrect: false },
        ],
        correctAnswer: '¿Dónde está el baño?',
      },
    ],
  },

  // French Unit 1 Lessons
  {
    id: 'fr-lesson-1',
    unitId: 'fr-unit-1',
    languageId: 'fr',
    order: 1,
    title: 'Bonjour & Basics',
    description: 'Master basic French greetings and courteous phrases.',
    type: 'standard',
    xpReward: 15,
    estimatedMinutes: 3,
    goals: ['Say hello and good evening in French', 'Express thanks with "Merci"'],
    vocabulary: [
      {
        id: 'vocab-fr-1',
        word: 'Bonjour',
        translation: 'Hello / Good day',
        phonetic: 'bohn-ZHOOR',
      },
      {
        id: 'vocab-fr-2',
        word: 'Merci',
        translation: 'Thank you',
        phonetic: 'mair-SEE',
      },
      {
        id: 'vocab-fr-3',
        word: 'S’il vous plaît',
        translation: 'Please',
        phonetic: 'seel voo PLAY',
      },
    ],
    phrases: [
      {
        id: 'phrase-fr-1',
        phrase: 'Comment allez-vous ?',
        translation: 'How are you?',
      },
    ],
    activities: [
      {
        id: 'act-fr-1-1',
        type: 'multiple-choice',
        prompt: 'Select the French word for "Hello"',
        options: [
          { id: 'opt-fr-1', text: 'Bonjour', isCorrect: true },
          { id: 'opt-fr-2', text: 'Merci', isCorrect: false },
          { id: 'opt-fr-3', text: 'Au revoir', isCorrect: false },
        ],
        correctAnswer: 'Bonjour',
      },
    ],
  },
  {
    id: 'fr-lesson-2',
    unitId: 'fr-unit-1',
    languageId: 'fr',
    order: 2,
    title: 'AI Tutor: French Greetings',
    description: 'Practice speaking basic French with your AI tutor Pierre!',
    type: 'ai-teacher',
    xpReward: 30,
    estimatedMinutes: 5,
    goals: ['Practice French pronunciation', 'Say hello and introduce yourself to Pierre'],
    vocabulary: [],
    phrases: [],
    aiTeacherPrompt: {
      role: 'French Language Teacher',
      persona: 'Pierre - a polite and supportive French tutor from Paris',
      topic: 'French Greetings and Café Talk',
      goal: 'Help the user feel confident saying Bonjour and ordering coffee in French',
      systemPrompt:
        'You are Pierre, an AI French tutor. Speak simple, warm French and provide helpful gentle corrections.',
      initialGreeting: 'Bonjour ! Je m’appelle Pierre. Comment vous appelez-vous ?',
    },
    activities: [
      {
        id: 'act-fr-2-1',
        type: 'ai-teacher',
        prompt: 'Start live conversation with Pierre',
        aiTeacherPrompt: {
          role: 'French Language Teacher',
          persona: 'Pierre - French AI Tutor',
          topic: 'Basic French Greetings',
          goal: 'Practice Bonjour, Merci, and simple introductions',
          systemPrompt: 'Speak encouraging French in simple sentences.',
          initialGreeting: 'Bonjour ! Comment ça va aujourd’hui ?',
        },
      },
    ],
  },

  // German Unit 1 Lessons
  {
    id: 'de-lesson-1',
    unitId: 'de-unit-1',
    languageId: 'de',
    order: 1,
    title: 'Hallo & German Basics',
    description: 'Learn basic German greetings and everyday expressions.',
    type: 'standard',
    xpReward: 15,
    estimatedMinutes: 3,
    goals: ['Say hello and goodbye in German', 'Learn "Danke" and "Bitte"'],
    vocabulary: [
      {
        id: 'vocab-de-1',
        word: 'Hallo',
        translation: 'Hello',
        phonetic: 'HAH-loh',
      },
      {
        id: 'vocab-de-2',
        word: 'Danke',
        translation: 'Thank you',
        phonetic: 'DAHN-kuh',
      },
      {
        id: 'vocab-de-3',
        word: 'Bitte',
        translation: 'Please / You’re welcome',
        phonetic: 'BIT-tuh',
      },
    ],
    phrases: [
      {
        id: 'phrase-de-1',
        phrase: 'Wie geht es dir?',
        translation: 'How are you?',
      },
    ],
    activities: [
      {
        id: 'act-de-1-1',
        type: 'multiple-choice',
        prompt: 'Select the German word for "Thank you"',
        options: [
          { id: 'opt-de-1', text: 'Danke', isCorrect: true },
          { id: 'opt-de-2', text: 'Hallo', isCorrect: false },
          { id: 'opt-de-3', text: 'Tschüss', isCorrect: false },
        ],
        correctAnswer: 'Danke',
      },
    ],
  },

  // Japanese Unit 1 Lessons
  {
    id: 'ja-lesson-1',
    unitId: 'ja-unit-1',
    languageId: 'ja',
    order: 1,
    title: 'Konnichiwa & Basics',
    description: 'Learn fundamental Japanese greetings and polite phrases.',
    type: 'standard',
    xpReward: 15,
    estimatedMinutes: 3,
    goals: ['Learn Konnichiwa and Arigatou', 'Understand basic Japanese etiquette'],
    vocabulary: [
      {
        id: 'vocab-ja-1',
        word: 'こんにちは (Konnichiwa)',
        translation: 'Hello / Good afternoon',
        phonetic: 'kohn-nee-chee-wah',
      },
      {
        id: 'vocab-ja-2',
        word: 'ありがとう (Arigatou)',
        translation: 'Thank you',
        phonetic: 'ah-ree-gah-too',
      },
    ],
    phrases: [
      {
        id: 'phrase-ja-1',
        phrase: 'はじめまして (Hajimemashite)',
        translation: 'Nice to meet you',
      },
    ],
    activities: [
      {
        id: 'act-ja-1-1',
        type: 'multiple-choice',
        prompt: 'Select the Japanese greeting for "Hello"',
        options: [
          { id: 'opt-ja-1', text: 'こんにちは (Konnichiwa)', isCorrect: true },
          { id: 'opt-ja-2', text: 'ありがとう (Arigatou)', isCorrect: false },
          { id: 'opt-ja-3', text: 'さようなら (Sayounara)', isCorrect: false },
        ],
        correctAnswer: 'こんにちは (Konnichiwa)',
      },
    ],
  },

  // Italian Unit 1 Lessons
  {
    id: 'it-lesson-1',
    unitId: 'it-unit-1',
    languageId: 'it',
    order: 1,
    title: 'Ciao & Italian Essentials',
    description: 'Master basic Italian greetings and pleasantries.',
    type: 'standard',
    xpReward: 15,
    estimatedMinutes: 3,
    goals: ['Say Ciao, Buongiorno, and Grazie'],
    vocabulary: [
      {
        id: 'vocab-it-1',
        word: 'Ciao',
        translation: 'Hello / Goodbye',
        phonetic: 'CHAH-oh',
      },
      {
        id: 'vocab-it-2',
        word: 'Grazie',
        translation: 'Thank you',
        phonetic: 'GRAHT-see-eh',
      },
    ],
    phrases: [
      {
        id: 'phrase-it-1',
        phrase: 'Come stai?',
        translation: 'How are you?',
      },
    ],
    activities: [
      {
        id: 'act-it-1-1',
        type: 'multiple-choice',
        prompt: 'Select the Italian word for "Thank you"',
        options: [
          { id: 'opt-it-1', text: 'Grazie', isCorrect: true },
          { id: 'opt-it-2', text: 'Ciao', isCorrect: false },
          { id: 'opt-it-3', text: 'Prego', isCorrect: false },
        ],
        correctAnswer: 'Grazie',
      },
    ],
  },
];

export function getLessons(): Lesson[] {
  return LESSONS;
}

export function getLessonsForUnit(unitId: string): Lesson[] {
  return LESSONS.filter((lesson) => lesson.unitId === unitId).sort((a, b) => a.order - b.order);
}

export function getLessonsForLanguage(languageId: string): Lesson[] {
  return LESSONS.filter((lesson) => lesson.languageId === languageId).sort(
    (a, b) => a.order - b.order
  );
}

export function getLessonById(id: string): Lesson | undefined {
  return LESSONS.find((lesson) => lesson.id === id);
}
