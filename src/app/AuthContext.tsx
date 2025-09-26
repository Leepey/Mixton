// src/app/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useTonConnect } from '../features/shared/hooks/useTonConnect';

interface User {
  id: string;
  connected: boolean;
  address?: string;
  balance?: string;
}

interface AuthContextType {
  user: User | null;
  login: (credentials?: any) => Promise<void>;
  logout: () => void;
  tonConnect: {
    connectWallet: () => void;
    disconnectWallet: () => void;
  } | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  tonConnect: null,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { connected, address, balance, connectWallet, disconnectWallet } = useTonConnect();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (connected && address) {
      setUser({
        id: address.toString(), // Используем адрес как ID
        connected: true,
        address: address.toString(),
        balance: balance ? balance.toString() : '0',
      });
    } else {
      setUser(null);
    }
  }, [connected, address, balance]);

  const login = async (credentials?: any) => {
    try {
      connectWallet();
      // Дополнительная логика аутентификации при необходимости
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    disconnectWallet();
    // Дополнительная логика выхода при необходимости
  };

  const value = {
    user,
    login,
    logout,
    tonConnect: {
      connectWallet,
      disconnectWallet,
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};