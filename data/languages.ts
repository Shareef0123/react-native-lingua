import { Language } from '../types/learning';

export const LANGUAGES: Language[] = [
  {
    id: 'es',
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: 'https://flagcdn.com/w320/es.png',
    description: 'Learn Spanish through interactive daily lessons and AI conversation practice.',
    totalUnits: 3,
    accentColor: '#58CC02',
    order: 1,
    learners: '28.4M learners',
  },
  {
    id: 'fr',
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: 'https://flagcdn.com/w320/fr.png',
    description: 'Master French vocabulary, essential phrases, and natural pronunciation.',
    totalUnits: 2,
    accentColor: '#1CB0F6',
    order: 2,
    learners: '19.4M learners',
  },
  {
    id: 'ja',
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: 'https://flagcdn.com/w320/jp.png',
    description: 'Explore Japanese Hiragana, Katakana, essential phrases, and real dialogue.',
    totalUnits: 2,
    accentColor: '#FF4B4B',
    order: 3,
    learners: '12.7M learners',
  },
  {
    id: 'kr',
    code: 'kr',
    name: 'Korean',
    nativeName: '한국어',
    flag: 'https://flagcdn.com/w320/kr.png',
    description: 'Learn Korean alphabet, grammar, and daily conversations.',
    totalUnits: 1,
    accentColor: '#FF4B4B',
    order: 4,
    learners: '9.3M learners',
  },
  {
    id: 'de',
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: 'https://flagcdn.com/w320/de.png',
    description: 'Build your German skills with practical conversations and grammar foundations.',
    totalUnits: 2,
    accentColor: '#FFC800',
    order: 5,
    learners: '8.1M learners',
  },
  {
    id: 'zh',
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    flag: 'https://flagcdn.com/w320/cn.png',
    description: 'Master Mandarin Chinese Pinyin, tones, and core vocabulary.',
    totalUnits: 1,
    accentColor: '#FF0000',
    order: 6,
    learners: '7.4M learners',
  },
  {
    id: 'it',
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    flag: 'https://flagcdn.com/w320/it.png',
    description: 'Discover Italian language, travel expressions, and conversational basics.',
    totalUnits: 1,
    accentColor: '#2B70C9',
    order: 7,
    learners: '5.2M learners',
  },
];

export function getLanguages(): Language[] {
  return LANGUAGES;
}

export function getLanguageById(id: string): Language | undefined {
  return LANGUAGES.find((lang) => lang.id === id);
}
