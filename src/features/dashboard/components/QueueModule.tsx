// src/features/dashboard/components/QueueModule.tsx
import React from 'react';
import { NeonCard } from '@/features/shared/components/ui/cards/NeonCard';
import { useQueueManagement } from '../hooks/useQueueManagement';

export const QueueModule = () => {
  const { queue, processQueue } = useQueueManagement();
  
  return (
    <NeonCard title="Withdrawal Queue">
      <div>Queue Length: {queue.length}</div>
      <button onClick={processQueue}>Process Queue</button>
    </NeonCard>
  );
};