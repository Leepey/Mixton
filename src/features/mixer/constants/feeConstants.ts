// src/features/mixer/constants/feeConstants.ts
export const FEE_TYPES = {
  FIXED: 'fixed',
  PERCENTAGE: 'percentage'
} as const;

export const FEE_LIMITS = {
  MIN_FEE: 0.001,
  MAX_FEE: 5
} as const;