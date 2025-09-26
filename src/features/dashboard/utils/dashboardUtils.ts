// features/dashboard/utils/dashboardUtils.ts
import type { Transaction } from '../types/dashboard.types';

export const formatTransactionStatus = (status: Transaction['status']): string => {
  const statusMap = {
    completed: 'Completed',
    pending: 'Pending',
    failed: 'Failed'
  };
  return statusMap[status] || status;
};

export const formatAmount = (amount: number): string => {
  return `${amount.toFixed(2)} TON`;
};

export const formatTimestamp = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString();
};

export const calculateTimeAgo = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
};