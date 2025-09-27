// src/services/mixerService.ts
import type { MixTransaction, MixPool, MixerServiceResponse } from '../types/mixer';
import { MixerContractService } from '../../shared/services/contract/MixerContractService';
import type { PoolType, PoolFeeRates, ContractLimits, PoolDelays, BasicStats } from '../../shared/types/ton';
import { Address, toNano, fromNano } from '@ton/core';

// Создаем экземпляр сервиса для работы с контрактом
const contractService = new MixerContractService('testnet');

// Получение информации о пулах из контракта
export const getPoolsInfo = async (): Promise<{
  feeRates: PoolFeeRates;
  limits: ContractLimits;
  delays: PoolDelays;
}> => {
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
  if (!contractAddress) {
    throw new Error('Contract address not configured');
  }
  
  const address = Address.parse(contractAddress);
  
  // Получаем информацию о пулах из контракта
  const [feeRates, limits, delays] = await Promise.all([
    contractService.getFeeRates(address),
    contractService.getLimits(address),
    contractService.getDelays(address)
  ]);
  
  return { feeRates, limits, delays };
};

// Получение доступных пулов на основе данных из контракта
export const getAvailablePools = async (): Promise<MixPool[]> => {
  try {
    const { feeRates, limits, delays } = await getPoolsInfo();
    
    // Формируем пулы на основе данных из контракта
    const pools: MixPool[] = [
      {
        id: 'basic',
        name: 'Basic Pool',
        minAmount: Number(fromNano(limits.minDeposit)),
        maxAmount: 100,
        fee: feeRates.basicRate / 100, // Преобразуем из процентов в долю
        minDelayHours: delays.basicDelay / 3600, // Преобразуем секунды в часы
        isActive: true,
        participants: 0,
        volume: 0,
        description: 'Fast mixing with 12-hour delay'
      },
      {
        id: 'standard',
        name: 'Standard Pool',
        minAmount: 100,
        maxAmount: 1000,
        fee: feeRates.standardRate / 100,
        minDelayHours: delays.standardDelay / 3600,
        isActive: true,
        participants: 0,
        volume: 0,
        description: 'Lower fee with 24-hour delay'
      },
      {
        id: 'premium',
        name: 'Premium Pool',
        minAmount: 1000,
        maxAmount: Number(fromNano(limits.maxDeposit)),
        fee: feeRates.premiumRate / 100,
        minDelayHours: delays.premiumDelay / 3600,
        isActive: true,
        participants: 0,
        volume: 0,
        description: 'Best rate with 72-hour delay'
      }
    ];
    
    return pools;
  } catch (error) {
    console.error('Failed to get available pools:', error);
    throw error;
  }
};

// Получение информации о пуле
export const getPoolInfo = async (poolId: string): Promise<MixPool | null> => {
  try {
    const pools = await getAvailablePools();
    return pools.find(pool => pool.id === poolId) || null;
  } catch (error) {
    console.error('Failed to get pool info:', error);
    throw error;
  }
};

