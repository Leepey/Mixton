export interface ContractState {
  address: string;
  balance: number;
  status: 'active' | 'inactive' | 'frozen';
  lastActivity: Date;
}

export interface MixtonContract extends ContractState {
  pools: PoolContract[];
  totalMixed: number;
  fee: number;
}

export interface PoolContract extends ContractState {
  poolId: string;
  minAmount: number;
  maxAmount: number;
  currentBalance: number;
  participants: number;
}

export interface Transaction {
  id: string;
  hash: string;
  from: string;
  to: string;
  amount: number;
  status: 'pending' | 'success' | 'failed';
  timestamp: Date;
  fee: number;
}