// src/features/mixer/services/poolService.ts
export const poolService = {
  getPools: async () => {
    return [
      { id: 'basic', name: 'Basic', minAmount: 0.5, maxAmount: 100, fee: 0.5 },
      { id: 'standard', name: 'Standard', minAmount: 100, maxAmount: 1000, fee: 0.3 },
      { id: 'premium', name: 'Premium', minAmount: 1000, maxAmount: 10000, fee: 0.1 },
    ];
  },
};