// src copy/features/shared/types/context.types.ts
import type { 
  MixTransaction, 
  MixPool, 
  PendingTransaction 
} from '../../mixer/types/mixer';
import type { 
  PoolFeeRates, 
  ContractLimits, 
  PoolDelays, 
  BasicStats, 
  QueueStatus, 
  QueueDetails 
} from './ton';

export interface MixerContextType {
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
  getAvailablePools: () => Promise<MixPool[]>;
  clearHistory: () => void;
  clearMessages: () => void;
  loadContractBalance: () => Promise<string>;
  loadPoolsInfo: () => Promise<void>;
  loadStats: () => Promise<void>;
  loadQueueInfo: () => Promise<void>;
  processPendingTransactions: (transactions?: PendingTransaction[]) => Promise<void>;
  processQueue: () => Promise<string | null | undefined>;
  
  // Сеттеры
  setMixHistory: React.Dispatch<React.SetStateAction<MixTransaction[]>>;
}

export interface MixerProviderProps {
  children: React.ReactNode;
}