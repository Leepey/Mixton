// features/shared/utils/index.ts

// Format utils
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
} from './formatUtils';

// Safe utils
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
} from './safeUtils';