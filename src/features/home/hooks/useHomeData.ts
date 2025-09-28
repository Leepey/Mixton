// features/home/hooks/useHomeData.ts
import { useState, useEffect, useCallback } from 'react';
import type { HomeStats, FeatureCard } from '../types/home.types';
import { HomeService } from '../services/homeService';

export const useHomeData = () => {
  const [stats, setStats] = useState<HomeStats | null>(null);
  const [features, setFeatures] = useState<FeatureCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsData, featuresData] = await Promise.all([
        HomeService.getHomeStats(),
        HomeService.getFeatureCards()
      ]);
      
      setStats(statsData);
      setFeatures(featuresData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch home data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { stats, features, loading, error, refetch: fetchData };
};