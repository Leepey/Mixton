// src copy/features/auth/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User, AuthState, LoginCredentials, AuthContextType } from '../types/auth.types';
import { authService } from '../services/authService';
import { loadAuthFromStorage } from '../utils/authUtils';

// Создаем контекст
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
    isAuthenticated: false,
  });

  // Инициализация аутентификации при загрузке
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setState(prev => ({ ...prev, loading: true }));
        const stored = loadAuthFromStorage();
        if (stored?.user) {
          // Проверяем актуальность данных
          const isValidUser = await authService.checkAuth();
          setState({
            user: isValidUser,
            loading: false,
            error: null,
            isAuthenticated: !!isValidUser,
          });
        } else {
          setState({
            user: null,
            loading: false,
            error: null,
            isAuthenticated: false,
          });
        }
      } catch (error) {
        setState({
          user: null,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to initialize auth',
          isAuthenticated: false,
        });
      }
    };
    initializeAuth();
  }, []);

  // Вход пользователя
  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const user = await authService.login(credentials);
      setState({
        user,
        loading: false,
        error: null,
        isAuthenticated: true,
      });
    } catch (error) {
      setState({
        user: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Login failed',
        isAuthenticated: false,
      });
    }
  }, []);

  // Выход пользователя
  const logout = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      await authService.logout();
      setState({
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Logout failed',
      }));
    }
  }, []);

  // Подключение кошелька
  const connectWallet = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      // В реальном приложении здесь будет подключение через TonConnect
      // и последующий вызов login
      console.log('Wallet connection would be handled here');
      setState(prev => ({
        ...prev,
        loading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to connect wallet',
      }));
    }
  }, []);

  // Отключение кошелька
  const disconnectWallet = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      await logout();
      setState(prev => ({
        ...prev,
        loading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to disconnect wallet',
      }));
    }
  }, [logout]);

  // Обновление баланса пользователя
  const updateUserBalance = useCallback(async (balance: number) => {
    if (!state.user) return;
    try {
      const updatedUser = await authService.updateBalance(state.user.address, balance);
      if (updatedUser) {
        setState(prev => ({
          ...prev,
          user: updatedUser,
        }));
      }
    } catch (error) {
      console.error('Failed to update user balance:', error);
    }
  }, [state.user]);

  // Очистка ошибок
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const value: AuthContextType = {
    user: state.user,
    loading: state.loading,
    error: state.error,
    isAuthenticated: state.isAuthenticated,
    login,
    logout,
    connectWallet,
    disconnectWallet,
    updateUserBalance,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;