// features/home/hooks/useHomeForm.ts
import { useState, useCallback, useEffect } from 'react';
import type { HomeFormData, HomeUIState } from '../types/home.types';

export const useHomeForm = (availablePools: any[]) => {
  const [formData, setFormData] = useState<HomeFormData>({
    amount: '',
    note: '',
    selectedPool: '',
    amountError: ''
  });

  const [uiState, setUIState] = useState<HomeUIState>({
    showForm: false,
    transactionPending: false,
    showInfo: false
  });

  // Обновляем состояние при изменении доступных пулов
  useEffect(() => {
    if (availablePools.length > 0 && !formData.selectedPool) {
      setFormData(prev => ({
        ...prev,
        selectedPool: availablePools[0].id
      }));
    }
  }, [availablePools, formData.selectedPool]);

  const validateAmount = useCallback((value: string, poolId?: string) => {
    if (!value) {
      setFormData(prev => ({ ...prev, amountError: 'Amount is required' }));
      return false;
    }
    
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) {
      setFormData(prev => ({ ...prev, amountError: 'Please enter a valid amount' }));
      return false;
    }
    
    // Проверка на соответствие лимитам пула
    if (poolId) {
      const pool = availablePools.find(p => p.id === poolId);
      if (pool) {
        if (num < pool.minAmount) {
          setFormData(prev => ({ 
            ...prev, 
            amountError: `Minimum amount for ${pool.name} is ${pool.minAmount} TON` 
          }));
          return false;
        }
        if (num > pool.maxAmount) {
          setFormData(prev => ({ 
            ...prev, 
            amountError: `Maximum amount for ${pool.name} is ${pool.maxAmount} TON` 
          }));
          return false;
        }
      }
    }
    
    setFormData(prev => ({ ...prev, amountError: '' }));
    return true;
  }, [availablePools]);

  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, amount: value }));
    
    if (!value) {
      setFormData(prev => ({ ...prev, amountError: 'Amount is required' }));
    } else {
      // Валидируем с учетом выбранного пула
      validateAmount(value, formData.selectedPool);
    }
  }, [formData.selectedPool, validateAmount]);

  const handlePoolChange = useCallback((poolId: string) => {
    setFormData(prev => ({ ...prev, selectedPool: poolId }));
    
    const pool = availablePools.find(p => p.id === poolId);
    if (pool) {
      setFormData(prev => ({ 
        ...prev, 
        amount: pool.minAmount.toString() 
      }));
      // Автоматически валидируем при выборе пула
      validateAmount(pool.minAmount.toString(), poolId);
    }
  }, [availablePools, validateAmount]);

  const handlePoolClick = useCallback((poolId: string) => {
    handlePoolChange(poolId);
    setUIState(prev => ({ ...prev, showForm: true }));
  }, [handlePoolChange]);

  const setShowForm = useCallback((show: boolean) => {
    setUIState(prev => ({ ...prev, showForm: show }));
  }, []);

  const setTransactionPending = useCallback((pending: boolean) => {
    setUIState(prev => ({ ...prev, transactionPending: pending }));
  }, []);

  const setShowInfo = useCallback((show: boolean) => {
    setUIState(prev => ({ ...prev, showInfo: show }));
  }, []);

  const setNote = useCallback((note: string) => {
    setFormData(prev => ({ ...prev, note }));
  }, []);

  return {
    formData,
    uiState,
    handleAmountChange,
    handlePoolChange,
    handlePoolClick,
    validateAmount,
    setShowForm,
    setTransactionPending,
    setShowInfo,
    setNote
  };
};