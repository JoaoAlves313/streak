export enum CategoryType {
  DEVELOPMENT = 'Desenvolvimento',
  NUTRITION = 'Alimentação',
  PHYSICAL = 'Físico'
}

export interface StreakData {
  id: string;
  type: CategoryType;
  currentStreak: number;
  bestStreak: number;
  lastCompletedDate: string | null; // Format: YYYY-MM-DD
  history: string[]; // List of YYYY-MM-DD completed dates
}

export interface QuoteResponse {
  message: string;
  author?: string;
}

export const STORAGE_KEY = 'tristreak_data_v1';