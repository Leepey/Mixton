// src/features/mixer/utils/amountUtils.ts
export const amountUtils = {
  formatAmount: (amount: number): string => {
    return amount.toFixed(2);
  },
  
  validateAmount: (amount: number, min: number, max: number): boolean => {
    return amount >= min && amount <= max;
  },
  
  calculateFee: (amount: number, feePercent: number): number => {
    return amount * (feePercent / 100);
  }
};