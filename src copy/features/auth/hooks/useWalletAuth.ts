import { useState, useCallback } from 'react';
import { WalletConnection } from '../types/auth.types';
import { walletAuthService } from '../services/walletAuthService';
import { useAuth } from './useAuth';

export const useWalletAuth = () => {
  const { login, updateUserBalance, user } = useAuth();
  const [wallet, setWallet] = useState<WalletConnection | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Подключение кошелька
  const connect = useCallback(async () => {
    try {
      setConnecting(true);
      setError(null);
      
      const walletConnection = await walletAuthService.connectWallet();
      setWallet(walletConnection);
      
      // Получаем информацию о кошельке
      const walletInfo = await walletAuthService.getWalletInfo(walletConnection.address);
      
      // Обновляем баланс пользователя
      updateUserBalance(walletInfo.balance);
      
      // Выполняем вход
      await login({
        address: walletConnection.address,
      });
      
      return walletConnection;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect wallet';
      setError(errorMessage);
      throw error;
    } finally {
      setConnecting(false);
    }
  }, [login, updateUserBalance]);

  // Отключение кошелька
  const disconnect = useCallback(async () => {
    try {
      setDisconnecting(true);
      setError(null);
      
      if (wallet) {
        await walletAuthService.disconnectWallet();
      }
      
      setWallet(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to disconnect wallet';
      setError(errorMessage);
      throw error;
    } finally {
      setDisconnecting(false);
    }
  }, [wallet]);

  // Подпись сообщения
  const signMessage = useCallback(async (message: string): Promise<string> => {
    if (!wallet) {
      throw new Error('Wallet not connected');
    }
    
    try {
      const signature = await walletAuthService.signMessage(message);
      return signature;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign message';
      setError(errorMessage);
      throw error;
    }
  }, [wallet]);

  // Проверка подписи
  const verifySignature = useCallback(async (
    address: string, 
    message: string, 
    signature: string
  ): Promise<boolean> => {
    try {
      const isValid = await walletAuthService.verifySignature(address, message, signature);
      return isValid;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to verify signature';
      setError(errorMessage);
      throw error;
    }
  }, []);

  // Обновление информации о кошельке
  const refreshWalletInfo = useCallback(async () => {
    if (!wallet) return;
    
    try {
      const walletInfo = await walletAuthService.getWalletInfo(wallet.address);
      updateUserBalance(walletInfo.balance);
      return walletInfo;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to refresh wallet info';
      setError(errorMessage);
      throw error;
    }
  }, [wallet, updateUserBalance]);

  // Очистка ошибок
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    wallet,
    connecting,
    disconnecting,
    error,
    connected: !!wallet,
    connect,
    disconnect,
    signMessage,
    verifySignature,
    refreshWalletInfo,
    clearError,
    // Дополнительная информация
    walletAddress: wallet?.address || null,
    walletType: wallet?.walletType || null,
    userBalance: user?.balance || 0,
  };
};