// features/shared/components/ui/StatusChip.tsx
import React from 'react';
import { Chip, type ChipProps } from '@mui/material';
import type { AppStatus } from '../../types/status.types';

interface StatusChipProps {
  status: AppStatus;
  label?: string;
  size?: 'small' | 'medium';
  icon?: React.ReactNode;
  sx?: ChipProps['sx'];
  onClick?: () => void;
}

/**
 * Переиспользуемый компонент для отображения статуса
 */
export const StatusChip: React.FC<StatusChipProps> = ({ 
  status, 
  label, 
  size = 'small',
  icon,
  sx,
  onClick
}) => {
  return (
    <Chip
      label={label || formatStatusLabel(status)}
      color={status}
      size={size}
      icon={icon}
      sx={sx}
      onClick={onClick}
    />
  );
};