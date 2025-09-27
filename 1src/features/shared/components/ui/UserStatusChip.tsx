// features/shared/components/ui/UserStatusChip.tsx
import React from 'react';
import { StatusChip } from './StatusChip';
import type { UserStatus } from '../../types/status.types';
import { getUserStatusColor, getUserStatusIcon } from '../../utils/statusUtils';

interface UserStatusChipProps {
  status: UserStatus;
  label?: string;
  size?: 'small' | 'medium';
  onClick?: () => void;
}

/**
 * Компонент для отображения статуса пользователя
 */
export const UserStatusChip: React.FC<UserStatusChipProps> = ({ 
  status, 
  label, 
  size,
  onClick
}) => {
  const color = getUserStatusColor(status);
  const icon = getUserStatusIcon(status);
  
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