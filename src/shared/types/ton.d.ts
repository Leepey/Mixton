// src/types/ton.d.ts
export type PoolType = 0 | 1 | 2; // 0 - Basic, 1 - Standard, 2 - Premium

export interface PoolFeeRates {
    basicRate: number;
    standardRate: number;
    premiumRate: number;
}

export interface ContractLimits {
    minDeposit: bigint;
    maxDeposit: bigint;
    minWithdraw: bigint;
}

export interface PoolDelays {
    basicDelay: number;
    standardDelay: number;
    premiumDelay: number;
}

export interface BasicStats {
    totalDeposits: number;
    totalWithdrawn: number;
}

export interface DepositPoolInfo {
    pool: PoolType;
    status: number;
}

// Новые типы для работы с очередью
export type QueueStatus = 0 | 1 | 2; // 0: пуста, 1: ожидает, 2: готова к обработке

export interface QueueItem {
    recipient: string;
    amount: number;
    partsLeft: number;
    nextTime: number;
    depositId: number;
    priority: number;
    gasEstimate: number;
}

export interface QueueDetails {
    length: number;
    totalAmount: number;
    nextTime: number;
}

export interface MixerParams {
    minFee: number;
    maxFee: number;
    minDelay: number;
    maxDelay: number;
}

export interface SignersInfo {
    count: number;
    required: number;
}