import type { AppConfig } from '../types/config.types';

export const developmentConfig: AppConfig = {
  app: {
    name: 'Mixton',
    version: '1.0.0',
    environment: 'development',
    debug: true,
    maintainer: {
      name: 'Mixton Team',
      email: 'dev@mixton.io',
      url: 'https://mixton.io',
    },
  },
  ton: {
    network: 'testnet',
    endpoints: {
      mainnet: 'https://toncenter.com/api/v2',
      testnet: 'https://testnet.toncenter.com/api/v2',
    },
    timeout: 15000,
    retries: 3,
    gasPrices: {
      mainnet: 1000,
      testnet: 100,
    },
  },
  contract: {
    address: process.env.REACT_APP_CONTRACT_ADDRESS || 'EQD...test_contract_address',
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
    baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001',
    timeout: 15000,
    retries: 3,
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mixton-Dev/1.0.0',
    },
    endpoints: {
      health: '/health',
      stats: '/stats',
      transactions: '/transactions',
      pools: '/pools',
    },
  },
  auth: {
    sessionTimeout: 3600000, // 1 час
    maxLoginAttempts: 5,
    tokenRefreshThreshold: 300000, // 5 минут
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
      cacheTimeout: 300000, // 5 минут
    },
    security: {
      enableCSP: false,
      maxSessionAge: 86400000, // 24 часа
    },
  },
};