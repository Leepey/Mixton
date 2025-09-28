// src/features/mixer/types/mixer.ts

/**
 * Интерфейс для пула микширования
 */
export interface MixPool {
  id: string;
  name: string;
  description: string;
  fee: number; // процент комиссии (0.01 = 1%)
  minAmount: number; // минимальная сумма в TON
  maxAmount: number; // максимальная сумма в TON
  delay: number; // задержка в секундах
  participants: number; // текущее количество участников
  volume: number; // общий объем пула в TON
  status: 'active' | 'maintenance' | 'full' | 'inactive';
  anonymityLevel: number; // уровень анонимности (1-5)
  estimatedTime: number; // примерное время в секундах
}


/**
 * Данные формы микширования
 */
export interface MixFormData {
  amount: string;
  selectedPool: string;
  recipients?: Recipient[];
  note?: string;
  delay?: number;
  fee?: number;
  totalAmount?: number;
}

/**
 * Получатель средств при микшировании
 */
export interface Recipient {
  address: string;
  amount: number;
  delay: number; // задержка в секундах
}

/**
 * Статус транзакции микширования
 */
export type MixTransactionStatus = 
  | 'pending'       // ожидание обработки
  | 'processing'    // в процессе
  | 'completed'     // завершено успешно
  | 'failed'        // ошибка
  | 'cancelled'     // отменено
  | 'refunded';     // возвращено

/**
 * Информация о транзакции микширования
 */
export interface MixTransaction {
  id: string;
  userId: string;
  poolId: string;
  inputAmount: number;
  outputAmount: number;
  fee: number;
  status: MixTransactionStatus;
  recipients: Recipient[];
  createdAt: Date;
  completedAt?: Date;
  txHash?: string; // хеш транзакции в блокчейне
  errorMessage?: string;
}

/**
 * Параметры для создания транзакции микширования
 */
export interface CreateMixTransactionParams {
  amount: number;
  poolId: string;
  recipients: Recipient[];
  note?: string;
  delay?: number;
}

/**
 * Ответ API при создании транзакции
 */
export interface CreateMixTransactionResponse {
  success: boolean;
  transactionId?: string;
  message?: string;
  error?: string;
}

/**
 * Статистика микшера
 */
export interface MixerStats {
  totalTransactions: number;
  totalVolume: number;
  activeUsers: number;
  averageFee: number;
  pools: {
    active: number;
    total: number;
  };
  transactionsByStatus: Record<MixTransactionStatus, number>;
}

/**
 * Параметры для получения списка транзакций
 */
export interface GetTransactionsParams {
  userId?: string;
  status?: MixTransactionStatus;
  poolId?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'createdAt' | 'amount' | 'status';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Ответ API со списком транзакций
 */
export interface GetTransactionsResponse {
  transactions: MixTransaction[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * Параметры для фильтрации пулов
 */
export interface GetPoolsParams {
  status?: MixPool['status'];
  minAmount?: number;
  maxAmount?: number;
  anonymityLevel?: number;
}

/**
 * История изменений транзакции
 */
export interface TransactionHistory {
  id: string;
  transactionId: string;
  status: MixTransactionStatus;
  timestamp: Date;
  details?: string;
  userId?: string;
}

/**
 * Ошибки микшера
 */
export const MixerError = {
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
  INVALID_AMOUNT: 'INVALID_AMOUNT',
  POOL_NOT_FOUND: 'POOL_NOT_FOUND',
  POOL_FULL: 'POOL_FULL',
  POOL_INACTIVE: 'POOL_INACTIVE',
  INVALID_RECIPIENT: 'INVALID_RECIPIENT',
  NETWORK_ERROR: 'NETWORK_ERROR',
  CONTRACT_ERROR: 'CONTRACT_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
} as const;

export type MixerError = typeof MixerError[keyof typeof MixerError];

/**
 * Конфигурация микшера
 */
export interface MixerConfig {
  minAmount: number;
  maxAmount: number;
  maxRecipients: number;
  maxDelay: number; // в секундах
  feeRange: {
    min: number;
    max: number;
  };
  supportedCurrencies: string[];
  contractAddress: string;
  network: 'mainnet' | 'testnet';
}

/**
 * События микшера
 */
export type MixerEvent = 
  | { type: 'TRANSACTION_CREATED'; payload: MixTransaction }
  | { type: 'TRANSACTION_UPDATED'; payload: MixTransaction }
  | { type: 'POOL_UPDATED'; payload: MixPool }
  | { type: 'ERROR'; payload: { error: MixerError; message: string } };

/**
 * Типы уведомлений микшера
 */
export interface MixerNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    callback: () => void;
  };
}