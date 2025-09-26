// features/dashboard/hooks/useDashboardState.ts
import { useState } from 'react';
import { DashboardTab, MixFormData } from '../types/dashboard.types';

export const useDashboardState = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [showForm, setShowForm] = useState(false);
  const [transactionPending, setTransactionPending] = useState(false);
  const [selectedPool, setSelectedPool] = useState<string>('');

  const handlePoolSelect = (poolId: string) => {
    setSelectedPool(poolId);
    setShowForm(true);
  };

  const handleMix = async (data: MixFormData, mixFunction: (amount: number, note?: string) => Promise<void>) => {
    setTransactionPending(true);
    try {
      await mixFunction(data.amount, data.note);
      setShowForm(false);
    } catch (error) {
      console.error('Mix transaction failed:', error);
      throw error;
    } finally {
      setTransactionPending(false);
    }
  };

  return {
    activeTab,
    setActiveTab,
    showForm,
    setShowForm,
    transactionPending,
    selectedPool,
    handlePoolSelect,
    handleMix
  };
};