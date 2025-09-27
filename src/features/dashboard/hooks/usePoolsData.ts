// features/dashboard/hooks/usePoolsData.ts
import { useState, useEffect } from 'react';
import { Pool } from '../types/dashboard.types';
import { DashboardService } from '../services/dashboardService';

export const usePoolsData = () => {
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPools = async () => {
    try {
      setLoading(true);
      const data = await DashboardService.getAvailablePools();
      setPools(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch pools');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPools();
  }, []);

  return { pools, loading, error, refetch: fetchPools };
}; 