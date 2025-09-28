// features/admin/hooks/useUserManagement.ts
import { useState } from 'react';
import type { AdminSettings } from '../types/admin.types';
import { AdminService } from '../services/adminService';

export const useUserManagement = () => {
  const [loading, setLoading] = useState(false);
  const [adminSettings, setAdminSettings] = useState<AdminSettings>({
    feeRate: 0.003,
    minAmount: 0.01,
    maxAmount: 100,
    autoProcess: true,
    processInterval: 3600
  });

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdminSettings(prev => ({
      ...prev,
      [name]: name.includes('Amount') || name.includes('Rate') || name.includes('Interval') 
        ? Number(value) 
        : value
    }));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      await AdminService.updateAdminSettings(adminSettings);
      return true;
    } catch (error) {
      console.error('Failed to save settings:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { adminSettings, loading, handleSettingsChange, handleSaveSettings };
};