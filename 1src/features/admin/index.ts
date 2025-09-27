// src/features/admin/index.ts
export { AdminService } from './services/adminService';
export { SecurityService } from './services/securityService';
export { useAdminAuth } from './hooks/useAdminAuth';
export { useContractManagement } from './hooks/useContractManagement';
export { useUserManagement } from './hooks/useUserManagement';
export { useAdminTabs } from './hooks/useAdminTabs';

// Компоненты
export { AdminPanelLayout } from './components/AdminPanelLayout';
export { AnalyticsPanel } from './components/AnalyticsPanel';
export { ContractSettingsComponent } from './components/ContractSettingsComponent';
export { SecuritySettingsComponent } from './components/SecuritySettingsComponent';
export { UserManagement } from './components/UserManagement';
export { TransactionTable } from './components/TransactionTable';
export { AdminTransactionDetails } from './components/AdminTransactionDetails';

// Утилиты - исправлено дублирование getAdminTabs
export { 
  formatAdminAddress, 
  getTransactionStatusColor 
} from './utils/adminUtils';

export {
  getAdminTabs,
  getTabValueById,
  getTabIdByValue,
  isValidTabValue,
  getTabIcon,
  getTabDescription,
  getAllTabValues,
  getNextTab,
  getPreviousTab
} from './utils/adminTabsUtils';

// Типы
export type {
  AdminSettings,
  PoolInfo,
  FeeRates,
  Limits,
  Delays,
  Stats,
  Transaction,
  AdminTabValue,
  AdminTab,
  AdminStats
} from './types/admin.types';