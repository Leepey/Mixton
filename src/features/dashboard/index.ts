// features/dashboard/index.ts
export { DashboardService } from './services/dashboardService';
export { useDashboardStats } from './hooks/useDashboardStats';
export { usePoolsData } from './hooks/usePoolsData';
export { useTransactionHistory } from './hooks/useTransactionHistory';
export { useDashboardState } from './hooks/useDashboardState';
export { StatsModule } from './components/StatsModule';
export { PoolsModule } from './components/PoolsModule';
export { TransactionsModule } from './components/TransactionsModule';
export { SettingsModule } from './components/SettingsModule';
export { DashboardTabs } from './components/DashboardTabs';
export type { 
  DashboardStats, 
  Pool, 
  Transaction, 
  MixFormData, 
  DashboardTab 
} from './types/dashboard.types';