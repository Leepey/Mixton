// features/admin/types/admin.types.ts
export interface AdminSettings {
  feeRate: number;
  minAmount: number;
  maxAmount: number;
  autoProcess: boolean;
  processInterval: number;
}

export interface PoolInfo {
  id: string;
  name: string;
  fee: number;
  minAmount: number;
  maxAmount: number;
  minDelayHours: number;
  isActive: boolean;
}

export interface FeeRates {
  basicRate: number;
  standardRate: number;
  premiumRate: number;
}

export interface Limits {
  minDeposit: string;
  maxDeposit: string;
  minWithdraw: string;
}

export interface Delays {
  basicDelay: number;
  standardDelay: number;
  premiumDelay: number;
}

export interface Stats {
  totalDeposits: string;
  totalWithdrawn: string;
}

export interface Transaction {
  id: string;
  amount: number;
  fee: number;
  status: 'completed' | 'pending' | 'failed';
  timestamp: number;
  pool: string;
  inputAddress?: string;
  outputAddresses?: string[];
  note?: string;
}


export interface AdminTab {
  id: number;
  name: string;
  icon: React.ReactNode;
  description?: string;
}


export interface Transaction {
  id: string;
  amount: number;
  fee: number;
  status: 'completed' | 'pending' | 'failed';
  timestamp: number;
  pool: string;
  inputAddress?: string;
  outputAddresses?: string[];
  note?: string;
}

export type AdminTabValue = 'overview' | 'settings' | 'pools' | 'transactions';

export interface AdminTab {
  id: number;
  name: string;
  icon: React.ReactNode;
  description?: string;
}

// Добавляем типы для статистики
export interface BasicStats {
  totalUsers: number;
  totalTransactions: number;
  totalVolume: number;
  averageFee: number;
  pendingTransactions: number;
  completedTransactions: number;
  failedTransactions: number;
  averageProcessingTime: number;
  contractBalance: number;
  uptime: number;
  
}

export interface PoolStats {
  totalPools: number;
  activePools: number;
  totalLiquidity: number;
  averagePoolSize: number;
}

// features/admin/types/admin.types.ts

export interface Transaction {
  id: string;
  amount: number;
  fee: number;
  status: 'completed' | 'pending' | 'failed';
  timestamp: number;
  pool: string;
  note?: string; // Оставляем опциональным
}

export interface TransactionStats {
  totalVolume: number;
  averageAmount: number;
  averageFee: number;
  successRate: number;
  averageProcessingTime: number;
}

export interface AdminStats {
  basic: BasicStats;
  pools: PoolStats;
  transactions: TransactionStats;
  lastUpdated: Date;
}

// Типы для статуса чипа
export type StatusChipColor = 'default' | 'error' | 'primary' | 'secondary' | 'info' | 'success' | 'warning';

export interface StatusChip {
  label: string;
  color: StatusChipColor;
  icon?: React.ReactNode;
}