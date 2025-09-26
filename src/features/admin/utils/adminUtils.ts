// features/admin/utils/adminUtils.ts
import { AdminTab } from '../types/admin.types';
import { AccountBalance, Settings, Shuffle, Visibility } from '@mui/icons-material';

export const getAdminTabs = (): AdminTab[] => [
  { id: 0, name: 'Overview', icon: <AccountBalance /> },
  { id: 1, name: 'Settings', icon: <Settings /> },
  { id: 2, name: 'Pools', icon: <Shuffle /> },
  { id: 3, name: 'Transactions', icon: <Visibility /> }
];

export const formatAdminAddress = (address: string): string => {
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

export const getTransactionStatusColor = (status: string): string => {
  switch (status) {
    case 'completed':
      return 'success';
    case 'pending':
      return 'warning';
    case 'failed':
      return 'error';
    default:
      return 'default';
  }
};