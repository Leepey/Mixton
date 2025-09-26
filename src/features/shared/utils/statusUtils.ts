// features/shared/utils/statusUtils.ts
import type { AppStatus, TransactionStatus, SystemStatus, UserStatus } from '../types/status.types';
import { 
  CheckCircle, 
  HourglassEmpty, 
  Warning,
  Circle,
  PowerSettingsNew,
  Build,
  Person,
  PersonOff,
  Block,
  Schedule
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
    completed: <CheckCircle />,
    pending: <HourglassEmpty />,
    failed: <Warning />
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
    online: <PowerSettingsNew />,
    offline: <Circle />,
    maintenance: <Build />,
    error: <Warning />
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
    active: <Person />,
    inactive: <PersonOff />,
    banned: <Block />,
    pending: <Schedule />
  }[status];
};

/**
 * Форматирует метку статуса для отображения
 */
export const formatStatusLabel = (status: string): string => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};