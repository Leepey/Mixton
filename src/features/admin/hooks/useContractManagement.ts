import { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import type { ContractSettings } from '../types/admin.types';
import { validateContractSettings } from '../utils/adminUtils';

export const useContractManagement = () => {
  const [settings, setSettings] = useState<ContractSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const data = await adminService.getContractSettings();
      setSettings(data);
      setErrors([]);
    } catch (error) {
      console.error('Failed to fetch contract settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: ContractSettings) => {
    const validationErrors = validateContractSettings(newSettings);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return false;
    }

    setUpdating(true);
    try {
      await adminService.updateContractSettings(newSettings);
      setSettings(newSettings);
      setErrors([]);
      return true;
    } catch (error) {
      console.error('Failed to update contract settings:', error);
      setErrors(['Failed to update settings']);
      return false;
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    updating,
    errors,
    updateSettings,
    refreshSettings: fetchSettings,
  };
};