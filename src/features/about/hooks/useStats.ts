// src/features/about/hooks/useStats.ts
import { useState, useEffect } from 'react';
import { AboutService } from '../services/aboutService';
import type { AboutStats } from '../types/about.types';

interface UseStatsReturn {
  stats: AboutStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  formattedStats: {
    users: string;
    mixed: string; // Changed from transactions to mixed
    volume: string;
    uptime: string;
  };
}

export const useStats = (): UseStatsReturn => {
  const [stats, setStats] = useState<AboutStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const data = await AboutService.getStats();
      setStats(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stats';
      setError(errorMessage);
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString();
  };

  // Helper function to extract number from string like "2,500,000+ TON"
  const extractNumberFromString = (str: string): number => {
    const matches = str.match(/[\d,]+/);
    if (matches) {
      return parseInt(matches[0].replace(/,/g, ''), 10);
    }
    return 0;
  };

  const formattedStats = {
    users: stats ? formatNumber(extractNumberFromString(stats.usersCount)) : '0',
    mixed: stats ? stats.totalMixed : '0', // Changed from transactions to mixed
    volume: stats ? stats.totalMixed : '0', // Using totalMixed as volume since it represents the total amount mixed
    uptime: stats ? `${stats.uptime}%` : '0%'
  };

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
    formattedStats
  };
};