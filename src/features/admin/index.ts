// src/features/admin/index.ts
// Components
export { AdminPanelLayout } from './components/AdminPanelLayout';
export { UserManagement } from './components/UserManagement';
export { ContractSettingsComponent } from './components/ContractSettingsComponent';
export { SecuritySettingsComponent } from './components/SecuritySettingsComponent';
export { AnalyticsPanel } from './components/AnalyticsPanel';

// Hooks
export { useAdminAuth } from './hooks/useAdminAuth';
export { useContractManagement } from './hooks/useContractManagement';
export { useUserManagement } from './hooks/useUserManagement';

// Services
export { adminService } from './services/adminService';
export { securityService } from './services/securityService';

// Types
export type { AdminUser, ContractSettings, SecuritySettings, AnalyticsData } from './types/admin.types';

// Utils
export { 
  validateAdminAddress, 
  formatAddress, 
  calculatePoolUtilization,
  validateContractSettings,
  generateUserReport
} from './utils/adminUtils';