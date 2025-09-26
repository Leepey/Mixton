// src/features/auth/types/walletAuth.types.ts

/**
 * Конфигурация кошелька
 */
export interface WalletConfig {
  network?: 'mainnet' | 'testnet';
  maxRetries?: number;
  timeout?: number;
  autoConnect?: boolean;
  debugMode?: boolean;
}

/**
 * Информация о кошельке
 */
export interface WalletInfo {
  address: string;
  balance: string;
  network: 'mainnet' | 'testnet';
  isConnected: boolean;
  walletName?: string;
  walletVersion?: string;
  publicKey?: string;
}

/**
 * Результат транзакции
 */
export interface TransactionResult {
  success: boolean;
  txHash?: string;
  error?: string;
  blockNumber?: number;
  fee?: string;
  timestamp?: number;
}

/**
 * Параметры транзакции
 */
export interface TransactionParams {
  to: string;
  amount: number;
  message?: string;
  payload?: string;
  stateInit?: any;
  bounce?: boolean;
}

/**
 * Информация о транзакции
 */
export interface TransactionInfo {
  hash: string;
  lt: number;
  now: number;
  out_msgs: any[];
  description: string;
  fee: number;
  status: 'pending' | 'success' | 'failed';
}

/**
 * Разрешения кошелька
 */
export interface WalletPermissions {
  basic: boolean;
  tonConnect: boolean;
  transaction?: boolean;
  signMessage?: boolean;
}

/**
 * Данные о кошельке
 */
export interface WalletData {
  address: string;
  chain: string;
  publicKey: string;
  balance: string;
}

/**
 * Событие кошелька
 */
export interface WalletEvent {
  type: 'connect' | 'disconnect' | 'transaction' | 'error';
  payload?: any;
  timestamp: number;
}

/**
 * Статус подключения
 */
export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'error';

/**
 * Ошибка аутентификации кошелька
 */
export interface WalletAuthError {
  code: string;
  message: string;
  details?: any;
}

/**
 * Результат аутентификации
 */
export interface WalletAuthResult {
  success: boolean;
  wallet?: WalletInfo;
  error?: WalletAuthError;
}

/**
 * Параметры для подключения кошелька
 */
export interface ConnectWalletParams {
  manifestUrl: string;
  twaReturnUrl?: string;
  buttonsSettings?: {
    borderRadius?: string;
    theme?: string;
  };
  language?: string;
}

/**
 * Опции для транзакции
 */
export interface TransactionOptions {
  timeout?: number;
  maxRetries?: number;
  waitForConfirmation?: boolean;
}

/**
 * Результат проверки подписи
 */
export interface SignatureVerificationResult {
  isValid: boolean;
  error?: string;
  details?: any;
}