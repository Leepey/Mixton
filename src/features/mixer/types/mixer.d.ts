// src/types/mixer.d.ts
export interface MixTransaction {
  id: string;
  poolId: string;
  amount: number;
  fee: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  timestamp: number;
  txHash?: string;
  inputAddress: string;
  outputAddress: string;
  note?: string;
  depositId?: string; // Добавлено поле depositId
  delayHours?: number; // Добавлено поле delayHours
}

export interface MixPool {
  id: string;
  name: string;
  minAmount: number;
  maxAmount: number;
  fee: number;
  minDelayHours: number;
  isActive: boolean;
  participants: number;
  volume: number;
  description: string;
}

export interface PendingTransaction {
  id: string;
  recipient: string;
  amount: number;
  scheduledTime: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  retryCount: number;
  poolId: string;
  depositId?: string; // Добавлено поле depositId
}

export interface MixerServiceResponse {
  success: boolean;
  message: string;
  data?: {
    transaction: MixTransaction;
    poolAddress?: string;
    fee?: bigint;
  };
}

export interface MixFormData {
  inputAddress?: string;
  amount?: number; 
  mixingOption?: string; 
  outputAddresses?: string[];
  note?: string;
  delayHours?: number;
  fee?: number;
  recipients?: { address: string; amount: number; delay: number }[];
  poolId?: string;
  depositId?: string; // Добавлено поле depositId
}