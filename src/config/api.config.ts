import type { ApiConfiguration } from './types/config.types';

export const apiConfig: ApiConfiguration = {
  baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001',
  timeout: parseInt(process.env.REACT_APP_API_TIMEOUT || '10000'),
  retries: parseInt(process.env.REACT_APP_API_RETRIES || '3'),
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': `Mixton/${process.env.REACT_APP_VERSION || '1.0.0'}`,
  },
  endpoints: {
    health: '/health',
    stats: '/stats',
    transactions: '/transactions',
    pools: '/pools',
  },
};

// Вспомогательные функции для API
export const getApiUrl = (endpoint?: keyof ApiConfiguration['endpoints'], path?: string): string => {
  const baseUrl = apiConfig.baseUrl;
  const endpointPath = endpoint ? apiConfig.endpoints[endpoint] : '';
  const additionalPath = path || '';
  return `${baseUrl}${endpointPath}${additionalPath}`;
};

export const getApiHeaders = (): Record<string, string> => {
  return {
    ...apiConfig.headers,
    // Можно добавить динамические заголовки, например, авторизацию
  };
};

export const getHealthCheckUrl = (): string => {
  return getApiUrl('health');
};

export const getStatsUrl = (): string => {
  return getApiUrl('stats');
};

export const getTransactionsUrl = (): string => {
  return getApiUrl('transactions');
};

export const getPoolsUrl = (): string => {
  return getApiUrl('pools');
};