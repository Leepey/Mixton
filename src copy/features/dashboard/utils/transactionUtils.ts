// src/features/dashboard/utils/transactionUtils.ts
import type { MixTransaction, TransactionData } from '../types/dashboard.types';

/**
 * Преобразование MixTransaction в TransactionData
 */
export const transformMixTransactions = (transactions: MixTransaction[]): TransactionData[] => {
  return transactions.map(tx => ({
    id: tx.id,
    amount: tx.amount,
    status: tx.status,
    timestamp: tx.timestamp,
    // Добавляем дополнительные поля по умолчанию
    inputAddress: undefined,
    outputAddresses: [],
    fee: 0,
    note: undefined
  }));
};

/**
 * Обратное преобразование TransactionData в MixTransaction
 */
export const transformToMixTransactions = (transactions: TransactionData[]): MixTransaction[] => {
  return transactions.map(tx => ({
    id: tx.id,
    amount: tx.amount,
    status: tx.status,
    timestamp: tx.timestamp
  }));
};

/**
 * Форматирование статуса транзакции для отображения
 */
export const formatTransactionStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'pending': 'Pending',
    'completed': 'Completed',
    'failed': 'Failed',
    'processing': 'Processing',
    'cancelled': 'Cancelled'
  };
  
  return statusMap[status.toLowerCase()] || status;
};

/**
 * Получение цвета для статуса транзакции
 */
export const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    'pending': '#FF9800',      // Orange
    'completed': '#4CAF50',    // Green
    'failed': '#F44336',       // Red
    'processing': '#2196F3',    // Blue
    'cancelled': '#9E9E9E'      // Grey
  };
  
  return colorMap[status.toLowerCase()] || '#9E9E9E';
};

/**
 * Форматирование даты транзакции
 */
export const formatTransactionDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    return diffInMinutes === 0 ? 'Just now' : `${diffInMinutes}m ago`;
  }
  
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  
  if (diffInHours < 168) { // 7 days
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  }
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Форматирование полной даты с временем
 */
export const formatFullDateTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Форматирование суммы TON
 */
export const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6
  }).format(amount);
};

/**
 * Форматирование суммы с символом TON
 */
export const formatAmountWithCurrency = (amount: number): string => {
  return `${formatAmount(amount)} TON`;
};

/**
 * Фильтрация транзакций по статусу
 */
export const filterTransactionsByStatus = (
  transactions: TransactionData[], 
  status: string | string[]
): TransactionData[] => {
  const statuses = Array.isArray(status) ? status : [status];
  return transactions.filter(tx => statuses.includes(tx.status));
};

/**
 * Фильтрация транзакций по диапазону дат
 */
export const filterTransactionsByDateRange = (
  transactions: TransactionData[],
  startDate: Date,
  endDate: Date
): TransactionData[] => {
  return transactions.filter(tx => {
    const txDate = new Date(tx.timestamp);
    return txDate >= startDate && txDate <= endDate;
  });
};

/**
 * Фильтрация транзакций по минимальной сумме
 */
export const filterTransactionsByMinAmount = (
  transactions: TransactionData[],
  minAmount: number
): TransactionData[] => {
  return transactions.filter(tx => tx.amount >= minAmount);
};

/**
 * Сортировка транзакций по дате (новые сначала)
 */
export const sortTransactionsByDate = (transactions: TransactionData[]): TransactionData[] => {
  return [...transactions].sort((a, b) => b.timestamp - a.timestamp);
};

/**
 * Сортировка транзакций по сумме (по убыванию)
 */
export const sortTransactionsByAmount = (transactions: TransactionData[]): TransactionData[] => {
  return [...transactions].sort((a, b) => b.amount - a.amount);
};

/**
 * Расчет статистики по транзакциям
 */
export const calculateTransactionStats = (transactions: TransactionData[]) => {
  const totalTransactions = transactions.length;
  const completedTransactions = transactions.filter(tx => tx.status === 'completed').length;
  const pendingTransactions = transactions.filter(tx => tx.status === 'pending').length;
  const failedTransactions = transactions.filter(tx => tx.status === 'failed').length;
  const processingTransactions = transactions.filter(tx => tx.status === 'processing').length;
  
  const totalAmount = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const completedAmount = transactions
    .filter(tx => tx.status === 'completed')
    .reduce((sum, tx) => sum + tx.amount, 0);
  
  const averageAmount = totalTransactions > 0 ? totalAmount / totalTransactions : 0;
  
  // Последняя транзакция
  const latestTransaction = transactions.length > 0 
    ? transactions.reduce((latest, tx) => tx.timestamp > latest.timestamp ? tx : latest)
    : null;
  
  return {
    totalTransactions,
    completedTransactions,
    pendingTransactions,
    failedTransactions,
    processingTransactions,
    totalAmount,
    completedAmount,
    averageAmount,
    latestTransaction,
    completionRate: totalTransactions > 0 
      ? (completedTransactions / totalTransactions) * 100 
      : 0
  };
};

