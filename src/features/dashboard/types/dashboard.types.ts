// src/features/dashboard/types/dashboard.types.ts
export interface DashboardStats {
  totalDeposits: number;
  totalWithdrawn: number;
  activeUsers: number;
  poolUtilization: Record<string, number>;
}

export interface QueueItem {
  id: string;
  recipient: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed';
  priority: number;
}