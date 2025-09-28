// src/features/mixer/hooks/useTransaction.ts
import { useState } from 'react';

export const useTransaction = () => {
  const [transaction, setTransaction] = useState(null);
  
  const createTransaction = () => {
    // Логика создания транзакции будет здесь
  };
  
  return {
    transaction,
    createTransaction
  };
};