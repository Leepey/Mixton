// src/features/about/hooks/useTimeline.ts
import { useState, useEffect } from 'react';
import { AboutService } from '../services/aboutService';
import type { TimelineEvent } from '../types/about.types';

interface UseTimelineReturn {
  timeline: TimelineEvent[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useTimeline = (): UseTimelineReturn => {
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTimeline = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await AboutService.getTimeline();
      setTimeline(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch timeline';
      setError(errorMessage);
      console.error('Error fetching timeline:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeline();
  }, []);

  return {
    timeline,
    loading,
    error,
    refetch: fetchTimeline
  };
};