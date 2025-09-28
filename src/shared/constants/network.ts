export const NETWORKS = {
  MAINNET: {
    id: 'mainnet',
    name: 'TON Mainnet',
    rpcUrl: 'https://toncenter.com/api/v2/jsonRPC',
    explorerUrl: 'https://tonscan.org',
    isTestnet: false,
  },
  TESTNET: {
    id: 'testnet',
    name: 'TON Testnet',
    rpcUrl: 'https://testnet.toncenter.com/api/v2/jsonRPC',
    explorerUrl: 'https://testnet.tonscan.org',
    isTestnet: true,
  },
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    REGISTER: '/auth/register',
  },
  USER: {
    PROFILE: '/user/profile',
    SETTINGS: '/user/settings',
  },
  MIXER: {
    POOLS: '/mixer/pools',
    MIX: '/mixer/mix',
    HISTORY: '/mixer/history',
    STATUS: '/mixer/status',
  },
  WALLET: {
    BALANCE: '/wallet/balance',
    TRANSACTIONS: '/wallet/transactions',
    CONNECT: '/wallet/connect',
  },
} as const;