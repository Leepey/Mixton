// src/features/auth/hooks/useWalletAuth.ts
import { useTonConnect } from '@/features/shared/hooks/useTonConnect';

export const useWalletAuth = () => {
  const { connected, wallet } = useTonConnect();
  
  return {
    isConnected: connected,
    wallet,
    // Дополнительная логика аутентификации
  };
};