// features/auth/services/authService.ts
import type { AuthUser, AuthResponse, LoginCredentials, RegisterCredentials, UserByAddressResponse } from '../types/auth.types';

/**
 * Сервис аутентификации
 */
export class AuthService {
  private static readonly BASE_URL = import.meta.env.VITE_API_URL || '/api';

  /**
   * Вход пользователя
   */
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data: AuthResponse = await response.json();
      
      // Сохраняем токены
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('refresh_token', data.refreshToken);
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Регистрация пользователя
   */
  static async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      const data: AuthResponse = await response.json();
      
      // Сохраняем токены
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('refresh_token', data.refreshToken);
      
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Выход пользователя
   */
  static async logout(): Promise<void> {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (token) {
        await fetch(`${this.BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Очищаем локальные данные
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
    }
  }

  /**
   * Получение пользователя по адресу кошелька
   */
  static async getUserByAddress(address: string): Promise<UserByAddressResponse> {
    try {
      const response = await fetch(`${this.BASE_URL}/users/address/${address}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          // Пользователь не найден - возвращаем базовые данные
          return {
            address,
            roles: ['user'],
            permissions: ['read:dashboard', 'write:dashboard', 'read:transactions', 'write:transactions'],
            isAdmin: false
          };
        }
        throw new Error('Failed to fetch user data');
      }

      return await response.json();
    } catch (error) {
      console.error('Get user by address error:', error);
      throw error;
    }
  }

  /**
   * Создание пользователя по адресу кошелька
   */
  static async createUserByAddress(address: string): Promise<UserByAddressResponse> {
    try {
      const response = await fetch(`${this.BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address,
          roles: ['user'],
          permissions: ['read:dashboard', 'write:dashboard', 'read:transactions', 'write:transactions'],
          isAdmin: false
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      return await response.json();
    } catch (error) {
      console.error('Create user by address error:', error);
      throw error;
    }
  }

  /**
   * Обновление пользователя по адресу кошелька
   */
  static async updateUserByAddress(address: string, userData: Partial<UserByAddressResponse>): Promise<UserByAddressResponse> {
    try {
      const response = await fetch(`${this.BASE_URL}/users/address/${address}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      return await response.json();
    } catch (error) {
      console.error('Update user by address error:', error);
      throw error;
    }
  }

  /**
   * Обновление токена
   */
  static async refreshToken(): Promise<AuthResponse> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${this.BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data: AuthResponse = await response.json();
      
      // Обновляем токены
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('refresh_token', data.refreshToken);
      
      return data;
    } catch (error) {
      console.error('Refresh token error:', error);
      // Очищаем токены при ошибке
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      throw error;
    }
  }

  /**
   * Проверка валидности токена
   */
  static async validateToken(): Promise<boolean> {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        return false;
      }

      const response = await fetch(`${this.BASE_URL}/auth/validate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Validate token error:', error);
      return false;
    }
  }

  /**
   * Получение текущего пользователя
   */
  static async getCurrentUser(): Promise<AuthUser> {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw new Error('No token available');
      }

      const response = await fetch(`${this.BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get current user');
      }

      return await response.json();
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }
}