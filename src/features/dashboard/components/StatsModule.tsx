// src/features/dashboard/components/StatsModule.tsx
import React from 'react';
import { NeonCard } from '@/features/shared/components/ui/cards/NeonCard';
import { useDashboardStats } from '../hooks/useDashboardStats';

export const StatsModule = () => {
  const { data: stats, isLoading } = useDashboardStats();
  
  if (isLoading) return <div>Loading stats...</div>;
  
  return (
    <NeonCard title="Statistics">
      <div>Total Deposits: {stats?.totalDeposits}</div>
      <div>Total Withdrawn: {stats?.totalWithdrawn}</div>
      <div>Active Users: {stats?.activeUsers}</div>
    </NeonCard>
  );
};