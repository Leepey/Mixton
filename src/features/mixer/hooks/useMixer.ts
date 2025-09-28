// src/hooks/useMixer.ts
import { useState, useCallback, useEffect } from 'react';
import { Address, fromNano, toNano } from '@ton/core';
import { useTonConnect } from '../../shared/hooks/useTonConnect';
import { MixerContractService } from '../../shared/services/contract/MixerContractService';
import { Mixton } from '../../shared/services/contract/wrappers/Mixton';
import type { 
  PoolType, 
  PoolFeeRates, 
  ContractLimits, 
  PoolDelays, 
  BasicStats,
  QueueStatus,
  QueueDetails
} from '../../shared/types/ton';
import { 
  saveMixHistory, 
  loadMixHistory, 
  savePendingTransactions, 
  loadPendingTransactions, 
  addTransactionToHistory,
  STORAGE_KEYS
} from '../../shared/services/storageService';
import type { MixTransaction, MixPool, PendingTransaction } from '../types/mixer';

export const useMixer = () => {
  const { connected, address, wallet, sender } = useTonConnect();
  const [isMixing, setIsMixing] = useState(false);
  const [mixHistory, setMixHistory] = useState<MixTransaction[]>([]);
  const [availablePools, setAvailablePools] = useState<MixPool[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [contractService] = useState(() => new MixerContractService('testnet'));
  const [contractBalance, setContractBalance] = useState<string>('0');
  const [pendingTransactions, setPendingTransactions] = useState<PendingTransaction[]>([]);
  const [feeRates, setFeeRates] = useState<PoolFeeRates | null>(null);
  const [limits, setLimits] = useState<ContractLimits | null>(null);
  const [delays, setDelays] = useState<PoolDelays | null>(null);
  const [stats, setStats] = useState<BasicStats | null>(null);
  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);
  const [queueDetails, setQueueDetails] = useState<QueueDetails | null>(null);
  
  // Загрузка баланса контракта
  const loadContractBalance = useCallback(async () => {
    try {
      const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
      if (!contractAddress) {
        throw new Error('Contract address not configured');
      }
      
      const balance = await contractService.getContractBalance(Address.parse(contractAddress));
      setContractBalance(balance);
    } catch (err) {
      console.error('Failed to load contract balance:', err);
    }
  }, [contractService]);
  
  // Загрузка информации о пулах из контракта
  const loadPoolsInfo = useCallback(async () => {
    try {
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
      
      setFeeRates(feeRates);
      setLimits(limits);
      setDelays(delays);
      
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
      
      setAvailablePools(pools);
    } catch (err) {
      console.error('Failed to load pools info:', err);
      setError('Failed to load pools info');
    }
  }, [contractService]);
  
  // Загрузка статистики
  const loadStats = useCallback(async () => {
    try {
      const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
      if (!contractAddress) {
        throw new Error('Contract address not configured');
      }
      
      const address = Address.parse(contractAddress);
      const stats = await contractService.getBasicStats(address);
      setStats(stats);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  }, [contractService]);
  
  // Загрузка информации об очереди
  const loadQueueInfo = useCallback(async () => {
    try {
      const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
      if (!contractAddress) {
        throw new Error('Contract address not configured');
      }
      
      const address = Address.parse(contractAddress);
      const [status, details] = await Promise.all([
        contractService.getQueueStatus(address),
        contractService.getQueueDetails(address)
      ]);
      
      setQueueStatus(status);
      setQueueDetails(details);
    } catch (err) {
      console.error('Failed to load queue info:', err);
    }
  }, [contractService]);
  
  // Проверка статуса транзакции
  const checkTransactionStatus = useCallback(async (txId: string) => {
    try {
      // В реальном приложении здесь будет запрос к блокчейну для проверки статуса
      // Сейчас просто обновляем статус в истории
      setMixHistory(prev => 
        prev.map(tx => 
          tx.id === txId 
            ? { ...tx, status: 'completed' } 
            : tx
        )
      );
      
      // Сохраняем обновленную историю
      saveMixHistory(mixHistory.map(tx => 
        tx.id === txId 
          ? { ...tx, status: 'completed' } 
          : tx
      ));
      
      return { status: 'completed' };
    } catch (err) {
      console.error('Failed to check transaction status:', err);
      setError('Failed to check transaction status');
      throw err;
    }
  }, [mixHistory]);
  
  // Получение истории микширования
  const fetchMixHistory = useCallback(async () => {
    if (!address) return;
    
    try {
      console.log('Fetching mix history for address:', address);
      // В реальном приложении здесь будет запрос к блокчейну
      // Сейчас просто используем историю из localStorage
    } catch (err) {
      console.error('Failed to fetch mix history:', err);
      setError('Failed to fetch mix history');
    }
  }, [address]);
  
  // Получение доступных пулов микшера
  const getAvailablePools = useCallback(async () => {
    try {
      return availablePools;
    } catch (err) {
      console.error('Failed to fetch available pools:', err);
      setError('Failed to fetch available pools');
      return [];
    }
  }, [availablePools]);
  
  // Очистка истории
  const clearHistory = useCallback(() => {
    setMixHistory([]);
    // Очищаем историю в localStorage
    try {
      localStorage.removeItem(STORAGE_KEYS.MIX_HISTORY);
      console.log('Mix history cleared');
    } catch (error) {
      console.error('Failed to clear mix history from localStorage:', error);
    }
  }, []);
  
  // Очистка сообщений
  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);
  
  // Инициализация при монтировании
  useEffect(() => {
    const savedHistory = loadMixHistory();
    setMixHistory(savedHistory);
    
    const savedPending = loadPendingTransactions();
    setPendingTransactions(savedPending);
    
    // Загружаем информацию о пулах из контракта
    loadPoolsInfo();
    loadStats();
    loadContractBalance();
    loadQueueInfo();
  }, [loadPoolsInfo, loadStats, loadContractBalance, loadQueueInfo]);
  
  // Сохранение истории в localStorage при изменении
  useEffect(() => {
    if (mixHistory.length > 0) {
      saveMixHistory(mixHistory);
    }
  }, [mixHistory]);
  
  // Сохранение отложенных транзакций при изменении
  useEffect(() => {
    if (pendingTransactions.length > 0) {
      savePendingTransactions(pendingTransactions);
    }
  }, [pendingTransactions]);
  
  // Проверка и обработка отложенных транзакций
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const dueTransactions = pendingTransactions.filter(
        tx => tx.status === 'pending' && tx.scheduledTime <= now
      );
      if (dueTransactions.length > 0) {
        console.log('Processing due transactions:', dueTransactions);
        processPendingTransactions(dueTransactions);
      }
    }, 10000); // Проверяем каждые 10 секунд
    return () => clearInterval(interval);
  }, [pendingTransactions]);
  
  // Обработка отложенных транзакций
  const processPendingTransactions = useCallback(async (transactions?: PendingTransaction[]) => {
    // Если транзакции не переданы, получаем те, которые нужно обработать сейчас
    const transactionsToProcess = transactions || pendingTransactions.filter(
      tx => tx.status === 'pending' && tx.scheduledTime <= Date.now()
    );
    console.log('Processing transactions:', transactionsToProcess);
    
    for (const tx of transactionsToProcess) {
      try {
        // Обновляем статус на "обрабатывается"
        setPendingTransactions(prev => 
          prev.map(t => t.id === tx.id ? { ...t, status: 'processing' } : t)
        );
        
        // Отправляем транзакцию
        const result = await contractService.sendWithdraw(
          Address.parse(import.meta.env.VITE_CONTRACT_ADDRESS!),
          Address.parse(tx.recipient),
          tx.amount.toString(),
          parseInt(tx.depositId || '0'),
          300, // 3% комиссия в сотых долях
          3600, // 1 час задержка в секундах
          sender!
        );
        
        // Обновляем статус на "завершено"
        setPendingTransactions(prev => 
          prev.map(t => t.id === tx.id ? { ...t, status: 'completed', txHash: result } : t)
        );
        
        // Добавляем в историю
        const newTransaction: MixTransaction = {
          id: result,
          poolId: tx.poolId,
          amount: tx.amount,
          fee: 0.03,
          status: 'completed',
          timestamp: Math.floor(Date.now() / 1000),
          txHash: result,
          inputAddress: import.meta.env.VITE_CONTRACT_ADDRESS!,
          outputAddress: tx.recipient,
          note: `Scheduled withdrawal to ${tx.recipient}`
        };
        
        // Используем функцию addTransactionToHistory для добавления транзакции
        const updatedHistory = addTransactionToHistory(newTransaction);
        setMixHistory(updatedHistory);
        
        console.log('Transaction completed and added to history:', newTransaction);
      } catch (error) {
        console.error('Failed to process pending transaction:', error);
        
        // Обновляем статус на "ошибка" и увеличиваем счетчик попыток
        setPendingTransactions(prev => 
          prev.map(t => 
            t.id === tx.id 
              ? { ...t, status: 'failed', retryCount: t.retryCount + 1 } 
              : t
          )
        );
        
        // Если попыток было меньше 3, планируем повторную попытку
        if (tx.retryCount < 3) {
          const retryTime = Date.now() + 5 * 60 * 1000; // Через 5 минут
          setPendingTransactions(prev => 
            prev.map(t => 
              t.id === tx.id 
                ? { ...t, status: 'pending', scheduledTime: retryTime } 
                : t
            )
          );
        }
      }
    }
  }, [pendingTransactions, sender, contractService]);
  
  // Обновленная функция микширования с выбором пула
  const mixTons = useCallback(async (
    amount: number,
    note?: string,
    recipients?: { address: string; amount: number; delay: number }[],
    poolId?: string,
    customDelay?: number
  ) => {
    if (!connected || !address || !sender) {
      setError('Please connect your wallet first');
      return;
    }
    
    setIsMixing(true);
    setError(null);
    setSuccess(null);
    
    try {
      const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
      if (!contractAddress) {
        throw new Error('Contract address not configured');
      }
      
      // Определяем тип пула
      let poolType: PoolType = 0; // Basic по умолчанию
      if (poolId === 'standard') poolType = 1;
      if (poolId === 'premium') poolType = 2;
      
      // Отправляем транзакцию в выбранный пул
      const txId = await contractService.sendDepositWithPool(
        Address.parse(contractAddress),
        amount.toString(),
        poolType,
        sender
      );
      
      // Получаем ID депозита
      const depositId = await contractService.getLastDepositId(Address.parse(contractAddress));
      
      // Получаем информацию о пуле депозита
      const depositInfo = await contractService.getDepositPoolInfo(
        Address.parse(contractAddress),
        depositId
      );
      
      // Находим выбранный пул
      const selectedPool = availablePools.find(p => p.id === poolId);
      
      // Добавляем запись в историю
      const newTransaction: MixTransaction = {
        id: txId,
        poolId: selectedPool?.id || 'basic',
        amount,
        fee: selectedPool?.fee || (feeRates?.basicRate || 3) / 100,
        status: 'pending',
        timestamp: Math.floor(Date.now() / 1000),
        txHash: txId,
        inputAddress: address.toString(),
        outputAddress: address.toString(),
        note,
        depositId: depositId.toString(),
        delayHours: selectedPool?.minDelayHours || 12
      };
      
      // Используем функцию addTransactionToHistory для добавления транзакции
      const updatedHistory = addTransactionToHistory(newTransaction);
      setMixHistory(updatedHistory);
      
      console.log('Mix transaction created and added to history:', newTransaction);
      
      // Если указаны получатели для распределения, создаем отложенные транзакции
      if (recipients && recipients.length > 0) {
        // Используем множественный вывод, если возможно
        if (recipients.length <= 4) {
          try {
            const result = await contractService.sendMultiWithdraw(
              Address.parse(contractAddress),
              recipients.map(r => ({
                recipient: Address.parse(r.address),
                amount: r.amount.toString(),
                feeRate: Math.floor((selectedPool?.fee || 0.03) * 100), // Преобразуем в сотые доли процента
                delay: r.delay
              })),
              parseInt(depositId.toString()),
              sender
            );
            
            console.log('Multi-withdrawal transaction sent:', result);
          } catch (error) {
            console.error('Failed to send multi-withdrawal, falling back to individual withdrawals:', error);
            
            // Если множественный вывод не удался, создаем отдельные отложенные транзакции
            const newPendingTransactions: PendingTransaction[] = recipients.map((recipient, index) => ({
              id: `withdraw_${Date.now()}_${index}`,
              recipient: recipient.address,
              amount: recipient.amount,
              scheduledTime: Date.now() + (recipient.delay * 1000),
              status: 'pending' as const,
              retryCount: 0,
              poolId: selectedPool?.id || 'basic',
              depositId: depositId.toString()
            }));
            
            setPendingTransactions(prev => [...prev, ...newPendingTransactions]);
            savePendingTransactions([...pendingTransactions, ...newPendingTransactions]);
          }
        } else {
          // Если получателей больше 4, создаем отложенные транзакции
          const newPendingTransactions: PendingTransaction[] = recipients.map((recipient, index) => ({
            id: `withdraw_${Date.now()}_${index}`,
            recipient: recipient.address,
            amount: recipient.amount,
            scheduledTime: Date.now() + (recipient.delay * 1000),
            status: 'pending' as const,
            retryCount: 0,
            poolId: selectedPool?.id || 'basic',
            depositId: depositId.toString()
          }));
          
          setPendingTransactions(prev => [...prev, ...newPendingTransactions]);
          savePendingTransactions([...pendingTransactions, ...newPendingTransactions]);
        }
      }
      
      const poolName = selectedPool?.name || 'Basic Pool';
      setSuccess(`Successfully initiated mixing of ${amount} TON in ${poolName}`);
      await loadContractBalance();
      await loadStats();
      await loadQueueInfo();
      
      return { txId, poolId: selectedPool?.id, depositId };
    } catch (err) {
      console.error('Mixing failed:', err);
      setError(err instanceof Error ? err.message : 'Mixing failed');
      throw err;
    } finally {
      setIsMixing(false);
    }
  }, [connected, address, sender, contractService, loadContractBalance, loadStats, loadQueueInfo, availablePools, pendingTransactions, feeRates]);
  
  // Функция для обработки очереди
  const processQueue = useCallback(async () => {
    if (!connected || !address || !sender) {
      setError('Please connect your wallet first');
      return;
    }
    
    setIsMixing(true);
    setError(null);
    setSuccess(null);
    
    try {
      const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
      if (!contractAddress) {
        throw new Error('Contract address not configured');
      }
      
      const address = Address.parse(contractAddress);
      
      // Получаем ID следующего элемента очереди
      const nextItemId = await contractService.getNextQueueItemId(address);
      
      if (nextItemId >= 0) {
        // Обрабатываем элемент очереди
        const result = await contractService.sendProcessQueue(
          address,
          nextItemId,
          sender
        );
        
        setSuccess(`Successfully processed queue item #${nextItemId}`);
        await loadContractBalance();
        await loadStats();
        await loadQueueInfo();
        
        return result;
      } else {
        setSuccess('No items in queue to process');
        return null;
      }
    } catch (err) {
      console.error('Queue processing failed:', err);
      setError(err instanceof Error ? err.message : 'Queue processing failed');
      throw err;
    } finally {
      setIsMixing(false);
    }
  }, [connected, address, sender, contractService, loadContractBalance, loadStats, loadQueueInfo]);
  
  // Обновляем доступные пулы при изменении баланса контракта
  useEffect(() => {
    getAvailablePools();
  }, [contractBalance, getAvailablePools]);
  
  return {
    isMixing,
    mixHistory,
    setMixHistory,
    availablePools,
    error,
    success,
    contractBalance,
    pendingTransactions,
    feeRates,
    limits,
    delays,
    stats,
    queueStatus,
    queueDetails,
    mixTons,
    checkTransactionStatus,
    fetchMixHistory,
    getAvailablePools,
    clearHistory,
    clearMessages,
    loadContractBalance,
    loadPoolsInfo,
    loadStats,
    loadQueueInfo,
    processPendingTransactions,
    processQueue
  };
};