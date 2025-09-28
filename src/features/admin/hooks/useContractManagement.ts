// src/features/admin/hooks/useContractManagement.ts
import { useState, useCallback, useEffect } from 'react';
import { useMixerContext } from '../../shared/context/MixerContext';
import { AdminService } from '../services/adminService';
import type { 
  AdminSettings, 
  PoolInfo, 
  Transaction, 
  AdminStats,
  BasicStats,
  PoolStats,
  TransactionStats 
} from '../types/admin.types';

interface ContractManagementState {
  loading: boolean;
  error: string | null;
  success: string | null;
  settings: AdminSettings | null;
  pools: PoolInfo[];
  recentTransactions: Transaction[];
  stats: AdminStats | null;
}

interface ContractManagementActions {
  // Data operations
  refreshData: () => Promise<void>;
  processQueue: () => Promise<void>;
  fetchSettings: () => Promise<void>;
  updateSettings: (settings: Partial<AdminSettings>) => Promise<void>;
  fetchPools: () => Promise<void>;
  updatePool: (poolId: string, updates: Partial<PoolInfo>) => Promise<void>;
  fetchRecentTransactions: () => Promise<void>;
  fetchStats: () => Promise<void>;
  
  // Contract operations
  pauseContract: () => Promise<void>;
  resumeContract: () => Promise<void>;
  emergencyWithdraw: (amount: number, recipient: string) => Promise<void>;
  updateFeeRates: (rates: { basic?: number; standard?: number; premium?: number }) => Promise<void>;
  updateLimits: (limits: { minDeposit?: string; maxDeposit?: string; minWithdraw?: string }) => Promise<void>;
  
  // Utility operations
  clearMessages: () => void;
  refetch: () => Promise<void>;
}

export type UseContractManagementReturn = ContractManagementState & ContractManagementActions;

