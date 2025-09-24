// src/hooks/useTonConnect.ts
import { useState, useEffect, useMemo } from 'react';
import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import { type Sender, Address } from '@ton/core';
import { TonClient4 } from '@ton/ton';

interface WalletState {
  address: string | null;
  wallet: any;
  connected: boolean;
  balance: string;
  isLoading: boolean;
  network: 'mainnet' | 'testnet';
}

export const useTonConnect = () => {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  const [state, setState] = useState<WalletState>({
    address: null,
    wallet: null,
    connected: false,
    balance: '0',
    isLoading: false,
    network: 'testnet',
  });

  // Создаем TonClient4 для работы с сетью
  const tonClient = useMemo(() => {
    const endpoint = state.network === 'mainnet' 
      ? 'https://mainnet-v4.tonhubapi.com'
      : 'https://testnet-v4.tonhubapi.com';
    return new TonClient4({ endpoint });
  }, [state.network]);

  // Создаем Sender для отправки транзакций
  const sender: Sender = useMemo(() => {
    return {
      send: async (args) => {
        if (!tonConnectUI.connected || !wallet) {
          throw new Error('Wallet not connected');
        }

        try {
          await tonConnectUI.sendTransaction({
            messages: [{
              address: args.to.toString(),
              amount: args.value.toString(),
              payload: args.body?.toBoc().toString('base64'),
            }],
            validUntil: Date.now() + 5 * 60 * 1000, // 5 минут для подтверждения
          });
        } catch (error) {
          console.error('Transaction error:', error);
          throw error;
        }
      }
    };
  }, [tonConnectUI, wallet]);

  // Функция для получения баланса через TonClient4
  const fetchBalance = async (address: string) => {
    try {
      const addr = Address.parse(address);
      const lastBlock = await tonClient.getLastBlock();
      const account = await tonClient.getAccount(lastBlock.last.seqno, addr);
      
      // Конвертируем из nanoTON в TON
      return (Number(account.account.balance.coins) / 1e9).toFixed(2);
    } catch (error) {
      console.error('Error fetching balance:', error);
      return '0';
    }
  };

  // Определение сети
  const determineNetwork = (wallet: any): 'mainnet' | 'testnet' => {
    if (!wallet?.account?.chain) return 'testnet';
    // В 2025 году chain может быть представлена как -239 для mainnet и -3 для testnet
    return wallet.account.chain === -239 ? 'mainnet' : 'testnet';
  };

  // Инициализация и отслеживание изменений
  useEffect(() => {
    if (!tonConnectUI) return;

    // Подписка на изменения состояния
    const unsubscribe = tonConnectUI.onStatusChange(async (wallet) => {
      console.log('TonConnect status changed:', wallet);
      
      if (wallet) {
        const network = determineNetwork(wallet);
        const balance = await fetchBalance(wallet.account.address);
        setState({
          address: wallet.account.address,
          wallet,
          connected: true,
          balance,
          isLoading: false,
          network,
        });
      } else {
        setState({
          address: null,
          wallet: null,
          connected: false,
          balance: '0',
          isLoading: false,
          network: 'testnet',
        });
      }
    });

    // Инициализация текущего состояния
    const initializeWallet = async () => {
      const currentWallet = tonConnectUI.wallet;
      if (currentWallet) {
        const network = determineNetwork(currentWallet);
        const balance = await fetchBalance(currentWallet.account.address);
        setState({
          address: currentWallet.account.address,
          wallet: currentWallet,
          connected: true,
          balance,
          isLoading: false,
          network,
        });
      }
    };

    initializeWallet();

    // Очистка при размонтировании
    return () => {
      unsubscribe();
    };
  }, [tonConnectUI, tonClient]);

  // Подключение кошелька
  const connectWallet = async () => {
    if (!tonConnectUI) return;
    
    try {
      console.log('Connecting wallet...');
      setState(prev => ({ ...prev, isLoading: true }));
      await tonConnectUI.connectWallet();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  // Отключение кошелька
  const disconnectWallet = async () => {
    if (!tonConnectUI) return;
    
    try {
      console.log('Disconnecting wallet...');
      setState(prev => ({ ...prev, isLoading: true }));
      await tonConnectUI.disconnect();
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  // Ручное обновление баланса
  const refreshBalance = async () => {
    if (state.address) {
      setState(prev => ({ ...prev, isLoading: true }));
      try {
        const balance = await fetchBalance(state.address);
        setState(prev => ({ 
          ...prev, 
          balance, 
          isLoading: false 
        }));
      } catch (error) {
        console.error('Error refreshing balance:', error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    }
  };

  return {
    ...state,
    sender,
    tonClient,
    connectWallet,
    disconnectWallet,
    refreshBalance,
  };
};

export default useTonConnect;