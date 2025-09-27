import type { AppConfig } from './types/config.types';
import { developmentConfig } from './environments/development';
import { productionConfig } from './environments/production';
import { testConfig } from './environments/test';

// Определение текущего окружения
const getEnvironment = (): 'development' | 'production' | 'test' => {
  const env = process.env.NODE_ENV || 'development';
  
  if (env === 'production') return 'production';
  if (env === 'test') return 'test';
  return 'development';
};

// Выбор конфигурации на основе окружения
const getConfig = (): AppConfig => {
  const environment = getEnvironment();
  
  switch (environment) {
    case 'production':
      return productionConfig;
    case 'test':
      return testConfig;
    default:
      return developmentConfig;
  }
};

// Экспорт основной конфигурации
export const config = getConfig();

// Экспорт утилит для проверки окружения
export const isDevelopment = (): boolean => config.app.environment === 'development';
export const isProduction = (): boolean => config.app.environment === 'production';
export const isTest = (): boolean => config.app.environment === 'test';

// Экспорт утилит для TON
export const getTonEndpoint = (): string => {
  return config.ton.endpoints[config.ton.network];
};

export const isTestnet = (): boolean => {
  return config.ton.network === 'testnet';
};

export const getExplorerUrl = (address: string): string => {
  const baseUrl = config.ton.network === 'testnet' 
    ? 'https://testnet.tonscan.org' 
    : 'https://tonscan.org';
  return `${baseUrl}/address/${address}`;
};

export const getCurrentGasPrice = (): number => {
  return config.ton.gasPrices[config.ton.network];
};

// Экспорт утилит для API
export const getApiUrl = (endpoint?: keyof typeof config.api.endpoints, path?: string): string => {
  const baseUrl = config.api.baseUrl;
  const endpointPath = endpoint ? config.api.endpoints[endpoint] : '';
  const additionalPath = path || '';
  return `${baseUrl}${endpointPath}${additionalPath}`;
};

export const getApiHeaders = (): Record<string, string> => {
  return {
    ...config.api.headers,
  };
};

// Экспорт утилит для контракта
export const getContractAddress = (): string => {
  return config.contract.address;
};

export const getOperationCode = (operation: keyof typeof config.contract.operationCodes): number => {
  return config.contract.operationCodes[operation];
};

export const getGasLimit = (operation: keyof typeof config.contract.gasLimits): number => {
  return config.contract.gasLimits[operation];
};

export const getFeeByPool = (poolType: keyof typeof config.contract.fees): number => {
  return config.contract.fees[poolType];
};

// Экспорт утилит для аутентификации
export const getSessionTimeout = (): number => {
  return config.auth.sessionTimeout;
};

export const getMaxLoginAttempts = (): number => {
  return config.auth.maxLoginAttempts;
};

export const getTokenRefreshThreshold = (): number => {
  return config.auth.tokenRefreshThreshold;
};

export const isWalletAuthEnabled = (): boolean => {
  return config.auth.providers.wallet;
};

export const isEmailAuthEnabled = (): boolean => {
  return config.auth.providers.email;
};

// Экспорт утилит для UI
export const getAppTheme = (): 'light' | 'dark' => {
  return config.ui.theme;
};

export const getAppLanguage = (): string => {
  return config.ui.language;
};

export const areAnimationsEnabled = (): boolean => {
  return config.ui.animations;
};

// Экспорт утилит для shared конфигурации
export const isAdminPanelEnabled = (): boolean => {
  return config.shared.features.adminPanel;
};

export const isAnalyticsEnabled = (): boolean => {
  return config.shared.features.analytics;
};

export const areNotificationsEnabled = (): boolean => {
  return config.shared.features.notifications;
};

export const isCachingEnabled = (): boolean => {
  return config.shared.performance.enableCaching;
};

export const getCacheTimeout = (): number => {
  return config.shared.performance.cacheTimeout;
};

// Экспорт типов
export type { AppConfig } from './types/config.types';
export type { Network, NetworkConfig, PoolConfig } from './types/network.types';

// Экспорт сетевых конфигураций
export { NETWORKS } from './types/network.types';

// Логирование конфигурации (только в development)
if (isDevelopment()) {
  console.log('🔧 App Configuration:', {
    environment: config.app.environment,
    debug: config.app.debug,
    tonNetwork: config.ton.network,
    apiBaseUrl: config.api.baseUrl,
    features: config.shared.features,
  });
}