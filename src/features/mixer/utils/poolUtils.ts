// src/utils/poolUtils.ts
import type { MixPool } from '../types/mixer';

export const getPoolData = (poolId: string, pools: MixPool[], fallback: MixPool): MixPool => {
  return pools.find(pool => pool.id === poolId) || fallback;
};

export const getPoolProperty = <T extends keyof MixPool>(
  poolId: string,
  pools: MixPool[],
  property: T,
  fallback: Required<MixPool>[T]
): Required<MixPool>[T] => {
  const pool = pools.find(p => p.id === poolId);
  const value = pool?.[property];
  
  // Если значение существует и не undefined, возвращаем его
  if (value !== undefined && value !== null) {
    return value as Required<MixPool>[T];
  }
  
  // Иначе возвращаем fallback
  return fallback;
};