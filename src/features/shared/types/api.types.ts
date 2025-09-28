// ���� ��� API �������� � �������

// ������� ��� �������
export interface MixRequest {
  amount: number;
  poolId: string;
  destinationAddress: string;
  delay?: number;
}

export interface MixResponse {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  estimatedTime: number;
  fee: number;
}

// ������� ��� ��������
export interface WalletBalanceResponse {
  address: string;
  balance: number;
  transactions: Transaction[];
}

export interface SendTransactionRequest {
  to: string;
  amount: number;
  comment?: string;
}

// ������� ��� �������
export interface AdminStatsResponse {
  totalUsers: number;
  totalTransactions: number;
  totalVolume: number;
  activePools: number;
  systemHealth: {
    cpu: number;
    memory: number;
    disk: number;
  };
}

export interface UserManagementRequest {
  userId: string;
  action: 'activate' | 'deactivate' | 'delete';
}

// ������� ��� ���������
export interface AnalyticsRequest {
  period: 'day' | 'week' | 'month' | 'year';
  metric: 'volume' | 'users' | 'transactions';
}

export interface AnalyticsResponse {
  data: Array<{
    date: string;
    value: number;
  }>;
  total: number;
  growth: number;
}

// ���� ��� ���������
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}
