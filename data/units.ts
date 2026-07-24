import { Unit } from '../types/learning';

export const UNITS: Unit[] = [
  // Spanish Units
  {
    id: 'es-unit-1',
    languageId: 'es',
    order: 1,
    title: 'Greetings & Essentials',
    description: 'Master basic greetings, introduce yourself, and order coffee.',
    color: '#58CC02',
    icon: 'hand-wave',
    totalLessons: 3,
  },
  {
    id: 'es-unit-2',
    languageId: 'es',
    order: 2,
    title: 'Travel & Directions',
    description: 'Navigate city streets, ask for directions, and check into hotels.',
    color: '#1CB0F6',
    icon: 'compass',
    totalLessons: 2,
  },
  {
    id: 'es-unit-3',
    languageId: 'es',
    order: 3,
    title: 'Food & Dining',
    description: 'Order food at restaurants, talk about ingredients and preferences.',
    color: '#FF9600',
    icon: 'restaurant',
    totalLessons: 2,
  },

  // French Units
  {
    id: 'fr-unit-1',
    languageId: 'fr',
    order: 1,
    title: 'Foundations & Greetings',
    description: 'Learn essential French greetings and polite expressions.',
    color: '#1CB0F6',
    icon: 'hand-wave',
    totalLessons: 2,
  },
  {
    id: 'fr-unit-2',
    languageId: 'fr',
    order: 2,
    title: 'Café Culture',
    description: 'Order food, coffee, and converse politely at French cafés.',
    color: '#CE82FF',
    icon: 'cafe',
    totalLessons: 2,
  },

  // German Units
  {
    id: 'de-unit-1',
    languageId: 'de',
    order: 1,
    title: 'Basics & Introductions',
    description: 'Say hello, introduce yourself, and ask simple everyday questions.',
    color: '#FFC800',
    icon: 'hand-wave',
    totalLessons: 2,
  },
  {
    id: 'de-unit-2',
    languageId: 'de',
    order: 2,
    title: 'Daily Life',
    description: 'Talk about your routine, hobbies, and simple daily activities.',
    color: '#58CC02',
    icon: 'sun',
    totalLessons: 1,
  },

  // Japanese Units
  {
    id: 'ja-unit-1',
    languageId: 'ja',
    order: 1,
    title: 'Greetings & Expressions',
    description: 'Say hello, express gratitude, and learn basic Japanese greetings.',
    color: '#FF4B4B',
    icon: 'sparkles',
    totalLessons: 2,
  },
  {
    id: 'ja-unit-2',
    languageId: 'ja',
    order: 2,
    title: 'Essential Phrases',
    description: 'Learn polite responses, travel phrases, and daily vocabulary.',
    color: '#1CB0F6',
    icon: 'chat-bubble',
    totalLessons: 1,
  },

  // Italian Units
  {
    id: 'it-unit-1',
    languageId: 'it',
    order: 1,
    title: 'First Conversations',
    description: 'Learn Italian greetings and key phrases for daily life.',
    color: '#2B70C9',
    icon: 'hand-wave',
    totalLessons: 2,
  },
];

export function getUnits(): Unit[] {
  return UNITS;
}

export function getUnitsForLanguage(languageId: string): Unit[] {
  return UNITS.filter((unit) => unit.languageId === languageId).sort((a, b) => a.order - b.order);
}

export function getUnitById(id: string): Unit | undefined {
  return UNITS.find((unit) => unit.id === id);
}
