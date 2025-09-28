// ������� ���� ����������
export interface AppState {
  loading: boolean;
  error: string | null;
  theme: 'light' | 'dark';
  language: 'ru' | 'en';
}

// ���� ������������
export interface User {
  id: string;
  username: string;
  email: string;
  address: string;
  role: 'user' | 'admin';
  createdAt: Date;
  lastLogin: Date;
  isActive: boolean;
}

// ���� ����������
export interface Transaction {
  id: string;
  hash: string;
  from: string;
  to: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
  type: 'deposit' | 'withdrawal' | 'mixing';
}

// ���� ��� ������������
export interface MixingRequest {
  id: string;
  userId: string;
  amount: number;
  poolId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
  transactions: Transaction[];
}

// ���� ��� �����
export interface Pool {
  id: string;
  name: string;
  balance: number;
  totalDeposits: number;
  totalWithdrawals: number;
  fee: number;
  minAmount: number;
  maxAmount: number;
  isActive: boolean;
  createdAt: Date;
}
