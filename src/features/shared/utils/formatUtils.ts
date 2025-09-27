// features/shared/utils/formatUtils.ts

/**
 * Форматирует сумму TON с правильным количеством знаков после запятой
 * @param amount - Сумма для форматирования
 * @param decimals - Количество знаков после запятой (по умолчанию 2)
 * @returns Отформатированная строка
 */
export const formatAmount = (amount: number, decimals: number = 2): string => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '0.00';
  }
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
};

/**
 * Форматирует время в формате "X time ago"
 * @param timestamp - Временная метка в миллисекундах
 * @returns Отформатированная строка
 */
export const formatTimeAgo = (timestamp: number): string => {
  if (!timestamp || typeof timestamp !== 'number') {
    return 'Never';
  }

  const now = Date.now();
  const diff = now - timestamp;
  
  // Если timestamp в будущем
  if (diff < 0) {
    return 'Just now';
  }

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  const weeks = Math.floor(diff / 604800000);
  const months = Math.floor(diff / 2592000000);
  const years = Math.floor(diff / 31536000000);

  if (years > 0) {
    return `${years} year${years > 1 ? 's' : ''} ago`;
  }
  
  if (months > 0) {
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }
  
  if (weeks > 0) {
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  }
  
  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
  
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  
  if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }
  
  if (seconds > 0) {
    return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
  }
  
  return 'Just now';
};

/**
 * Форматирует адрес (обрезает и добавляет ...)
 * @param address - Адрес для форматирования
 * @param startLength - Количество символов в начале (по умолчанию 6)
 * @param endLength - Количество символов в конце (по умолчанию 4)
 * @returns Отформатированный адрес
 */
export const formatAddress = (
  address: string, 
  startLength: number = 6, 
  endLength: number = 4
): string => {
  if (!address) {
    return '';
  }
  
  if (address.length <= startLength + endLength) {
    return address;
  }
  
  return `${address.substring(0, startLength)}...${address.substring(address.length - endLength)}`;
};

/**
 * Форматирует дату в локальном формате
 * @param timestamp - Временная метка в миллисекундах
 * @param options - Опции форматирования
 * @returns Отформатированная дата
 */
export const formatDate = (
  timestamp: number, 
  options: Intl.DateTimeFormatOptions = {}
): string => {
  if (!timestamp || typeof timestamp !== 'number') {
    return '';
  }

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  };

  return new Date(timestamp).toLocaleDateString(undefined, defaultOptions);
};

/**
 * Форматирует время в локальном формате
 * @param timestamp - Временная метка в миллисекундах
 * @param options - Опции форматирования
 * @returns Отформатированное время
 */
export const formatTime = (
  timestamp: number, 
  options: Intl.DateTimeFormatOptions = {}
): string => {
  if (!timestamp || typeof timestamp !== 'number') {
    return '';
  }

  const defaultOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    ...options
  };

  return new Date(timestamp).toLocaleTimeString(undefined, defaultOptions);
};

/**
 * Форматирует дату и время в локальном формате
 * @param timestamp - Временная метка в миллисекундах
 * @param options - Опции форматирования
 * @returns Отформатированная дата и время
 */
export const formatDateTime = (
  timestamp: number, 
  options: Intl.DateTimeFormatOptions = {}
): string => {
  if (!timestamp || typeof timestamp !== 'number') {
    return '';
  }

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options
  };

  return new Date(timestamp).toLocaleString(undefined, defaultOptions);
};

/**
 * Форматирует число с разделителями тысяч
 * @param num - Число для форматирования
 * @returns Отформатированная строка
 */
export const formatNumber = (num: number): string => {
  if (typeof num !== 'number' || isNaN(num)) {
    return '0';
  }

  return new Intl.NumberFormat('en-US').format(num);
};

/**
 * Форматирует процент
 * @param value - Значение от 0 до 1
 * @param decimals - Количество знаков после запятой (по умолчанию 2)
 * @returns Отформатированная строка с %
 */
