// src/features/mixer/hooks/usePoolSelection.ts
import { useState } from 'react';

export const usePoolSelection = () => {
  const [selectedPool, setSelectedPool] = useState<string>('standard');
  
  return {
    selectedPool,
    selectPool: setSelectedPool,
    // Логика выбора пула
  };
};