import { User, WalletConnection } from '../types/auth.types';

export const validateTonAddress = (address: string): boolean => {
  // Валидация TON адреса
  return /^EQ[A-Za-z0-9_-]{46}$/.test(address);
};

export const formatTonAddress = (address: string, length = 6): string => {
  if (!address) return '';
  return `${address.slice(0, length)}...${address.slice(-length)}`;
};

export const generateUserId = (address: string): string => {
  // Генерация ID пользователя на основе адреса
  return `user_${address.slice(2, 10)}`;
};

export const createUserFromWallet = (wallet: WalletConnection): User => {
  return {
    id: generateUserId(wallet.address),
    address: wallet.address,
    balance: 0,
    connected: true,
    role: 'user',
    joinDate: Date.now(),
    lastActive: Date.now(),
  };
};

export const saveAuthToStorage = (user: User): void => {
  try {
    localStorage.setItem('ton_mixer_auth', JSON.stringify({
      user,
      timestamp: Date.now(),
    }));
  } catch (error) {
    console.error('Failed to save auth to storage:', error);
  }
};

export const loadAuthFromStorage = (): { user: User | null; timestamp: number } | null => {
  try {
    const stored = localStorage.getItem('ton_mixer_auth');
    if (!stored) return null;
    
    const data = JSON.parse(stored);
    // Проверяем, не истек ли срок хранения (24 часа)
    if (Date.now() - data.timestamp > 24 * 60 * 60 * 1000) {
      localStorage.removeItem('ton_mixer_auth');
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to load auth from storage:', error);
    return null;
  }
};

export const clearAuthStorage = (): void => {
  try {
    localStorage.removeItem('ton_mixer_auth');
  } catch (error) {
    console.error('Failed to clear auth storage:', error);
  }
};

export const checkUserRole = (user: User | null, requiredRole: User['role']): boolean => {
  if (!user) return false;
  return user.role === requiredRole;
};

export const isAdmin = (user: User | null): boolean => {
  return checkUserRole(user, 'admin');
};

export const isModerator = (user: User | null): boolean => {
  return checkUserRole(user, 'moderator') || isAdmin(user);
};