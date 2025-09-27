// src/features/auth/services/walletAuthService.ts
import { Address, beginCell, Cell, toNano } from '@ton/core';
import { TonConnect } from '@tonconnect/ui-react';
import { useTonConnect } from '../../shared/hooks/useTonConnect';

/**
 * Интерфейс для настроек кошелька
 */
export interface WalletConfig {
  network?: 'mainnet' | 'testnet';
  maxRetries?: number;
  timeout?: number;
}

/**
 * Интерфейс для информации о кошельке
 */
export interface WalletInfo {
  address: string;
  balance: string;
  network: 'mainnet' | 'testnet';
  isConnected: boolean;
  walletName?: string;
  walletVersion?: string;
}

/**
 * Интерфейс для результата транзакции
 */
export interface TransactionResult {
  success: boolean;
  txHash?: string;
  error?: string;
  blockNumber?: number;
}

/**
 * Интерфейс для параметров транзакции
 */
export interface TransactionParams {
  to: string;
  amount: number; // в TON
  message?: string;
  payload?: string;
  stateInit?: Cell;
}

/**
 * Сервис для работы с аутентификацией кошелька
 */
export class WalletAuthService {
  private static instance: WalletAuthService;
  private tonConnect: TonConnect | null = null;
  private config: WalletConfig;

  constructor(config: WalletConfig = {}) {
    this.config = {
      network: 'mainnet',
      maxRetries: 3,
      timeout: 30000,
      ...config
    };
  }

  /**
   * Получение экземпляра синглтона
   */
  public static getInstance(config?: WalletConfig): WalletAuthService {
    if (!WalletAuthService.instance) {
      WalletAuthService.instance = new WalletAuthService(config);
    }
    return WalletAuthService.instance;
  }

  /**
   * Инициализация TonConnect
   */
  public initialize(tonConnect: TonConnect): void {
    this.tonConnect = tonConnect;
  }

