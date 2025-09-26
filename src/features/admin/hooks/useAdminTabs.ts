// features/admin/hooks/useAdminTabs.ts
import { useState, useCallback } from 'react';
import { AdminTabValue } from '../types/admin.types';
import { 
  getTabValueById, 
  getTabIdByValue, 
  isValidTabValue,
  getNextTab,
  getPreviousTab
} from '../utils/adminTabsUtils';

interface UseAdminTabsReturn {
  activeTab: AdminTabValue;
  activeTabId: number;
  setActiveTab: (tab: AdminTabValue) => void;
  setActiveTabById: (id: number) => void;
  nextTab: () => void;
  previousTab: () => void;
  isValidTab: (value: string) => boolean;
}

/**
 * Хук для управления вкладками административной панели
 * @param initialTab - Начальная вкладка (по умолчанию 'overview')
 */
export const useAdminTabs = (initialTab: AdminTabValue = 'overview'): UseAdminTabsReturn => {
  const [activeTab, setActiveTabState] = useState<AdminTabValue>(initialTab);

  const setActiveTab = useCallback((tab: AdminTabValue) => {
    if (isValidTabValue(tab)) {
      setActiveTabState(tab);
    } else {
      console.warn(`Invalid tab value: ${tab}`);
    }
  }, []);

  const setActiveTabById = useCallback((id: number) => {
    const tabValue = getTabValueById(id);
    setActiveTab(tabValue);
  }, []);

  const nextTab = useCallback(() => {
    const next = getNextTab(activeTab);
    setActiveTab(next);
  }, [activeTab]);

  const previousTab = useCallback(() => {
    const previous = getPreviousTab(activeTab);
    setActiveTab(previous);
  }, [activeTab]);

  const isValidTab = useCallback((value: string) => {
    return isValidTabValue(value);
  }, []);

  const activeTabId = getTabIdByValue(activeTab);

  return {
    activeTab,
    activeTabId,
    setActiveTab,
    setActiveTabById,
    nextTab,
    previousTab,
    isValidTab
  };
};