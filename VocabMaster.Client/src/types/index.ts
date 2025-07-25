/**
 * User information
 */
export interface User {
  id: number;
  name: string;
  role: string;
  learnedWordsCount?: number;
}

/**
 * Pronunciation information
 */
export interface Pronunciation {
  text: string;
  audio: string;
}

/**
 * Definition information
 */
export interface Definition {
  text: string;
  example: string;
  synonyms: string[];
  antonyms: string[];
}

/**
 * Meaning information
 */
export interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
}

/**
 * Vocabulary information
 */
export interface Vocabulary {
  id: number;
  word: string;
  phonetic: string;
  pronunciations: Pronunciation[];
  meanings: Meaning[];
  isLearned: boolean;
}

/**
 * Learned word information
 */
export interface LearnedWord {
  id: number;
  word: string;
  learnedDate?: string;
}

/**
 * Login request information
 */
export interface LoginRequest {
  name: string;
  password: string;
}

/**
 * Register request information
 */
export interface RegisterRequest {
  name: string;
  password: string;
  confirmPassword: string;
}

/**
 * Toast notification information
 */
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
  isExiting?: boolean;
} 