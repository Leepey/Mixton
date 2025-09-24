// src/features/dashboard/types/dashboard.types.ts
export interface DashboardStats {
  walletBalance: number;
  totalTransactions: number;
  lastMixStatus: 'completed' | 'pending' | 'none';
  lastMixTime: string | null;
}

export interface Pool {
  id: string;
  name: string;
  minAmount: number;
  fee: number;
  participants: number;
}

export interface MixTransaction {
  id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'processing';
  timestamp: number;
}

// Добавляем интерфейс TransactionData
export interface TransactionData {
  id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'processing';
  timestamp: number;
  // Дополнительные поля, если нужны
  inputAddress?: string;
  outputAddresses?: string[];
  fee?: number;
  note?: string;
}

export interface DashboardTab {
  id: number;
  label: string;
  icon: React.ReactNode;
}

// Типы для фильтров
export interface TransactionFilters {
  status?: string | string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  minAmount?: number;
  searchQuery?: string;
}

// Типы для пагинации
export interface PaginationData {
  page: number;
  limit: number;
  total: number;
}