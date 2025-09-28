// src/features/mixer/hooks/usePools.ts
import { useState } from 'react';

export const usePools = () => {
  const [pools, setPools] = useState([]);
  
  const fetchPools = () => {
    // Логика получения пулов будет здесь
  };
  
  return {
    pools,
    fetchPools
  };
};