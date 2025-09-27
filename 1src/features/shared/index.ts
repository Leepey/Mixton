// features/shared/index.ts

// Components
export { ErrorBoundary } from './components/ErrorBoundary';
export { ErrorBoundaryWrapper } from './components/ErrorBoundaryWrapper';
export { ErrorTest } from './components/ErrorTest';
export { ProviderTester } from './components/ProviderTester';
export { TonConnectErrorBoundary } from './components/TonConnectErrorBoundary';
export { TonConnectProvider } from './components/TonConnectProvider';

// UI Components
export { 
  NeonCard, 
  MixPoolCard, 
  PoolCard,
  MixButton, 
  TonConnectButton,
  TransactionLoader,
  LoadingSpinner,
  ConfirmationModal,
  NeonText,
  Footer,
  MainLayout,
  Navbar
} from './components/ui';

export * from './context/MixerContext';

// Hooks
export { useLocalStorage } from './hooks/useLocalStorage';
export { useTonConnect } from './hooks/useTonConnect';
export { useErrorHandler } from './hooks/useErrorHandler';

// Services
export { MixerContractService } from './services/contract/MixerContractService';
export { StorageService } from './services/storageService';
export { TonApiService } from './services/tonApiService';
export { TonService } from './services/tonService';

// Types
export type { ErrorPageProps } from './types/common.types';
export type { TonConnectConfig } from './types/ton';

// Utils
export {
  formatAmount,
  formatTimeAgo,
  formatAddress,
  formatDate,
  formatTime,
  formatDateTime,
  formatNumber,
  formatPercent,
  formatFileSize,
  formatDuration,
  formatHash,
  formatBlockNumber,
  formatTransactionStatus,
  formatPoolName,
  formatFee,
  formatBalance,
  formatDelay
} from './utils/formatUtils';

export {
  safeCopyToClipboard,
  safeOpenUrl,
  safeString,
  safeNumber,
  safeBoolean,
  safeArrayAccess,
  safeCall,
  safeJsonParse,
  safeToString,
  isEmpty
} from './utils/safeUtils';

// Constants
export { CONTRACT_CONSTANTS } from './constants/contractConstants';