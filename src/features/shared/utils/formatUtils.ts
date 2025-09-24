// src/utils/formatUtils.ts
// Форматирование адреса TON
export const formatAddress = (address: string | null, length: number = 6): string => {
  if (!address) return 'Not connected';
  
  if (address.length <= length * 2 + 3) {
    return address;
  }
  
  return `${address.slice(0, length)}...${address.slice(-length)}`;
};

// Форматирование баланса
export const formatBalance = (balance: string, decimals: number = 2): string => {
  const num = parseFloat(balance);
  if (isNaN(num)) return '0';
  
  return num.toFixed(decimals);
};

// Форматирование временной метки
export const formatTimestamp = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleString();
};

// Форматирование суммы с разделителями
export const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('en-US').format(amount);
};

// Импортируем необходимые типы из TON SDK
import { Address } from '@ton/core';

// Нормализация адреса в user-friendly формат
export const normalizeAddress = (address: string | null): string | null => {
  if (!address) return null;
  
  try {
    // Если адрес уже в user-friendly формате (без префикса), возвращаем как есть
    if (!address.startsWith('0:')) {
      return address;
    }
    
    // Если адрес в raw формате (с префиксом "0:"), конвертируем в user-friendly
    return Address.parse(address).toString();
  } catch (error) {
    console.error('Error normalizing address:', error);
    return address;
  }
};

// Конвертация адреса в raw формат
export const toRawAddress = (address: string | null): string | null => {
  if (!address) return null;
  
  try {
    // Если адрес в raw формате (с префиксом "0:"), возвращаем как есть
    if (address.startsWith('0:')) {
      return address;
    }
    
    // Если адрес в user-friendly формате, конвертируем в raw
    return Address.parse(address).toRawString();
  } catch (error) {
    console.error('Error converting to raw address:', error);
    return address;
  }
};

// Проверка валидности адреса TON
export const isValidTonAddress = (address: string): boolean => {
  try {
    Address.parse(address);
    return true;
  } catch (error) {
    return false;
  }
};

// Форматирование суммы TON с правильным количеством знаков после запятой
export const formatTonAmount = (amount: string | number, decimals: number = 9): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '0';
  
  // Конвертируем из nanoTON в TON
  const tonAmount = num / Math.pow(10, decimals);
  
  // Форматируем с учетом значимых цифр
  if (tonAmount < 0.01) {
    return tonAmount.toFixed(6);
  } else if (tonAmount < 1) {
    return tonAmount.toFixed(4);
  } else {
    return tonAmount.toFixed(2);
  }
};

// Форматирование времени в относительный формат (например, "2 часа назад")
export const formatRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const date = new Date(timestamp * 1000);
  const diffMs = now - date.getTime();
  
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMinutes < 1) {
    return 'just now';
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }
};

// Форматирование хеша транзакции
export const formatTxHash = (hash: string, length: number = 8): string => {
  if (!hash) return '';
  
  if (hash.length <= length * 2 + 3) {
    return hash;
  }
  
  return `${hash.slice(0, length)}...${hash.slice(-length)}`;
};

// Конвертация nanoTON в TON
export const nanoToTon = (nanoAmount: string | number): number => {
  const amount = typeof nanoAmount === 'string' ? parseFloat(nanoAmount) : nanoAmount;
  return amount / 1000000000; // 1 TON = 10^9 nanoTON
};

// Конвертация TON в nanoTON
export const tonToNano = (tonAmount: string | number): number => {
  const amount = typeof tonAmount === 'string' ? parseFloat(tonAmount) : tonAmount;
  return amount * 1000000000; // 1 TON = 10^9 nanoTON
};

// Форматирование задержки в человекочитаемом формате
export const formatDelay = (delaySeconds: number): string => {
  if (delaySeconds < 3600) {
    return `${delaySeconds} second${delaySeconds !== 1 ? 's' : ''}`;
  } else if (delaySeconds < 86400) {
    const hours = Math.floor(delaySeconds / 3600);
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  } else {
    const days = Math.floor(delaySeconds / 86400);
    return `${days} day${days !== 1 ? 's' : ''}`;
  }
};

// Форматирование комиссии в процентах
export const formatFee = (fee: number): string => {
  return `${(fee * 100).toFixed(2)}%`;
};

// Обрезание строки с добавлением многоточия
export const truncateString = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength - 3)}...`;
};

// Генерация случайного ID
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};