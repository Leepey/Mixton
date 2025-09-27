// features/shared/types/status.types.ts

/**
 * Типы для статусов, используемых в приложении
 */
export type AppStatus = 'default' | 'error' | 'primary' | 'secondary' | 'info' | 'success' | 'warning';

/**
 * Типы для статусов транзакций
 */
export type TransactionStatus = 'completed' | 'pending' | 'failed';

/**
 * Типы для статусов системы
 */
export type SystemStatus = 'online' | 'offline' | 'maintenance' | 'error';

/**
 * Типы для статусов пользователей
 */
export type UserStatus = 'active' | 'inactive' | 'banned' | 'pending';

/**
 * Маппинг статусов транзакций к цветам
 */
export const transactionStatusColorMap: Record<TransactionStatus, AppStatus> = {
  completed: 'success',
  pending: 'warning',
  failed: 'error'
};

/**
 * Маппинг статусов системы к цветам
 */
export const systemStatusColorMap: Record<SystemStatus, AppStatus> = {
  online: 'success',
  offline: 'warning',
  maintenance: 'info',
  error: 'error'
};

/**
 * Маппинг статусов пользователей к цветам
 */
export const userStatusColorMap: Record<UserStatus, AppStatus> = {
  active: 'success',
  inactive: 'default',
  banned: 'error',
  pending: 'warning'
};