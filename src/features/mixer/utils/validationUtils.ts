// src/features/mixer/utils/validationUtils.ts
export const validateMixAmount = (amount: number, poolType: string): boolean => {
  const pools = {
    basic: { min: 0.5, max: 100 },
    standard: { min: 100, max: 1000 },
    premium: { min: 1000, max: 10000 },
  };
  
  const pool = pools[poolType as keyof typeof pools];
  return amount >= pool.min && amount <= pool.max;
};