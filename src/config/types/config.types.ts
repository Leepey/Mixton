// TypeScript типы для конфигурации приложения
export interface AppConfig {
  app: AppConfiguration;
  ton: TonConfiguration;
  contract: ContractConfiguration;
  api: ApiConfiguration;
  auth: AuthConfiguration;
  ui: UiConfiguration;
  shared: SharedConfiguration;
}

export interface AppConfiguration {
  name: string;
  version: string;
  environment: 'development' | 'production' | 'test';
  debug: boolean;
  maintainer: {
    name: string;
    email: string;
    url?: string;
  };
}

export interface TonConfiguration {
  network: 'mainnet' | 'testnet';
  endpoints: {
    mainnet: string;
    testnet: string;
  };
  timeout: number;
  retries: number;
  gasPrices: {
    mainnet: number;
    testnet: number;
  };
}

export interface ContractConfiguration {
  address: string;
  operationCodes: {
    deposit: number;
    withdraw: number;
    mix: number;
    emergencyWithdraw: number;
    updateSettings: number;
  };
  gasLimits: {
    deposit: number;
    withdraw: number;
    mix: number;
    emergencyWithdraw: number;
    updateSettings: number;
  };
  fees: {
    basic: number;
    standard: number;
    premium: number;
  };
}

export interface ApiConfiguration {
  baseUrl: string;
  timeout: number;
  retries: number;
  headers: Record<string, string>;
  endpoints: {
    health: string;
    stats: string;
    transactions: string;
    pools: string;
  };
}

export interface AuthConfiguration {
  sessionTimeout: number;
  maxLoginAttempts: number;
  tokenRefreshThreshold: number;
  providers: {
    wallet: boolean;
    email: boolean;
  };
}

export interface UiConfiguration {
  theme: 'light' | 'dark';
  language: string;
  animations: boolean;
  currency: string;
  dateFormat: string;
}

export interface SharedConfiguration {
  features: {
    adminPanel: boolean;
    analytics: boolean;
    notifications: boolean;
  };
  performance: {
    enableCaching: boolean;
    cacheTimeout: number;
  };
  security: {
    enableCSP: boolean;
    maxSessionAge: number;
  };
}