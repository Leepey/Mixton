import { User, LoginCredentials } from '../types/auth.types';
import { generateUserId, saveAuthToStorage, clearAuthStorage } from '../utils/authUtils';

export const authService = {
  // Вход пользователя
  login: async (credentials: LoginCredentials): Promise<User> => {
    // В реальном приложении здесь будет проверка подписи и вызов API
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!credentials.address) {
          reject(new Error('Address is required'));
          return;
        }

        // Имитация создания пользователя
        const user: User = {
          id: generateUserId(credentials.address),
          address: credentials.address,
          balance: Math.random() * 1000, // Случайный баланс для демонстрации
          connected: true,
          role: 'user', // В реальном приложении роль будет определяться на основе адреса
          joinDate: Date.now(),
          lastActive: Date.now(),
        };

        // Сохраняем в localStorage
        saveAuthToStorage(user);
        resolve(user);
      }, 1000);
    });
  },

  // Выход пользователя
  logout: async (): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        clearAuthStorage();
        resolve();
      }, 300);
    });
  },

  // Обновление баланса пользователя
  updateBalance: async (address: string, balance: number): Promise<User | null> => {
    // В реальном приложении здесь будет вызов API
    return new Promise((resolve) => {
      setTimeout(() => {
        const stored = localStorage.getItem('ton_mixer_auth');
        if (!stored) {
          resolve(null);
          return;
        }

        const data = JSON.parse(stored);
        const updatedUser = {
          ...data.user,
          balance,
          lastActive: Date.now(),
        };

        saveAuthToStorage(updatedUser);
        resolve(updatedUser);
      }, 500);
    });
  },

  // Проверка аутентификации
  checkAuth: async (): Promise<User | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stored = localStorage.getItem('ton_mixer_auth');
        if (!stored) {
          resolve(null);
          return;
        }

        try {
          const data = JSON.parse(stored);
          // Проверяем, не истек ли срок хранения
          if (Date.now() - data.timestamp > 24 * 60 * 60 * 1000) {
            clearAuthStorage();
            resolve(null);
            return;
          }
          resolve(data.user);
        } catch (error) {
          console.error('Failed to parse auth data:', error);
          clearAuthStorage();
          resolve(null);
        }
      }, 100);
    });
  },

  // Обновление последней активности
  updateLastActive: async (address: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stored = localStorage.getItem('ton_mixer_auth');
        if (!stored) {
          resolve();
          return;
        }

        try {
          const data = JSON.parse(stored);
          const updatedUser = {
            ...data.user,
            lastActive: Date.now(),
          };

          saveAuthToStorage(updatedUser);
          resolve();
        } catch (error) {
          console.error('Failed to update last active:', error);
          resolve();
        }
      }, 300);
    });
  },
};