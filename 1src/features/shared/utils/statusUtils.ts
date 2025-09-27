// src/features/shared/utils/statusUtils.ts
import type { AppStatus, TransactionStatus, SystemStatus, UserStatus } from '../types/status.types';
import {
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Warning as WarningIcon,
  Circle as CircleIcon,
  PowerSettingsNew as PowerSettingsNewIcon,
  Build as BuildIcon,
  Person as PersonIcon,
  PersonOff as PersonOffIcon,
  Block as BlockIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';

/**
 * Получает цвет для статуса транзакции
 */
export const getTransactionStatusColor = (status: TransactionStatus): AppStatus => {
  return {
    completed: 'success',
    pending: 'warning',
    failed: 'error'
  }[status];
};

/**
 * Получает иконку для статуса транзакции
 */
export const getTransactionStatusIcon = (status: TransactionStatus) => {
  return {
    completed: <CheckCircleIcon />,
    pending: <HourglassEmptyIcon />,
    failed: <WarningIcon />
  }[status];
};

/**
 * Получает цвет для статуса системы
 */
export const getSystemStatusColor = (status: SystemStatus): AppStatus => {
  return {
    online: 'success',
    offline: 'warning',
    maintenance: 'info',
    error: 'error'
  }[status];
};

/**
 * Получает иконку для статуса системы
 */
export const getSystemStatusIcon = (status: SystemStatus) => {
  return {
    online: <CheckCircleIcon />,
    offline: <PowerSettingsNewIcon />,
    maintenance: <BuildIcon />,
    error: <WarningIcon />
  }[status];
};

/**
 * Получает цвет для статуса пользователя
 */
export const getUserStatusColor = (status: UserStatus): AppStatus => {
  return {
    active: 'success',
    inactive: 'default',
    banned: 'error',
    pending: 'warning'
  }[status];
};

/**
 * Получает иконку для статуса пользователя
 */
export const getUserStatusIcon = (status: UserStatus) => {
  return {
    active: <PersonIcon />,
    inactive: <PersonOffIcon />,
    banned: <BlockIcon />,
    pending: <ScheduleIcon />
  }[status];
};

/**
 * Форматирует метку статуса для отображения
 */
export const formatStatusLabel = (status: string): string => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

/**
 * Получает описание для статуса транзакции
 */
export const getTransactionStatusDescription = (status: TransactionStatus): string => {
  const descriptions = {
    completed: 'Transaction completed successfully',
    pending: 'Transaction is being processed',
    failed: 'Transaction failed to complete'
  };
  return descriptions[status] || 'Unknown status';
};

/**
 * Получает описание для статуса системы
 */
export const getSystemStatusDescription = (status: SystemStatus): string => {
  const descriptions = {
    online: 'System is operating normally',
    offline: 'System is currently offline',
    maintenance: 'System is under maintenance',
    error: 'System has encountered an error'
  };
  return descriptions[status] || 'Unknown status';
};

/**
 * Получает описание для статуса пользователя
 */
export const getUserStatusDescription = (status: UserStatus): string => {
  const descriptions = {
    active: 'User account is active',
    inactive: 'User account is inactive',
    banned: 'User account has been banned',
    pending: 'User account is pending verification'
  };
  return descriptions[status] || 'Unknown status';
};

/**
 * Проверяет, является ли статус "активным" (положительным)
 */
export const isPositiveStatus = (status: string): boolean => {
  const positiveStatuses = ['success', 'completed', 'online', 'active'];
  return positiveStatuses.includes(status.toLowerCase());
};

/**
 * Проверяет, является ли статус "предупреждающим"
 */
export const isWarningStatus = (status: string): boolean => {
  const warningStatuses = ['warning', 'pending', 'maintenance', 'offline'];
  return warningStatuses.includes(status.toLowerCase());
};

/**
 * Проверяет, является ли статус "ошибочным" (отрицательным)
 */
export const isErrorStatus = (status: string): boolean => {
  const errorStatuses = ['error', 'failed', 'banned'];
  return errorStatuses.includes(status.toLowerCase());
};