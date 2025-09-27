// src/features/admin/utils/adminUtils.ts
import type { AdminTab } from '../types/admin.types';
import { 
  AccountBalance as AccountBalanceIcon, 
  Settings as SettingsIcon, 
  Shuffle as ShuffleIcon, 
  Visibility as VisibilityIcon 
} from '@mui/icons-material';

// Удалена дублирующаяся функция getAdminTabs, так как она теперь в adminTabsUtils.ts
export const formatAdminAddress = (address: string): string => {
  if (!address || address.length < 10) return address;
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

export const getTransactionStatusColor = (status: string): string => {
  switch (status) {
    case 'completed': return 'success';
    case 'pending': return 'warning';
    case 'failed': return 'error';
    case 'processing': return 'info';
    case 'cancelled': return 'secondary';
    default: return 'default';
  }
};

/**
 * Форматирует сумму TON для отображения
 * @param amount - Сумма в TON
 * @returns Отформатированная строка
 */
export const formatTonAmount = (amount: number | string): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '0 TON';
  return `${num.toFixed(6)} TON`;
};

/**
 * Проверяет, является ли адрес TON валидным
 * @param address - Адрес для проверки
 * @returns true если адрес валидный
 */
export const isValidTonAddress = (address: string): boolean => {
  if (!address || address.length !== 48) return false;
  return /^[0-9a-zA-Z_-]+$/.test(address);
};

/**
 * Генерирует случайный ID для административных записей
 * @returns Случайный ID в виде строки
 */
export const generateAdminId = (): string => {
  return `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Форматирует дату для административной панели
 * @param date - Дата или строка даты
 * @returns Отформатированная строка даты
 */
export const formatAdminDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};