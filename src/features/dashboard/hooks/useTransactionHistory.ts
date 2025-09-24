// src/features/dashboard/hooks/useTransactionsHistory.ts
import { useState, useCallback } from 'react';
import type { TransactionData } from '../types/dashboard.types';
import { transformMixTransactions } from '../utils/transactionUtils';
import { loadMixHistory } from '../../shared/services/storageService';

// Изменим тип входного параметра на MixTransaction[]
export const useTransactionsHistory = (initialHistory: any[]) => {
  // Преобразуем входные данные в наш тип TransactionData
  const [transactions, setTransactions] = useState<TransactionData[]>(
    transformMixTransactions(initialHistory)
  );
  
  const refreshHistory = useCallback(() => {
    try {
      const savedHistory = loadMixHistory();
      // Преобразуем загруженные данные в наш тип
      setTransactions(transformMixTransactions(savedHistory));
    } catch (error) {
      console.error('Failed to refresh history:', error);
    }
  }, []);

  const clearHistory = useCallback(() => {
    setTransactions([]);
    try {
      localStorage.removeItem('ton_mixer_history');
    } catch (error) {
      console.error('Failed to clear mix history from localStorage:', error);
    }
  }, []);

  return {
    transactions,
    refreshHistory,
    clearHistory,
  };
};