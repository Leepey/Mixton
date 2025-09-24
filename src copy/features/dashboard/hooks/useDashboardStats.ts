// src/features/dashboard/hooks/useDashboardStats.ts
import { useAuth } from '../../../context/AuthContext';
import { useMixerContext } from '../../../context/MixerContext';
import type { DashboardStats } from '../types/dashboard.types';

export const useDashboardStats = (): DashboardStats => {
  const { user } = useAuth();
  const { mixHistory } = useMixerContext();

  // Преобразование баланса из строки в число, с защитой от null/undefined
  const walletBalance = user?.balance 
    ? (typeof user.balance === 'string' ? parseFloat(user.balance) : user.balance)
    : 0;

  // Определение статуса последней транзакции
  const lastMixStatus = mixHistory.length > 0 
    ? mixHistory[mixHistory.length - 1].status 
    : 'none';

  // Форматирование времени последней транзакции
  const lastMixTime = mixHistory.length > 0 
    ? formatTransactionDate(mixHistory[mixHistory.length - 1].timestamp)
    : null;

  return {
    walletBalance,
    totalTransactions: mixHistory.length,
    lastMixStatus: lastMixStatus as 'completed' | 'pending' | 'none',
    lastMixTime,
  };
};

// Вспомогательная функция для форматирования даты
const formatTransactionDate = (timestamp: number): string => {
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