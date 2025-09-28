import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/app';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { address: string; signature: string }) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('mixton_token');
    if (token) {
      // Здесь должна быть проверка токена и загрузка пользователя
      // setUser(mockUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: { address: string; signature: string }) => {
    setIsLoading(true);
    try {
      // Здесь должна быть логика аутентификации
      const mockUser: User = {
        id: '1',
        address: credentials.address,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setUser(mockUser);
      localStorage.setItem('mixton_token', 'mock_token');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mixton_token');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData, updatedAt: new Date() });
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};