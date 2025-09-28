// src/features/mixer/constants/limitsConstants.ts
export const TRANSACTION_LIMITS = {
  MIN_AMOUNT: 0.1,
  MAX_AMOUNT: 10000,
  MAX_DAILY_TRANSACTIONS: 10
} as const;

export const TIME_LIMITS = {
  MIN_CONFIRMATION_TIME: 1, // в минутах
  MAX_CONFIRMATION_TIME: 60 // в минутах
} as const;