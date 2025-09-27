// src copy/features/shared/context/MixerContext.tsx
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useMixer } from '../../mixer/hooks/useMixer';
import type { MixTransaction, MixPool, PendingTransaction } from '../../mixer/types/mixer';
import type { PoolFeeRates, ContractLimits, PoolDelays, BasicStats, QueueStatus, QueueDetails } from '../types/ton';

interface MixerContextType {
  // Состояния
  mixHistory: MixTransaction[];
  availablePools: MixPool[];
  contractBalance: string;
  pendingTransactions: PendingTransaction[];
  error: string | null;
  success: string | null;
  isMixing: boolean;
  
  // Данные из контракта
  feeRates?: PoolFeeRates | null;
  limits?: ContractLimits | null;
  delays?: PoolDelays | null;
  stats?: BasicStats | null;
  queueStatus?: QueueStatus | null;
  queueDetails?: QueueDetails | null;
  
  // Методы
  mixTons: (
    amount: number,
    note?: string,
    recipients?: { address: string; amount: number; delay: number }[],
    poolId?: string,
    customDelay?: number
  ) => Promise<{ txId: string; poolId?: string; depositId?: bigint } | undefined>;
  checkTransactionStatus: (txId: string) => Promise<{ status: string }>;
  fetchMixHistory: () => Promise<void>;
  getAvailablePools: () => Promise<MixPool[]>; // Исправлено: возвращаем MixPool[]
  clearHistory: () => void;
  clearMessages: () => void;
  loadContractBalance: () => Promise<string>; // Исправлено: возвращаем string
  loadPoolsInfo: () => Promise<void>;
  loadStats: () => Promise<void>;
  loadQueueInfo: () => Promise<void>;
  processPendingTransactions: (transactions?: PendingTransaction[]) => Promise<void>;
  processQueue: () => Promise<string | null | undefined>; // Исправлено: возвращаем string | null | undefined
  
  // Сеттеры
  setMixHistory: React.Dispatch<React.SetStateAction<MixTransaction[]>>;
}

const MixerContext = createContext<MixerContextType | undefined>(undefined);

// Значения по умолчанию для контекста
const defaultContextValue: MixerContextType = {
  // Состояния по умолчанию
  mixHistory: [],
  availablePools: [],
  contractBalance: '0',
  pendingTransactions: [],
  error: null,
  success: null,
  isMixing: false,
  
  // Данные из контракта по умолчанию
  feeRates: null,
  limits: null,
  delays: null,
  stats: null,
  queueStatus: null,
  queueDetails: null,
  
  // Методы по умолчанию
  mixTons: async () => undefined,
  checkTransactionStatus: async () => ({ status: '' }),
  fetchMixHistory: async () => {},
  getAvailablePools: async () => [], // Исправлено: возвращаем пустой массив
  clearHistory: () => {},
  clearMessages: () => {},
  loadContractBalance: async () => '0', // Исправлено: возвращаем '0'
  loadPoolsInfo: async () => {},
  loadStats: async () => {},
  loadQueueInfo: async () => {},
  processPendingTransactions: async () => {},
  processQueue: async () => null, // Исправлено: возвращаем null
  
  // Сеттеры по умолчанию
  setMixHistory: () => {},
};

export const useMixerContext = (): MixerContextType => {
  const context = useContext(MixerContext);
  if (context === undefined) {
    console.warn('useMixerContext must be used within a MixerProvider');
    return defaultContextValue;
  }
  return context;
};

interface MixerProviderProps {
  children: ReactNode;
}

export const MixerProvider: React.FC<MixerProviderProps> = ({ children }) => {
  // Получаем все методы и состояния из хука useMixer
  const {
    mixHistory,
    setMixHistory,
    availablePools,
    contractBalance,
    pendingTransactions,
    error,
    success,
    isMixing,
    feeRates,
    limits,
    delays,
    stats,
    queueStatus,
    queueDetails,
    mixTons,
    checkTransactionStatus,
    fetchMixHistory,
    getAvailablePools,
    clearHistory,
    clearMessages,
    loadContractBalance,
    loadPoolsInfo,
    loadStats,
    loadQueueInfo,
    processPendingTransactions,
    processQueue,
  } = useMixer();

  // Значение, которое будет передано всем потребителям контекста
  const value: MixerContextType = {
    // Состояния
    mixHistory,
    availablePools,
    contractBalance,
    pendingTransactions,
    error,
    success,
    isMixing,
    
    // Данные из контракта
    feeRates,
    limits,
    delays,
    stats,
    queueStatus,
    queueDetails,
    
    // Методы
    mixTons,
    checkTransactionStatus,
    fetchMixHistory,
    getAvailablePools,
    clearHistory,
    clearMessages,
    loadContractBalance,
    loadPoolsInfo,
    loadStats,
    loadQueueInfo,
    processPendingTransactions,
    processQueue,
    
    // Сеттеры
    setMixHistory,
  };

  return (
    <MixerContext.Provider value={value}>
      {children}
    </MixerContext.Provider>
  );
};

export default MixerContext;