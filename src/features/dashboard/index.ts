// src/features/dashboard/index.ts
export { default as StatsModule } from './components/StatsModule';
export { default as PoolsModule } from './components/PoolsModule';
export { default as TransactionsModule } from './components/TransactionsModule';
export { default as SettingsModule } from './components/SettingsModule';

export { useDashboardStats } from './hooks/useDashboardStats';
export { usePoolsData } from './hooks/usePoolsData';
export { useQueueManagement } from './hooks/useQueueManagement';

export { dashboardService } from './services/dashboardService';
export { queueService } from './services/queueService';

export { formatCurrency, formatDate } from './utils/dashboardUtils';

// Экспорт новых утилит для транзакций
export {
  formatTransactionStatus,
  getStatusColor,
  formatTransactionDate,
  formatFullDateTime,
  formatAmount,
  formatAmountWithCurrency,
  filterTransactionsByStatus,
  filterTransactionsByDateRange,
  filterTransactionsByMinAmount,
  sortTransactionsByDate,
  sortTransactionsByAmount,
  calculateTransactionStats,
  groupTransactionsByStatus,
  groupTransactionsByDay,
  searchTransactions,
  validateTransactionData,
  generateTransactionId,
  exportTransactionsToCSV,
  getTimeUntilNextUpdate,
  isRecentTransaction,
  getStatusIcon,
  formatLargeNumber
} from './utils/transactionUtils';

export type { DashboardStats, Pool, MixTransaction, DashboardTab } from './types/dashboard.types';