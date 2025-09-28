// src copy/features/mixer/hooks/useMixFormLogic.ts
import { useState, useCallback } from 'react';
import { useAuth } from '../../auth/context/AuthContext';
import { useMixerContext } from '../../shared/context/MixerContext';
import type { MixPool } from '../types/mixer';

interface MixFormLogicProps {
  initialPoolId?: string;
  initialAmount?: string;
  initialNote?: string;
  initialDelayHours?: number;
  onMixSuccess?: () => void;
}

interface UseMixFormLogicReturn {
  // Состояния
  amount: string;
  note: string;
  amountError: string;
  selectedPool: string;
  delayHours: number;
  isMixing: boolean;
  
  // Данные
  availablePools: MixPool[];
  user: any;
  
  // Обработчики
  handleAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleNoteChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handlePoolChange: (poolId: string) => void;
  handleDelayHoursChange: (hours: number) => void;
  handleMix: () => Promise<void>;
  
  // Вспомогательные функции
  validateAmount: (value: string) => boolean;
  calculateFee: () => number;
  getPoolById: (id: string) => MixPool | undefined;
}

export const useMixFormLogic = ({
  initialPoolId = '',
  initialAmount = '',
  initialNote = '',
  initialDelayHours = 1,
  onMixSuccess
}: MixFormLogicProps = {}): UseMixFormLogicReturn => {
  const { user } = useAuth();
  const { mixTons, availablePools } = useMixerContext();
  
  // Состояния
  const [amount, setAmount] = useState(initialAmount);
  const [note, setNote] = useState(initialNote);
  const [amountError, setAmountError] = useState('');
  const [selectedPool, setSelectedPool] = useState(initialPoolId);
  const [delayHours, setDelayHours] = useState(initialDelayHours);
  const [isMixing, setIsMixing] = useState(false);

  // Валидация суммы
  const validateAmount = useCallback((value: string): boolean => {
    if (!value) {
      setAmountError('Amount is required');
      return false;
    }
    
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) {
      setAmountError('Please enter a valid amount');
      return false;
    }
    
    // Проверка на соответствие пулу, если выбран
    if (selectedPool) {
      const pool = availablePools.find(p => p.id === selectedPool);
      if (pool) {
        if (num < pool.minAmount) {
          setAmountError(`Minimum amount for this pool is ${pool.minAmount} TON`);
          return false;
        }
        if (num > pool.maxAmount) {
          setAmountError(`Maximum amount for this pool is ${pool.maxAmount} TON`);
          return false;
        }
      }
    }
    
    setAmountError('');
    return true;
  }, [selectedPool, availablePools]);

  // Обработчики изменений
  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    if (!value) {
      setAmountError('Amount is required');
    } else {
      setAmountError('');
    }
  }, []);

  const handleNoteChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNote(e.target.value);
  }, []);

  const handlePoolChange = useCallback((poolId: string) => {
    setSelectedPool(poolId);
    const pool = availablePools.find(p => p.id === poolId);
    if (pool) {
      setAmount(pool.minAmount.toString());
    }
  }, [availablePools]);

  const handleDelayHoursChange = useCallback((hours: number) => {
    setDelayHours(hours);
  }, []);

  // Обработчик микширования
  const handleMix = useCallback(async (): Promise<void> => {
    if (!validateAmount(amount)) return;
    
    setIsMixing(true);
    try {
      // Формируем recipients для микширования
      const recipients = selectedPool ? [{
        address: '', // Будет заполнено в миксере
        amount: parseFloat(amount),
        delay: delayHours
      }] : undefined;
      
      await mixTons(
        parseFloat(amount),
        note,
        recipients,
        selectedPool,
        delayHours
      );
      
      // Сброс формы после успешного микширования
      setNote('');
      setAmount('');
      onMixSuccess?.();
    } catch (error) {
      console.error('Mix transaction failed:', error);
    } finally {
      setIsMixing(false);
    }
  }, [amount, note, selectedPool, delayHours, validateAmount, mixTons, onMixSuccess]);

  // Вспомогательные функции
  const calculateFee = useCallback((): number => {
    if (!amount || !selectedPool) return 0;
    
    const pool = availablePools.find(p => p.id === selectedPool);
    if (!pool) return 0;
    
    const amountNum = parseFloat(amount);
    return isNaN(amountNum) ? 0 : amountNum * pool.fee;
  }, [amount, selectedPool, availablePools]);

  const getPoolById = useCallback((id: string): MixPool | undefined => {
    return availablePools.find(p => p.id === id);
  }, [availablePools]);

  return {
    // Состояния
    amount,
    note,
    amountError,
    selectedPool,
    delayHours,
    isMixing,
    
    // Данные
    availablePools,
    user,
    
    // Обработчики
    handleAmountChange,
    handleNoteChange,
    handlePoolChange,
    handleDelayHoursChange,
    handleMix,
    
    // Вспомогательные функции
    validateAmount,
    calculateFee,
    getPoolById
  };
};