// src/features/mixer/services/mixerService.ts
export const mixerService = {
  mix: async (amount: number, poolId: string) => {
    // Логика микширования будет здесь
    return { success: true };
  },
  
  getStatus: async (transactionId: string) => {
    // Логика получения статуса будет здесь
    return { status: 'pending' };
  }
};