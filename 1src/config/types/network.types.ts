// Типы для сетевой конфигурации
export type Network = 'mainnet' | 'testnet';

export interface NetworkConfig {
  name: string;
  endpoint: string;
  isTestnet: boolean;
  currency: string;
  explorerUrl: string;
  gasPrice: number;
}

export const NETWORKS: Record<Network, NetworkConfig> = {
  mainnet: {
    name: 'TON Mainnet',
    endpoint: 'https://toncenter.com/api/v2',
    isTestnet: false,
    currency: 'TON',
    explorerUrl: 'https://tonscan.org',
    gasPrice: 1000,
  },
  testnet: {
    name: 'TON Testnet',
    endpoint: 'https://testnet.toncenter.com/api/v2',
    isTestnet: true,
    currency: 'TON',
    explorerUrl: 'https://testnet.tonscan.org',
    gasPrice: 100,
  },
};

export interface PoolConfig {
  id: string;
  name: string;
  fee: number;
  minAmount: number;
  maxAmount: number;
  delayHours: number;
  isActive: boolean;
}