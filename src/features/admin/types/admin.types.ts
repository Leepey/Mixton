export interface AdminUser {
  id: string;
  address: string;
  role: 'user' | 'admin' | 'moderator';
  status: 'active' | 'suspended' | 'banned';
  joinDate: number;
  totalTransactions: number;
  totalVolume: number;
}

export interface ContractSettings {
  feeRates: {
    basic: number;
    standard: number;
    premium: number;
  };
  limits: {
    minDeposit: number;
    maxDeposit: number;
    minWithdraw: number;
    maxWithdraw: number;
  };
  delays: {
    minDelay: number;
    maxDelay: number;
  };
  pools: {
    basic: { min: number; max: number; participants: number };
    standard: { min: number; max: number; participants: number };
    premium: { min: number; max: number; participants: number };
  };
}

export interface SecuritySettings {
  blacklist: string[];
  signers: string[];
  requiredSignatures: number;
  maxRetries: number;
  autoProcess: boolean;
  auditLogging: boolean;
}

export interface AnalyticsData {
  totalDeposits: number;
  totalWithdrawn: number;
  activeUsers: number;
  totalVolume: number;
  feesCollected: number;
  poolUtilization: {
    basic: number;
    standard: number;
    premium: number;
  };
  transactionHistory: Array<{
    date: string;
    deposits: number;
    withdrawals: number;
    volume: number;
  }>;
}