// Инициация микширования
export const initiateMixing = async (
  userAddress: string,
  amount: number,
  poolId: string,
  outputAddress?: string,
  note?: string
): Promise<MixerServiceResponse> => {
  try {
    const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
    if (!contractAddress) {
      throw new Error('Contract address not configured');
    }
    
    // Определяем тип пула
    let poolType: PoolType = 0; // Basic по умолчанию
    if (poolId === 'standard') poolType = 1;
    if (poolId === 'premium') poolType = 2;
    
    // Получаем информацию о пулах
    const { feeRates } = await getPoolsInfo();
    
    // Определяем комиссию на основе пула
    let fee = 0;
    if (poolType === 0) fee = feeRates.basicRate / 100;
    if (poolType === 1) fee = feeRates.standardRate / 100;
    if (poolType === 2) fee = feeRates.premiumRate / 100;
    
    // Создаем запись о транзакции
    const transaction: MixTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      poolId,
      amount,
      fee,
      status: 'pending',
      timestamp: Math.floor(Date.now() / 1000),
      inputAddress: userAddress,
      outputAddress: outputAddress || userAddress,
      note: note || ''
    };
    
    return {
      success: true,
      message: 'Mixing initiated successfully',
      data: {
        transaction,
        poolAddress: contractAddress,
        fee: toNano(amount * fee)
      }
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

// Получение статуса транзакции
export const getTransactionStatus = async (_txId: string): Promise<MixTransaction | null> => {
  // В реальном приложении здесь будет запрос к блокчейну для проверки статуса транзакции
  // Сейчас возвращаем null, так как это имитация
  // Параметр _txId будет использоваться в реальной реализации
  console.log(`Getting status for transaction: ${_txId}`);
  return null;
};

// Получение истории микширования для адреса
export const getMixHistory = async (_address: string): Promise<MixTransaction[]> => {
  // В реальном приложении здесь будет запрос к блокчейну для получения истории транзакций
  // Сейчас возвращаем пустой массив, так как это имитация
  // Параметр _address будет использоваться для фильтрации транзакций по адресу
  console.log(`Getting mix history for address: ${_address}`);
  return [];
};

// Обновление статуса транзакции
export const updateTransactionStatus = async (
  _txId: string,
  _status: MixTransaction['status']
): Promise<boolean> => {
  // В реальном приложении здесь будет обновление статуса транзакции в блокчейне
  // Сейчас возвращаем true, так как это имитация
  // Параметры _txId и _status будут использоваться в реальной реализации
  console.log(`Updating transaction ${_txId} status to: ${_status}`);
  return true;
};

// Расчет комиссии
export const calculateFee = (amount: number, poolId: string): bigint => {
  // В реальном приложении здесь будет расчет на основе данных из контракта
  // Сейчас используем фиксированные значения
  let feeRate = 0.03; // 3% по умолчанию
  if (poolId === 'standard') feeRate = 0.02;
  if (poolId === 'premium') feeRate = 0.01;
  
  return toNano(amount * feeRate);
};

// Получение статистики
export const getStats = async (): Promise<BasicStats> => {
  try {
    const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
    if (!contractAddress) {
      throw new Error('Contract address not configured');
    }
    
    const address = Address.parse(contractAddress);
    return await contractService.getBasicStats(address);
  } catch (error) {
    console.error('Failed to get stats:', error);
    throw error;
  }
};

// Получение статистики пулов
export const getPoolsStatistics = async () => {
  try {
    const stats = await getStats();
    return {
      totalPools: 3,
      activePools: 3,
      totalVolume: stats.totalDeposits,
      totalParticipants: stats.totalDeposits // Упрощенная статистика
    };
  } catch (error) {
    console.error('Failed to get pools statistics:', error);
    throw error;
  }
};

// Проверка доступности пула
export const isPoolAvailable = async (poolId: string): Promise<boolean> => {
  try {
    const pools = await getAvailablePools();
    const pool = pools.find(p => p.id === poolId);
    return pool ? pool.isActive : false;
  } catch (error) {
    console.error('Failed to check pool availability:', error);
    return false;
  }
};

// Получение рекомендованного пула для суммы
export const getRecommendedPool = async (amount: number): Promise<MixPool | null> => {
  try {
    const pools = await getAvailablePools();
    const suitablePools = pools.filter(
      p => p.isActive && amount >= p.minAmount && amount <= p.maxAmount
    );
    
    if (suitablePools.length === 0) {
      return null;
    }
    
    // Выбираем пул с самой низкой комиссией
    return suitablePools.reduce((prev, current) => 
      prev.fee < current.fee ? prev : current
    );
  } catch (error) {
    console.error('Failed to get recommended pool:', error);
    return null;
  }
};

export default {
  getPoolsInfo,
  getAvailablePools,
  getPoolInfo,
  initiateMixing,
  getTransactionStatus,
  getMixHistory,
  updateTransactionStatus,
  calculateFee,
  getStats,
  getPoolsStatistics,
  isPoolAvailable,
  getRecommendedPool
};