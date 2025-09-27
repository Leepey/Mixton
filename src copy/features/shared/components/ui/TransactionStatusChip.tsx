// features/shared/components/ui/TransactionStatusChip.tsx
import React from 'react';
import { StatusChip } from './StatusChip';
import type { TransactionStatus } from '../../types/status.types';
import { getTransactionStatusColor, getTransactionStatusIcon } from '../../utils/statusUtils';

interface TransactionStatusChipProps {
  status: TransactionStatus;
  label?: string;
  size?: 'small' | 'medium';
  onClick?: () => void;
}

/**
 * Компонент для отображения статуса транзакции
 */
export const TransactionStatusChip: React.FC<TransactionStatusChipProps> = ({ 
  status, 
  label, 
  size,
  onClick
}) => {
  const color = getTransactionStatusColor(status);
  const icon = getTransactionStatusIcon(status);
  
  return (
    <StatusChip
      status={color}
      label={label}
      size={size}
      icon={icon}
      onClick={onClick}
    />
  );
};