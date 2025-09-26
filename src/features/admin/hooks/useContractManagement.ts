// features/admin/hooks/useContractManagement.ts
import { useState } from 'react';
import { useMixerContext } from '../../../context/MixerContext';
import { AdminService } from '../services/adminService';

export const useContractManagement = () => {
  const [loading, setLoading] = useState(false);
  const { refreshContractData } = useMixerContext();

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await AdminService.refreshData();
      await refreshContractData();
    } catch (error) {
      console.error('Failed to refresh data:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleProcessQueue = async () => {
    setLoading(true);
    try {
      await AdminService.processQueue();
    } catch (error) {
      console.error('Failed to process queue:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleRefresh, handleProcessQueue };
};