  /**
   * Подключение кошелька
   */
  public async connectWallet(): Promise<WalletInfo> {
    if (!this.tonConnect) {
      throw new Error('TonConnect not initialized');
    }

    try {
      await this.tonConnect.connectWallet();
      
      const wallet = this.tonConnect.wallet;
      const account = this.tonConnect.account;
      
      if (!wallet || !account) {
        throw new Error('Failed to get wallet information');
      }

      const walletInfo: WalletInfo = {
        address: account.address,
        balance: account.balance ? this.formatBalance(account.balance) : '0',
        network: account.chain === '-239' ? 'testnet' : 'mainnet',
        isConnected: true,
        walletName: wallet.name,
        walletVersion: wallet.version
      };

      return walletInfo;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw new Error(`Failed to connect wallet: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Отключение кошелька
   */
  public async disconnectWallet(): Promise<void> {
    if (!this.tonConnect) {
      return;
    }

    try {
      await this.tonConnect.disconnect();
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      throw new Error(`Failed to disconnect wallet: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Получение текущей информации о кошельке
   */
  public getCurrentWalletInfo(): WalletInfo | null {
    if (!this.tonConnect || !this.tonConnect.account) {
      return null;
    }

    const account = this.tonConnect.account;
    const wallet = this.tonConnect.wallet;

    return {
      address: account.address,
      balance: account.balance ? this.formatBalance(account.balance) : '0',
      network: account.chain === '-239' ? 'testnet' : 'mainnet',
      isConnected: true,
      walletName: wallet?.name,
      walletVersion: wallet?.version
    };
  }

  /**
   * Отправка транзакции
   */
  public async sendTransaction(params: TransactionParams): Promise<TransactionResult> {
    if (!this.tonConnect || !this.tonConnect.account) {
      throw new Error('Wallet not connected');
    }

    try {
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 600, // +10 минут
        messages: [
          {
            address: params.to,
            amount: toNano(params.amount),
            payload: params.payload ? this.createPayloadCell(params.payload) : undefined,
            stateInit: params.stateInit,
          }
        ]
      };

      const result = await this.tonConnect.sendTransaction(transaction);
      
      return {
        success: true,
        txHash: result,
        blockNumber: await this.getBlockNumber()
      };
    } catch (error) {
      console.error('Error sending transaction:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Проверка подключения кошелька
   */
  public isWalletConnected(): boolean {
    return this.tonConnect?.connected || false;
  }

  /**
   * Получение баланса кошелька
   */
  public async getWalletBalance(): Promise<string> {
    if (!this.tonConnect?.account?.address) {
      throw new Error('Wallet not connected');
    }

    try {
      // Здесь должна быть логика получения баланса через TON API
      // Временно возвращаем значение из TonConnect
      const balance = this.tonConnect.account.balance;
      return balance ? this.formatBalance(balance) : '0';
    } catch (error) {
      console.error('Error getting balance:', error);
      throw new Error(`Failed to get balance: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Валидация адреса
   */
  public validateAddress(address: string): boolean {
    try {
      Address.parse(address);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Форматирование адреса
   */
  public formatAddress(address: string, length: number = 6): string {
    if (!address) return '';
    return `${address.slice(0, length)}...${address.slice(-length)}`;
  }

  /**
   * Получение сети
   */
  public getNetwork(): 'mainnet' | 'testnet' {
    return this.config.network || 'mainnet';
  }

  /**
   * Создание payload ячейки
   */
  private createPayloadCell(payload: string): Cell {
    return beginCell().storeUint(0, 32).storeStringTail(payload).endCell();
  }

  /**
   * Форматирование баланса
   */
  private formatBalance(balance: string | number): string {
    const balanceInTon = typeof balance === 'string' 
      ? parseFloat(balance) / 1000000000 
      : balance / 1000000000;
    
    return balanceInTon.toFixed(6);
  }

  /**
   * Получение номера блока (заглушка)
   */
  private async getBlockNumber(): Promise<number> {
    // Здесь должна быть реальная логика получения номера блока
    return Math.floor(Date.now() / 1000);
  }

  /**
   * Ожидание подтверждения транзакции
   */
  public async waitForTransactionConfirmation(txHash: string, maxAttempts: number = 10): Promise<boolean> {
    if (!this.tonConnect) {
      throw new Error('TonConnect not initialized');
    }

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        // Здесь должна быть логика проверки статуса транзакции
        // Временно имитируем ожидание
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Заглушка - в реальном приложении здесь должна быть проверка через TON API
        console.log(`Checking transaction ${txHash}, attempt ${attempt + 1}/${maxAttempts}`);
        
        // Предполагаем, что транзакция подтверждена
        return true;
      } catch (error) {
        console.warn(`Attempt ${attempt + 1} failed:`, error);
        
        if (attempt === maxAttempts - 1) {
          throw new Error(`Transaction confirmation failed after ${maxAttempts} attempts`);
        }
      }
    }

    return false;
  }

  /**
   * Получение информации о транзакции
   */
  public async getTransactionInfo(txHash: string): Promise<any> {
    // Здесь должна быть логика получения информации о транзакции через TON API
    // Возвращаем заглушку
    return {
      hash: txHash,
      lt: Math.floor(Math.random() * 1000000),
      now: Math.floor(Date.now() / 1000),
      out_msgs: [],
      description: 'Transaction description'
    };
  }

  /**
   * Проверка прав доступа
   */
  public async checkPermissions(): Promise<boolean> {
    if (!this.tonConnect) {
      return false;
    }

    try {
      // Проверка базовых разрешений
      const permissions = await this.tonConnect.getWallets();
      return permissions.length > 0;
    } catch (error) {
      console.error('Error checking permissions:', error);
      return false;
    }
  }

  /**
   * Получение списка поддерживаемых кошельков
   */
  public async getAvailableWallets(): Promise<any[]> {
    if (!this.tonConnect) {
      return [];
    }

    try {
      return await this.tonConnect.getWallets();
    } catch (error) {
      console.error('Error getting available wallets:', error);
      return [];
    }
  }

  /**
   * Подпись сообщения
   */
  public async signMessage(message: string): Promise<string> {
    if (!this.tonConnect) {
      throw new Error('TonConnect not initialized');
    }

    try {
      const result = await this.tonConnect.signMessage({
        payload: message
      });

      return result.signature;
    } catch (error) {
      console.error('Error signing message:', error);
      throw new Error(`Failed to sign message: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Проверка подписи
   */
  public async verifySignature(message: string, signature: string, address: string): Promise<boolean> {
    // Здесь должна быть логика проверки подписи
    // Возвращаем заглушку
    console.log('Verifying signature for message:', message);
    console.log('Signature:', signature);
    console.log('Address:', address);
    
    return true;
  }

  /**
   * Сброс состояния
   */
  public reset(): void {
    this.tonConnect = null;
  }

  /**
   * Обновление конфигурации
   */
  public updateConfig(config: Partial<WalletConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Получение текущей конфигурации
   */
  public getConfig(): WalletConfig {
    return { ...this.config };
  }
}