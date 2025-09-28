// src/features/mixer/types/pool.types.ts
export interface Pool {
  id: string;
  name: string;
  liquidity: number;
  fee: number;
  minAmount: number;
  maxAmount: number;
}

export interface PoolStats {
  totalMixed: number;
  activeUsers: number;
  averageFee: number;
}