export const useContractManagement = (): UseContractManagementReturn => {
  const { 
    loadContractBalance, 
    loadPoolsInfo, 
    loadStats, 
    loadQueueInfo,
    processQueue: processQueueFromContext 
  } = useMixerContext();
  
  const [state, setState] = useState<ContractManagementState>({
    loading: false,
    error: null,
    success: null,
    settings: null,
    pools: [],
    recentTransactions: [],
    stats: null,
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error, success: null }));
  }, []);

  const setSuccess = useCallback((success: string | null) => {
    setState(prev => ({ ...prev, success, error: null }));
  }, []);

  const clearMessages = useCallback(() => {
    setState(prev => ({ ...prev, error: null, success: null }));
  }, []);

  // Generic error handler
  const handleOperation = useCallback(async (
    operation: () => Promise<void>,
    successMessage?: string,
    errorMessage?: string
  ) => {
    setLoading(true);
    try {
      await operation();
      if (successMessage) {
        setSuccess(successMessage);
      }
    } catch (error) {
      const message = errorMessage || `Operation failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      setError(message);
      console.error('Contract management operation failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setSuccess]);

  // Data operations
  const refreshData = useCallback(async () => {
    await handleOperation(
      async () => {
        await AdminService.refreshData();
        await Promise.all([
          loadContractBalance(),
          loadPoolsInfo(),
          loadStats(),
          loadQueueInfo()
        ]);
      },
      'Data refreshed successfully',
      'Failed to refresh data'
    );
  }, [handleOperation, loadContractBalance, loadPoolsInfo, loadStats, loadQueueInfo]);

  const processQueue = useCallback(async () => {
    await handleOperation(
      async () => {
        await AdminService.processQueue();
        await processQueueFromContext(); // Use the context method
        await refreshData();
      },
      'Queue processed successfully',
      'Failed to process queue'
    );
  }, [handleOperation, processQueueFromContext, refreshData]);

  const fetchSettings = useCallback(async () => {
    await handleOperation(
      async () => {
        const settings = await AdminService.getAdminSettings();
        setState(prev => ({ ...prev, settings }));
      },
      undefined,
      'Failed to fetch settings'
    );
  }, [handleOperation]);

  const updateSettings = useCallback(async (newSettings: Partial<AdminSettings>) => {
    await handleOperation(
      async () => {
        if (!state.settings) throw new Error('No settings loaded');
        const updatedSettings = { ...state.settings, ...newSettings };
        await AdminService.updateAdminSettings(updatedSettings);
        setState(prev => ({ ...prev, settings: updatedSettings }));
      },
      'Settings updated successfully',
      'Failed to update settings'
    );
  }, [handleOperation, state.settings]);

  const fetchPools = useCallback(async () => {
    await handleOperation(
      async () => {
        // This would typically call a service method to fetch pools
        // For now, we'll simulate it
        const mockPools: PoolInfo[] = [
          {
            id: 'basic',
            name: 'Basic Pool',
            fee: 0.003,
            minAmount: 0.01,
            maxAmount: 10,
            minDelayHours: 1,
            isActive: true,
          },
          {
            id: 'standard',
            name: 'Standard Pool',
            fee: 0.005,
            minAmount: 0.1,
            maxAmount: 50,
            minDelayHours: 2,
            isActive: true,
          },
          {
            id: 'premium',
            name: 'Premium Pool',
            fee: 0.01,
            minAmount: 1,
            maxAmount: 100,
            minDelayHours: 4,
            isActive: true,
          },
        ];
        setState(prev => ({ ...prev, pools: mockPools }));
      },
      undefined,
      'Failed to fetch pools'
    );
  }, [handleOperation]);

  const updatePool = useCallback(async (poolId: string, updates: Partial<PoolInfo>) => {
    await handleOperation(
      async () => {
        setState(prev => ({
          ...prev,
          pools: prev.pools.map(pool =>
            pool.id === poolId ? { ...pool, ...updates } : pool
          )
        }));
      },
      `Pool ${poolId} updated successfully`,
      `Failed to update pool ${poolId}`
    );
  }, [handleOperation]);

  const fetchRecentTransactions = useCallback(async () => {
    await handleOperation(
      async () => {
        // This would typically call a service method to fetch recent transactions
        // For now, we'll simulate it
        const mockTransactions: Transaction[] = [
          {
            id: '1',
            amount: 1.5,
            fee: 0.0075,
            status: 'completed',
            timestamp: Date.now() - 3600000,
            pool: 'standard',
          },
          {
            id: '2',
            amount: 0.5,
            fee: 0.0025,
            status: 'pending',
            timestamp: Date.now() - 1800000,
            pool: 'basic',
          },
        ];
        setState(prev => ({ ...prev, recentTransactions: mockTransactions }));
      },
      undefined,
      'Failed to fetch recent transactions'
    );
  }, [handleOperation]);

  const fetchStats = useCallback(async () => {
    await handleOperation(
      async () => {
        // This would typically call a service method to fetch comprehensive stats
        // For now, we'll simulate it
        const mockStats: AdminStats = {
          basic: {
            totalUsers: 15000,
            totalTransactions: 45000,
            totalVolume: 2500000,
            averageFee: 0.005,
            pendingTransactions: 150,
            completedTransactions: 44850,
            failedTransactions: 0,
            averageProcessingTime: 7200,
            contractBalance: 50000,
            uptime: 99.9,
          },
          pools: {
            totalPools: 3,
            activePools: 3,
            totalLiquidity: 500000,
            averagePoolSize: 166667,
          },
          transactions: {
            totalVolume: 2500000,
            averageAmount: 55.56,
            averageFee: 0.005,
            successRate: 99.67,
            averageProcessingTime: 7200,
          },
          lastUpdated: new Date(),
        };
        setState(prev => ({ ...prev, stats: mockStats }));
      },
      undefined,
      'Failed to fetch stats'
    );
  }, [handleOperation]);

  // Contract operations
  const pauseContract = useCallback(async () => {
    await handleOperation(
      async () => {
        // This would call a contract method to pause operations
        console.log('Pausing contract operations...');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate contract call
      },
      'Contract paused successfully',
      'Failed to pause contract'
    );
  }, [handleOperation]);

  const resumeContract = useCallback(async () => {
    await handleOperation(
      async () => {
        // This would call a contract method to resume operations
        console.log('Resuming contract operations...');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate contract call
      },
      'Contract resumed successfully',
      'Failed to resume contract'
    );
  }, [handleOperation]);

  const emergencyWithdraw = useCallback(async (amount: number, recipient: string) => {
    await handleOperation(
      async () => {
        // This would call a contract method for emergency withdrawal
        console.log(`Emergency withdraw ${amount} to ${recipient}...`);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate contract call
        await refreshData(); // Refresh balance after withdrawal
      },
      `Emergency withdrawal of ${amount} TON initiated`,
      'Failed to initiate emergency withdrawal'
    );
  }, [handleOperation, refreshData]);

  const updateFeeRates = useCallback(async (rates: { basic?: number; standard?: number; premium?: number }) => {
    await handleOperation(
      async () => {
        // This would call contract methods to update fee rates
        console.log('Updating fee rates:', rates);
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate contract calls
        await refreshData(); // Refresh data after update
      },
      'Fee rates updated successfully',
      'Failed to update fee rates'
    );
  }, [handleOperation, refreshData]);

  const updateLimits = useCallback(async (limits: { minDeposit?: string; maxDeposit?: string; minWithdraw?: string }) => {
    await handleOperation(
      async () => {
        // This would call contract methods to update limits
        console.log('Updating limits:', limits);
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate contract calls
        await refreshData(); // Refresh data after update
      },
      'Limits updated successfully',
      'Failed to update limits'
    );
  }, [handleOperation, refreshData]);

  // Comprehensive refetch
  const refetch = useCallback(async () => {
    await Promise.all([
      refreshData(),
      fetchSettings(),
      fetchPools(),
      fetchRecentTransactions(),
      fetchStats(),
    ]);
  }, [refreshData, fetchSettings, fetchPools, fetchRecentTransactions, fetchStats]);

  // Initial data load
  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    ...state,
    refreshData,
    processQueue,
    fetchSettings,
    updateSettings,
    fetchPools,
    updatePool,
    fetchRecentTransactions,
    fetchStats,
    pauseContract,
    resumeContract,
    emergencyWithdraw,
    updateFeeRates,
    updateLimits,
    clearMessages,
    refetch,
  };
};