// src/features/mixer/types/transaction.types.ts
export interface Transaction {
  id: string;
  amount: number;
  poolId: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
  hash?: string;
}

export interface TransactionHistory {
  transactions: Transaction[];
  totalAmount: number;
  completedCount: number;
}