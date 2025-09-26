// src/features/auth/hooks/useWalletAuth.ts
import { useState, useEffect, useCallback } from 'react';
import { TonConnect } from '@tonconnect/ui-react';
import { WalletAuthService } from '../services/walletAuthService';
import { 
  WalletInfo, 
  TransactionParams, 
  TransactionResult, 
  WalletConfig,
  ConnectionStatus 
} from '../types/walletAuth.types';

interface UseWalletAuthReturn {
  walletInfo: WalletInfo | null;
  connectionStatus: ConnectionStatus;
  isLoading: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  sendTransaction: (params: TransactionParams) => Promise<TransactionResult>;
  refreshWalletInfo: () => Promise<void>;
  signMessage: (message: string) => Promise<string>;
  verifySignature: (message: string, signature: string, address: string) => Promise<boolean>;
  isWalletConnected: boolean;
  getAvailableWallets: () => Promise<any[]>;
}

/**
 * Хук для работы с аутентификацией кошелька
 */
export const useWalletAuth = (
  config?: WalletConfig,
  tonConnect?: TonConnect
): UseWalletAuthReturn => {
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const walletAuthService = WalletAuthService.getInstance(config);

  // Инициализация сервиса
  useEffect(() => {
    if (tonConnect) {
      walletAuthService.initialize(tonConnect);
    }
  }, [tonConnect, config]);

  // Обновление информации о кошельке при изменении подключения
  useEffect(() => {
    const updateWalletInfo = async () => {
      try {
        const info = walletAuthService.getCurrentWalletInfo();
        setWalletInfo(info);
        setConnectionStatus(info ? 'connected' : 'disconnected');
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to get wallet info');
        setConnectionStatus('error');
      }
    };

    updateWalletInfo();

    // Подписка на события TonConnect
    const handleStatusChange = (wallet: any) => {
      if (wallet) {
        updateWalletInfo();
      } else {
        setWalletInfo(null);
        setConnectionStatus('disconnected');
      }
    };

    if (tonConnect) {
      tonConnect.onStatusChange(handleStatusChange);
    }

    return () => {
      if (tonConnect) {
        tonConnect.offStatusChange(handleStatusChange);
      }
    };
  }, [tonConnect, walletAuthService]);

  // Подключение кошелька
  const connectWallet = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const info = await walletAuthService.connectWallet();
      setWalletInfo(info);
      setConnectionStatus('connected');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(errorMessage);
      setConnectionStatus('error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [walletAuthService]);

  // Отключение кошелька
  const disconnectWallet = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await walletAuthService.disconnectWallet();
      setWalletInfo(null);
      setConnectionStatus('disconnected');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to disconnect wallet';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [walletAuthService]);

  // Отправка транзакции
  const sendTransaction = useCallback(async (params: TransactionParams): Promise<TransactionResult> => {
    if (!walletAuthService.isWalletConnected()) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await walletAuthService.sendTransaction(params);
      
      if (!result.success) {
        throw new Error(result.error || 'Transaction failed');
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send transaction';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [walletAuthService]);

  // Обновление информации о кошельке
  const refreshWalletInfo = useCallback(async () => {
    if (!walletAuthService.isWalletConnected()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const balance = await walletAuthService.getWalletBalance();
      setWalletInfo(prev => prev ? { ...prev, balance } : null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh wallet info';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [walletAuthService]);

  // Подпись сообщения
  const signMessage = useCallback(async (message: string): Promise<string> => {
    if (!walletAuthService.isWalletConnected()) {
      throw new Error('Wallet not connected');
    }

    try {
      return await walletAuthService.signMessage(message);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign message';
      setError(errorMessage);
      throw err;
    }
  }, [walletAuthService]);

  // Проверка подписи
  const verifySignature = useCallback(async (
    message: string, 
    signature: string, 
    address: string
  ): Promise<boolean> => {
    try {
      return await walletAuthService.verifySignature(message, signature, address);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to verify signature';
      setError(errorMessage);
      return false;
    }
  }, [walletAuthService]);

  // Проверка подключения кошелька
  const isWalletConnected = walletAuthService.isWalletConnected();

  // Получение списка доступных кошельков
  const getAvailableWallets = useCallback(async () => {
    try {
      return await walletAuthService.getAvailableWallets();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get available wallets';
      setError(errorMessage);
      return [];
    }
  }, [walletAuthService]);

  return {
    walletInfo,
    connectionStatus,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    sendTransaction,
    refreshWalletInfo,
    signMessage,
    verifySignature,
    isWalletConnected,
    getAvailableWallets
  };
};