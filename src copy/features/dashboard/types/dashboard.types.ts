// features/dashboard/types/dashboard.types.ts
export interface DashboardStats {
  balance: number;
  totalTransactions: number;
  lastMixStatus: 'completed' | 'pending' | 'none';
  lastMixTime?: string;
}

export interface Pool {
  id: string;
  name: string;
  minAmount: number;
  fee: number;
  participants: number;
}

export interface Transaction {
  id: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  timestamp: number;
  poolId?: string;
}

export interface MixFormData {
  inputAddress: string;
  amount: number;
  mixingOption: string;
  fee: number;
  outputAddresses: string[];
  note?: string;
}

export type DashboardTab = 'overview' | 'mixing' | 'history' | 'settings';