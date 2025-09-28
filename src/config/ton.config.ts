import type { TonConfiguration } from './types/config.types';
import { NETWORKS } from './types/network.types';

export const tonConfig: TonConfiguration = {
  network: (process.env.REACT_APP_TON_NETWORK as 'mainnet' | 'testnet') || 'testnet',
  endpoints: {
    mainnet: process.env.REACT_APP_TON_MAINNET_ENDPOINT || NETWORKS.mainnet.endpoint,
    testnet: process.env.REACT_APP_TON_TESTNET_ENDPOINT || NETWORKS.testnet.endpoint,
  },
  timeout: parseInt(process.env.REACT_APP_TON_TIMEOUT || '10000'),
  retries: parseInt(process.env.REACT_APP_TON_RETRIES || '3'),
  gasPrices: {
    mainnet: parseInt(process.env.REACT_APP_TON_GAS_PRICE_MAINNET || '1000'),
    testnet: parseInt(process.env.REACT_APP_TON_GAS_PRICE_TESTNET || '100'),
  },
};

// Вспомогательные функции для TON конфигурации
export const getTonEndpoint = (): string => {
  return tonConfig.endpoints[tonConfig.network];
};

export const isTestnet = (): boolean => {
  return tonConfig.network === 'testnet';
};

export const getExplorerUrl = (address: string): string => {
  const baseUrl = tonConfig.network === 'testnet' 
    ? NETWORKS.testnet.explorerUrl 
    : NETWORKS.mainnet.explorerUrl;
  return `${baseUrl}/address/${address}`;
};

export const getCurrentGasPrice = (): number => {
  return tonConfig.gasPrices[tonConfig.network];
};