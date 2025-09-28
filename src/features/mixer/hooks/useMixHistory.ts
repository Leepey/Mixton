// src/features/mixer/hooks/useMixHistory.ts
import { useState } from 'react';

export const useMixHistory = () => {
  const [history, setHistory] = useState([]);
  
  const fetchHistory = () => {
    // Логика получения истории будет здесь
  };
  
  return {
    history,
    fetchHistory
  };
};