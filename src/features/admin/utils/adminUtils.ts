import type { AdminUser, ContractSettings, SecuritySettings } from '../types/admin.types';

export const validateAdminAddress = (address: string): boolean => {
  // Валидация адреса администратора
  return /^EQ[A-Za-z0-9_-]{46}$/.test(address);
};

export const formatAddress = (address: string, length = 6): string => {
  if (!address) return '';
  return `${address.slice(0, length)}...${address.slice(-length)}`;
};

export const calculatePoolUtilization = (
  current: number,
  max: number
): number => {
  return Math.round((current / max) * 100);
};

export const validateContractSettings = (settings: ContractSettings): string[] => {
  const errors: string[] = [];
  
  if (settings.feeRates.basic < 0 || settings.feeRates.basic > 10) {
    errors.push('Basic fee rate must be between 0% and 10%');
  }
  
  if (settings.limits.minDeposit >= settings.limits.maxDeposit) {
    errors.push('Min deposit must be less than max deposit');
  }
  
  if (settings.delays.minDelay >= settings.delays.maxDelay) {
    errors.push('Min delay must be less than max delay');
  }
  
  return errors;
};

export const generateUserReport = (users: AdminUser[]): string => {
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const totalVolume = users.reduce((sum, user) => sum + user.totalVolume, 0);
  
  return `
Admin User Report
================
Total Users: ${totalUsers}
Active Users: ${activeUsers}
Total Volume: ${totalVolume.toFixed(2)} TON
  `.trim();
};