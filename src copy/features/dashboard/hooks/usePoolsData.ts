// src/features/dashboard/hooks/usePoolsData.ts
import { useMixerContext } from '../../../context/MixerContext';
import type { Pool } from '../types/dashboard.types';

export const usePoolsData = (): Pool[] => {
  const { availablePools } = useMixerContext();
  return availablePools;
};