/**
 * Группировка транзакций по статусам
 */
export const groupTransactionsByStatus = (transactions: TransactionData[]) => {
  const grouped = transactions.reduce((acc, tx) => {
    if (!acc[tx.status]) {
      acc[tx.status] = [];
    }
    acc[tx.status].push(tx);
    return acc;
  }, {} as Record<string, TransactionData[]>);
  
  return grouped;
};

/**
 * Группировка транзакций по дням
 */
export const groupTransactionsByDay = (transactions: TransactionData[]) => {
  const grouped = transactions.reduce((acc, tx) => {
    const date = new Date(tx.timestamp).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(tx);
    return acc;
  }, {} as Record<string, TransactionData[]>);
  
  return grouped;
};

/**
 * Поиск транзакций по ID или сумме
 */
export const searchTransactions = (
  transactions: TransactionData[],
  query: string
): TransactionData[] => {
  const lowerQuery = query.toLowerCase();
  return transactions.filter(tx => 
    tx.id.toLowerCase().includes(lowerQuery) ||
    tx.amount.toString().includes(lowerQuery)
  );
};

/**
 * Валидация транзакционных данных
 */
export const validateTransactionData = (data: Partial<TransactionData>): string[] => {
  const errors: string[] = [];
  
  if (!data.id || data.id.trim() === '') {
    errors.push('Transaction ID is required');
  }
  
  if (typeof data.amount !== 'number' || data.amount <= 0) {
    errors.push('Amount must be a positive number');
  }
  
  if (!data.status || !['pending', 'completed', 'failed', 'processing'].includes(data.status)) {
    errors.push('Invalid transaction status');
  }
  
  if (!data.timestamp || typeof data.timestamp !== 'number') {
    errors.push('Invalid timestamp');
  }
  
  return errors;
};

/**
 * Генерация уникального ID для транзакции
 */
export const generateTransactionId = (): string => {
  return `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Экспорт данных в CSV формат
 */
export const exportTransactionsToCSV = (transactions: TransactionData[]): string => {
  const headers = ['ID', 'Amount', 'Status', 'Date'];
  const rows = transactions.map(tx => [
    tx.id,
    tx.amount.toString(),
    tx.status,
    formatFullDateTime(tx.timestamp)
  ]);
  
  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
  
  return csvContent;
};

/**
 * Расчет времени до следующего обновления
 */
export const getTimeUntilNextUpdate = (lastUpdate: number, intervalMinutes: number = 5): string => {
  const nextUpdate = lastUpdate + (intervalMinutes * 60 * 1000);
  const now = Date.now();
  const timeUntil = nextUpdate - now;
  
  if (timeUntil <= 0) {
    return 'Updating...';
  }
  
  const minutes = Math.floor(timeUntil / (1000 * 60));
  const seconds = Math.floor((timeUntil % (1000 * 60)) / 1000);
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Определение, является ли транзакция недавней (менее 24 часов)
 */
export const isRecentTransaction = (timestamp: number): boolean => {
  const twentyFourHours = 24 * 60 * 60 * 1000;
  return (Date.now() - timestamp) < twentyFourHours;
};

/**
 * Получение иконки для статуса транзакции
 */
export const getStatusIcon = (status: string): string => {
  const iconMap: Record<string, string> = {
    'pending': '⏳',
    'completed': '✅',
    'failed': '❌',
    'processing': '🔄',
    'cancelled': '⛔'
  };
  
  return iconMap[status.toLowerCase()] || '❓';
};

/**
 * Форматирование большого числа с разделителями
 */
export const formatLargeNumber = (num: number): string => {
  if (num >= 1e9) {
    return `${(num / 1e9).toFixed(1)}B`;
  }
  if (num >= 1e6) {
    return `${(num / 1e6).toFixed(1)}M`;
  }
  if (num >= 1e3) {
    return `${(num / 1e3).toFixed(1)}K`;
  }
  return num.toString();
};