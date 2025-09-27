import type { AppConfig } from '../types/config.types';

export const productionConfig: AppConfig = {
  app: {
    name: 'Mixton',
    version: '1.0.0',
    environment: 'production',
    debug: false,
    maintainer: {
      name: 'Mixton Team',
      email: 'support@mixton.io',
      url: 'https://mixton.io',
    },
  },
  ton: {
    network: 'mainnet',
    endpoints: {
      mainnet: 'https://toncenter.com/api/v2',
      testnet: 'https://testnet.toncenter.com/api/v2',
    },
    timeout: 10000,
    retries: 3,
    gasPrices: {
      mainnet: 1000,
      testnet: 100,
    },
  },
  contract: {
    address: process.env.REACT_APP_CONTRACT_ADDRESS || 'EQD...main_contract_address',
    operationCodes: {
      deposit: 0x6465706f,        // 'depo'
      withdraw: 0x695f7764,     // 'i_wd'
      mix: 0x6d697800,           // 'mix\x00'
      emergencyWithdraw: 0x656d657267, // 'emerg'
      updateSettings: 0x75706473, // 'upds'
    },
    gasLimits: {
      deposit: 1000000,
      withdraw: 1500000,
      mix: 2000000,
      emergencyWithdraw: 1000000,
      updateSettings: 500000,
    },
    fees: {
      basic: 0.003,
      standard: 0.005,
      premium: 0.01,
    },
  },
  api: {
    baseUrl: process.env.REACT_APP_API_URL || 'https://api.mixton.io',
    timeout: 10000,
    retries: 3,
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mixton/1.0.0',
    },
    endpoints: {
      health: '/health',
      stats: '/stats',
      transactions: '/transactions',
      pools: '/pools',
    },
  },
  auth: {
    sessionTimeout: 7200000, // 2 часа
    maxLoginAttempts: 3,
    tokenRefreshThreshold: 600000, // 10 минут
    providers: {
      wallet: true,
      email: false,
    },
  },
  ui: {
    theme: 'dark',
    language: 'en',
    animations: true,
    currency: 'TON',
    dateFormat: 'MMM DD, YYYY',
  },
  shared: {
    features: {
      adminPanel: true,
      analytics: true,
      notifications: true,
    },
    performance: {
      enableCaching: true,
      cacheTimeout: 600000, // 10 минут
    },
    security: {
      enableCSP: true,
      maxSessionAge: 86400000, // 24 часа
    },
  },
};