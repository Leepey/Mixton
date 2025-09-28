// src/features/mixer/hooks/useMixing.ts
import { useState } from 'react';

export const useMixing = () => {
  const [isMixing, setIsMixing] = useState(false);
  
  const startMixing = () => {
    setIsMixing(true);
    // Логика микширования будет здесь
  };
  
  const stopMixing = () => {
    setIsMixing(false);
    // Логика остановки микширования будет здесь
  };
  
  return {
    isMixing,
    startMixing,
    stopMixing
  };
};