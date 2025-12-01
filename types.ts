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

export interface Wallet {
  coins: number;
  lastCoinDate: string | null; // Track if coin was earned today
  freezeExpiresAt: string | null; // ISO Date string
}

export interface GlobalStats {
  masterStreak: number; // Streak where ALL habits were completed
  lastPerfectDate: string | null; // Date when master streak was last incremented
}

export interface QuoteResponse {
  message: string;
  author?: string;
}

export const STORAGE_KEY = 'tristreak_data_v1';
export const WALLET_KEY = 'tristreak_wallet_v1';
export const GLOBAL_KEY = 'tristreak_global_v1';