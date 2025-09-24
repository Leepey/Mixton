import type { AdminUser, ContractSettings, AnalyticsData } from '../types/admin.types';

// Имитация API вызовов
export const adminService = {
  // Управление пользователями
  getUsers: async (): Promise<AdminUser[]> => {
    // В реальном приложении здесь будет API вызов
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: '1',
            address: 'EQD1234567890abcdef1234567890abcdef12345678',
            role: 'user' as const,
            status: 'active' as const,
            joinDate: Date.now() - 30 * 24 * 60 * 60 * 1000,
            totalTransactions: 15,
            totalVolume: 450.75,
          },
          {
            id: '2',
            address: 'EQDabcdef1234567890abcdef1234567890abcdef12',
            role: 'admin' as const,
            status: 'active' as const,
            joinDate: Date.now() - 90 * 24 * 60 * 60 * 1000,
            totalTransactions: 42,
            totalVolume: 1280.50,
          },
        ]);
      }, 500);
    });
  },

  updateUserStatus: async (userId: string, status: AdminUser['status']): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 300);
    });
  },

  // Управление настройками контракта
  getContractSettings: async (): Promise<ContractSettings> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          feeRates: {
            basic: 0.01,
            standard: 0.025,
            premium: 0.005,
          },
          limits: {
            minDeposit: 0.5,
            maxDeposit: 10000,
            minWithdraw: 0.1,
            maxWithdraw: 5000,
          },
          delays: {
            minDelay: 1,
            maxDelay: 24,
          },
          pools: {
            basic: { min: 0.5, max: 100, participants: 1250 },
            standard: { min: 100, max: 1000, participants: 320 },
            premium: { min: 1000, max: 10000, participants: 45 },
          },
        });
      }, 500);
    });
  },

  updateContractSettings: async (settings: ContractSettings): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 300);
    });
  },

  // Аналитика
  getAnalytics: async (): Promise<AnalyticsData> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          totalDeposits: 2847,
          totalWithdrawn: 2653,
          activeUsers: 1847,
          totalVolume: 1256780.45,
          feesCollected: 31419.51,
          poolUtilization: {
            basic: 78,
            standard: 65,
            premium: 42,
          },
          transactionHistory: Array.from({ length: 30 }, (_, i) => ({
            date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            deposits: Math.floor(Math.random() * 100) + 50,
            withdrawals: Math.floor(Math.random() * 90) + 40,
            volume: Math.floor(Math.random() * 50000) + 20000,
          })),
        });
      }, 800);
    });
  },
};