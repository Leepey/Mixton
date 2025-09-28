import type { AppConfig } from '../types/config.types';

export const testConfig: AppConfig = {
  app: {
    name: 'Mixton Test',
    version: '1.0.0',
    environment: 'test',
    debug: true,
    maintainer: {
      name: 'Mixton Test Team',
      email: 'test@mixton.io',
    },
  },
  ton: {
    network: 'testnet',
    endpoints: {
      mainnet: 'https://toncenter.com/api/v2',
      testnet: 'https://testnet.toncenter.com/api/v2',
    },
    timeout: 5000,
    retries: 1,
    gasPrices: {
      mainnet: 1000,
      testnet: 100,
    },
  },
  contract: {
    address: process.env.REACT_APP_CONTRACT_ADDRESS || 'EQD...test_contract_address',
    operationCodes: {
      deposit: 0x6465706f,
      withdraw: 0x695f7764,
      mix: 0x6d697800,
      emergencyWithdraw: 0x656d657267,
      updateSettings: 0x75706473,
    },
    gasLimits: {
      deposit: 500000,
      withdraw: 750000,
      mix: 1000000,
      emergencyWithdraw: 500000,
      updateSettings: 250000,
    },
    fees: {
      basic: 0.001,
      standard: 0.002,
      premium: 0.005,
    },
  },
  api: {
    baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001',
    timeout: 5000,
    retries: 1,
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mixton-Test/1.0.0',
    },
    endpoints: {
      health: '/health',
      stats: '/stats',
      transactions: '/transactions',
      pools: '/pools',
    },
  },
  auth: {
    sessionTimeout: 1800000, // 30 минут
    maxLoginAttempts: 10,
    tokenRefreshThreshold: 120000, // 2 минуты
    providers: {
      wallet: true,
      email: true,
    },
  },
  ui: {
    theme: 'light',
    language: 'en',
    animations: false,
    currency: 'TON',
    dateFormat: 'MM/DD/YYYY',
  },
  shared: {
    features: {
      adminPanel: true,
      analytics: false,
      notifications: false,
    },
    performance: {
      enableCaching: false,
      cacheTimeout: 0,
    },
    security: {
      enableCSP: false,
      maxSessionAge: 3600000, // 1 час
    },
  },
};