// features/shared/components/ui/SystemStatusChip.tsx
import React from 'react';
import { StatusChip } from './StatusChip';
import type { SystemStatus } from '../../types/status.types';
import { getSystemStatusColor, getSystemStatusIcon } from '../../utils/statusUtils';

interface SystemStatusChipProps {
  status: SystemStatus;
  label?: string;
  size?: 'small' | 'medium';
  onClick?: () => void;
}

/**
 * Компонент для отображения статуса системы
 */
export const SystemStatusChip: React.FC<SystemStatusChipProps> = ({ 
  status, 
  label, 
  size,
  onClick
}) => {
  const color = getSystemStatusColor(status);
  const icon = getSystemStatusIcon(status);
  
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