// features/admin/hooks/useAdminData.ts
import { useState, useEffect } from 'react';
import type { BasicStats } from '../types/admin.types';

export const useAdminData = () => {
  const [stats, setStats] = useState<BasicStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Обновляем моковые данные с учетом всех свойств
      const mockStats: BasicStats = {
        totalUsers: 15420,
        totalTransactions: 89340,
        totalVolume: 2560000,
        pendingTransactions: 45,
        completedTransactions: 89295,
        failedTransactions: 0,
        averageProcessingTime: 3.2,
        uptime: 99.9,
        // Добавляем недостающие свойства
        averageFee: 0.003,
        contractBalance: 125000
      };
      
      setStats(mockStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
};