export const formatPercent = (value: number, decimals: number = 2): string => {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0%';
  }

  return `${(value * 100).toFixed(decimals)}%`;
};

/**
 * Форматирует размер файла
 * @param bytes - Размер в байтах
 * @returns Отформатированная строка
 */
export const formatFileSize = (bytes: number): string => {
  if (typeof bytes !== 'number' || isNaN(bytes) || bytes < 0) {
    return '0 Bytes';
  }

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Bytes';
  
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, i);
  
  return `${size.toFixed(i > 1 ? 2 : 0)} ${sizes[i]}`;
};

/**
 * Форматирует длительность в человекочитаемом формате
 * @param milliseconds - Длительность в миллисекундах
 * @returns Отформатированная строка
 */
export const formatDuration = (milliseconds: number): string => {
  if (typeof milliseconds !== 'number' || isNaN(milliseconds) || milliseconds < 0) {
    return '0s';
  }

  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  }
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  
  return `${seconds}s`;
};

/**
 * Форматирует хеш (обрезает и добавляет ...)
 * @param hash - Хеш для форматирования
 * @param length - Количество символов в начале и конце (по умолчанию 6)
 * @returns Отформатированный хеш
 */
export const formatHash = (hash: string, length: number = 6): string => {
  if (!hash) {
    return '';
  }
  
  if (hash.length <= length * 2) {
    return hash;
  }
  
  return `${hash.substring(0, length)}...${hash.substring(hash.length - length)}`;
};

/**
 * Форматирует номер блока
 * @param blockNumber - Номер блока
 * @returns Отформатированная строка
 */
export const formatBlockNumber = (blockNumber: number | string): string => {
  const num = typeof blockNumber === 'string' ? parseInt(blockNumber, 10) : blockNumber;
  
  if (isNaN(num)) {
    return '#0';
  }
  
  return `#${formatNumber(num)}`;
};

/**
 * Форматирует статус транзакции
 * @param status - Статус транзакции
 * @returns Отформатированная строка
 */
export const formatTransactionStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'completed': 'Completed',
    'pending': 'Pending',
    'failed': 'Failed',
    'processing': 'Processing',
    'cancelled': 'Cancelled'
  };
  
  return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1);
};

/**
 * Форматирует имя пула
 * @param poolId - ID пула
 * @returns Отформатированное имя пула
 */
export const formatPoolName = (poolId: string): string => {
  const poolMap: Record<string, string> = {
    'basic': 'Basic Pool',
    'standard': 'Standard Pool',
    'premium': 'Premium Pool'
  };
  
  return poolMap[poolId] || poolId.charAt(0).toUpperCase() + poolId.slice(1);
};

/**
 * Форматирует комиссию
 * @param fee - Комиссия в виде числа (0.03 = 3%)
 * @returns Отформатированная строка
 */
export const formatFee = (fee: number): string => {
  if (typeof fee !== 'number' || isNaN(fee)) {
    return '0%';
  }
  
  return `${(fee * 100).toFixed(2)}%`;
};

/**
 * Форматирует баланс с сокращением больших чисел
 * @param balance - Баланс
 * @returns Отформатированная строка
 */
export const formatBalance = (balance: number): string => {
  if (typeof balance !== 'number' || isNaN(balance)) {
    return '0 TON';
  }

  if (balance >= 1000000) {
    return `${(balance / 1000000).toFixed(2)}M TON`;
  }
  
  if (balance >= 1000) {
    return `${(balance / 1000).toFixed(2)}K TON`;
  }
  
  return `${formatAmount(balance)} TON`;
};

/**
 * Форматирует время задержки
 * @param delay - Задержка в секундах
 * @returns Отформатированная строка
 */
export const formatDelay = (delay: number): string => {
  if (typeof delay !== 'number' || isNaN(delay) || delay < 0) {
    return '0s';
  }

  const hours = Math.floor(delay / 3600);
  const minutes = Math.floor((delay % 3600) / 60);
  const seconds = delay % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  
  return `${seconds}s`;
};