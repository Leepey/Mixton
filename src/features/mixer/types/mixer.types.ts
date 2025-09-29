// src/features/mixer/types/mixer.types.ts

/**
 * Тип для транзакции миксинга в истории
 */
export interface MixTransaction {
  /** Уникальный идентификатор транзакции */
  id: string;
  /** Хеш транзакции в блокчейне */
  hash: string;
  /** Адрес отправителя */
  from: string;
  /** Адрес получателя */
  to: string;
  /** Сумма транзакции в TON */
  amount: number;
  /** Статус транзакции */
  status: 'pending' | 'success' | 'failed' | 'processing';
  /** Временная метка транзакции */
  timestamp: Date;
  /** Комиссия за транзакцию */
  fee: number;
  /** Необязательное примечание к транзакции */
  note?: string;
  /** Идентификатор пула, в котором был выполнен миксинг */
  poolId?: string;
  /** Идентификатор депозита */
  depositId?: bigint;
  /** Задержка в часах */
  delay?: number;
  /** Количество получателей (для разделенных транзакций) */
  recipientsCount?: number;
}

/**
 * Тип для доступного пула миксинга
 */
export interface MixPool {
  /** Уникальный идентификатор пула */
  id: string;
  /** Название пула */
  name: string;
  /** Минимальная сумма для депозита */
  minAmount: number;
  /** Максимальная сумма для депозита */
  maxAmount: number;
  /** Комиссия пула (в долях от 1, например 0.01 = 1%) */
  fee: number;
  /** Минимальная задержка в часах */
  minDelayHours: number;
  /** Активен ли пул */
  isActive: boolean;
  /** Текущее количество участников */
  participants: number;
  /** Общий объем пула */
  volume: number;
  /** Описание пула */
  description: string;
  /** Тип пула (соответствует PoolType из ton.d.ts) */
  poolType?: 0 | 1 | 2; // 0 - Basic, 1 - Standard, 2 - Premium
  /** Текущая очередь пула */
  queueLength?: number;
  /** Приоритет пула */
  priority?: number;
}

/**
 * Тип для ожидающей обработки транзакции
 */
export interface PendingTransaction {
  /** Уникальный идентификатор транзакции */
  id: string;
  /** Сумма транзакции */
  amount: number;
  /** Идентификатор пула */
  poolId: string;
  /** Временная метка создания */
  timestamp: Date;
  /** Текущий статус */
  status: 'pending' | 'processing' | 'completed' | 'failed';
  /** Хеш транзакции (если уже отправлена) */
  hash?: string;
  /** Идентификатор депозита */
  depositId?: bigint;
  /** Адрес отправителя */
  from?: string;
  /** Адреса получателей (для разделенных транзакций) */
  recipients?: {
    address: string;
    amount: number;
    delay: number;
  }[];
  /** Ожидаемое время обработки */
  estimatedProcessingTime?: Date;
  /** Комиссия за транзакцию */
  fee?: number;
  /** Количество оставшихся частей (для разделенных транзакций) */
  partsLeft?: number;
  /** Приоритет в очереди */
  priority?: number;
}

/**
 * Тип для информации о депозите
 */
export interface DepositInfo {
  /** Идентификатор депозита */
  depositId: bigint;
  /** Сумма депозита */
  amount: number;
  /** Пул депозита */
  pool: MixPool;
  /** Статус депозита */
  status: 'pending' | 'processing' | 'completed' | 'failed';
  /** Временная метка создания */
  timestamp: Date;
  /** Адрес отправителя */
  from: string;
  /** Хеш депозитной транзакции */
  depositHash: string;
  /** Хеш транзакции вывода (если завершен) */
  withdrawHash?: string;
  /** Задержка в секундах */
  delay: number;
  /** Получатели (для разделенных транзакций) */
  recipients?: {
    address: string;
    amount: number;
    delay: number;
    status: 'pending' | 'completed';
    hash?: string;
  }[];
}

/**
 * Тип для параметров миксинга
 */
export interface MixParams {
  /** Сумма для миксинга */
  amount: number;
  /** Необязательное примечание */
  note?: string;
  /** Получатели (для разделенных транзакций) */
  recipients?: {
    address: string;
    amount: number;
    delay: number;
  }[];
  /** Идентификатор пула */
  poolId?: string;
  /** Кастомная задержка в часах */
  customDelay?: number;
  /** Приоритет транзакции */
  priority?: number;
}

/**
 * Тип для результата операции миксинга
 */
export interface MixResult {
  /** Идентификатор транзакции */
  txId: string;
  /** Идентификатор пула */
  poolId?: string;
  /** Идентификатор депозита */
  depositId?: bigint;
  /** Статус операции */
  status: 'success' | 'failed' | 'pending';
  /** Сообщение об ошибке (если есть) */
  error?: string;
  /** Оценка времени обработки */
  estimatedTime?: number;
}

/**
 * Тип для статистики миксинга
 */
export interface MixStats {
  /** Общее количество миксингов */
  totalMixes: number;
  /** Общая сумма миксингов */
  totalAmount: number;
  /** Общая сумма комиссий */
  totalFees: number;
  /** Количество успешных миксингов */
  successfulMixes: number;
  /** Количество неудачных миксингов */
  failedMixes: number;
  /** Среднее время миксинга */
  averageMixTime: number;
  /** Количество активных пулов */
  activePools: number;
}