// features/auth/components/AuthProvider.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTonConnect } from '../../shared/hooks/useTonConnect';
import { AuthService } from '../services/authService';
import { WalletAuthService } from '../services/walletAuthService';
import type { AuthUser } from '../types/auth.types';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  login: (credentials?: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { address, connected } = useTonConnect();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Проверка прав администратора
  const adminAddress = import.meta.env.VITE_ADMIN_ADDRESS;
  const isAdmin = user && address && adminAddress && 
    address.toLowerCase() === adminAddress.toLowerCase();

  // Инициализация пользователя при подключении кошелька
  useEffect(() => {
    const initializeUser = async () => {
      if (connected && address) {
        try {
          setLoading(true);
          setError(null);
          
          // Проверяем, существует ли пользователь в системе
          let authUser = await AuthService.getUserByAddress(address);
          
          if (!authUser) {
            // Если пользователя нет, создаем нового
            authUser = await AuthService.createUser({
              address,
              connected: true,
              balance: '0', // Баланс будет обновлен отдельно
              isAdmin: false
            });
          }
          
          // Обновляем баланс кошелька
          const walletBalance = await WalletAuthService.getBalance(address);
          
          setUser({
            ...authUser,
            connected: true,
            balance: walletBalance,
            lastLogin: new Date().toISOString()
          });
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to initialize user');
          console.error('Error initializing user:', err);
        } finally {
          setLoading(false);
        }
      } else {
        // При отключении кошелька
        setUser(null);
      }
    };

    initializeUser();
  }, [connected, address]);

  // Обновление баланса пользователя
  useEffect(() => {
    const updateBalance = async () => {
      if (connected && address && user) {
        try {
          const walletBalance = await WalletAuthService.getBalance(address);
          setUser(prev => prev ? { ...prev, balance: walletBalance } : null);
        } catch (err) {
          console.error('Error updating balance:', err);
        }
      }
    };

    // Обновляем баланс каждые 30 секунд
    const interval = setInterval(updateBalance, 30000);
    return () => clearInterval(interval);
  }, [connected, address, user]);

  const login = async (credentials?: any) => {
    setLoading(true);
    setError(null);
    
    try {
      if (!connected || !address) {
        throw new Error('Wallet not connected');
      }

      let authUser = await AuthService.getUserByAddress(address);
      
      if (!authUser) {
        authUser = await AuthService.createUser({
          address,
          connected: true,
          balance: '0',
          isAdmin: false
        });
      }

      // Обновляем данные пользователя
      const walletBalance = await WalletAuthService.getBalance(address);
      
      setUser({
        ...authUser,
        connected: true,
        balance: walletBalance,
        lastLogin: new Date().toISOString()
      });

      // Записываем в лог авторизации
      await AuthService.logAuthActivity({
        userId: authUser.id,
        address,
        action: 'login',
        timestamp: new Date().toISOString()
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (user) {
        // Записываем в лог авторизации
        await AuthService.logAuthActivity({
          userId: user.id,
          address: user.address,
          action: 'logout',
          timestamp: new Date().toISOString()
        });
      }
      
      setUser(null);
      
      // Отключаем кошелек, если нужно
      if (connected) {
        // Здесь можно добавить логику отключения кошелька через TonConnect
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed');
      console.error('Error during logout:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    if (!connected || !address || !user) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Обновляем данные пользователя
      const walletBalance = await WalletAuthService.getBalance(address);
      
      setUser(prev => prev ? {
        ...prev,
        balance: walletBalance,
        lastActivity: new Date().toISOString()
      } : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh user');
      console.error('Error refreshing user:', err);
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    logout,
    refreshUser,
    isAuthenticated: !!user,
    isAdmin: !!isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};