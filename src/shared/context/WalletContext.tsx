import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction } from '../types/contract';

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  balance: number;
  transactions: Transaction[];
  connect: () => Promise<void>;
  disconnect: () => void;
  refreshBalance: () => Promise<void>;
  sendTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp' | 'status'>) => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const connect = async () => {
    try {
      // Здесь должна быть логика подключения кошелька
      const mockAddress = 'EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N';
      setAddress(mockAddress);
      setIsConnected(true);
      await refreshBalance();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  };

  const disconnect = () => {
    setAddress(null);
    setIsConnected(false);
    setBalance(0);
    setTransactions([]);
  };

  const refreshBalance = async () => {
    if (!address) return;
    
    try {
      // Здесь должна быть логика получения баланса
      const mockBalance = 100.5;
      setBalance(mockBalance);
    } catch (error) {
      console.error('Failed to refresh balance:', error);
    }
  };

  const sendTransaction = async (transaction: Omit<Transaction, 'id' | 'timestamp' | 'status'>) => {
    try {
      // Здесь должна быть логика отправки транзакции
      const newTransaction: Transaction = {
        ...transaction,
        id: Date.now().toString(),
        timestamp: new Date(),
        status: 'pending',
      };
      setTransactions(prev => [newTransaction, ...prev]);
    } catch (error) {
      console.error('Failed to send transaction:', error);
      throw error;
    }
  };

  return (
    <WalletContext.Provider value={{
      isConnected,
      address,
      balance,
      transactions,
      connect,
      disconnect,
      refreshBalance,
      sendTransaction,
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWalletContext must be used within a WalletProvider');
  }
  return context;
};