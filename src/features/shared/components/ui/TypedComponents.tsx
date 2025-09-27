// features/shared/components/ui/TypedComponents.tsx
import React, { type ReactElement } from 'react';
import { Chip, type ChipProps } from '@mui/material';

/**
 * Типизированная версия Chip компонента
 */
export const TypedChip: React.FC<ChipProps> = (props): ReactElement => {
  return <Chip {...props} />;
};