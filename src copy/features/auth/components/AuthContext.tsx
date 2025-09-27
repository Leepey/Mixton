// features/auth/services/walletAuthService.ts

/**
 * Сервис для работы с аутентификацией через кошелек
 */
export class WalletAuthService {
  /**
   * Подключение кошелька
   */
  static async connectWallet(address: string): Promise<void> {
    try {
      console.log('Connecting wallet:', address);
      
      // В реальном приложении здесь может быть запрос к API для регистрации/верификации кошелька
      const response = await fetch('/api/auth/wallet/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }),
      });

      if (!response.ok) {
        throw new Error('Failed to connect wallet');
      }

      const data = await response.json();
      console.log('Wallet connected successfully:', data);
    } catch (error) {
      console.error('Wallet connection error:', error);
      throw error;
    }
  }

  /**
   * Отключение кошелька
   */
  static async disconnectWallet(): Promise<void> {
    try {
      console.log('Disconnecting wallet');
      
      // Очистка данных на сервере
      await fetch('/api/auth/wallet/disconnect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Wallet disconnected successfully');
    } catch (error) {
      console.error('Wallet disconnection error:', error);
      // Не выбрасываем ошибку, так как это не критично
    }
  }

  /**
   * Проверка прав доступа для кошелька
   */
  static async checkWalletPermissions(address: string): Promise<{
    canAccess: boolean;
    roles: string[];
    permissions: string[];
  }> {
    try {
      const response = await fetch(`/api/auth/wallet/permissions/${address}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return {
          canAccess: false,
          roles: [],
          permissions: []
        };
      }

      return await response.json();
    } catch (error) {
      console.error('Check wallet permissions error:', error);
      return {
        canAccess: false,
        roles: [],
        permissions: []
      };
    }
  }

  /**
   * Верификация подписи сообщения
   */
  static async verifySignature(address: string, signature: string, message: string): Promise<boolean> {
    try {
      const response = await fetch('/api/auth/wallet/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address,
          signature,
          message
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Signature verification error:', error);
      return false;
    }
  }
}