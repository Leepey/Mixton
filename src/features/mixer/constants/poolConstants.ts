// src/features/mixer/constants/poolConstants.ts
export const POOL_TYPES = {
  STANDARD: 'standard',
  HIGH_PRIVACY: 'high_privacy',
  INSTANT: 'instant'
} as const;

export const DEFAULT_POOL_SETTINGS = {
  MIN_AMOUNT: 0.1,
  MAX_AMOUNT: 1000,
  STANDARD_FEE: 0.5
} as const;