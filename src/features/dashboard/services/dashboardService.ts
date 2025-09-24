// src/features/dashboard/services/dashboardService.ts
export const dashboardService = {
  getStats: async () => {
    // Получение статистики из контракта
    return {
      totalDeposits: 0,
      totalWithdrawn: 0,
      activeUsers: 0,
    };
  },
};