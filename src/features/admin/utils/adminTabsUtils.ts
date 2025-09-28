// src/features/admin/utils/adminTabsUtils.ts
import type { AdminTab, AdminTabValue } from '../types/admin.types';
import React from 'react';

// Импортируем иконки напрямую
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import PoolIcon from '@mui/icons-material/Pool';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import HelpIcon from '@mui/icons-material/Help';

/**
 * Получает все доступные вкладки административной панели
 * @returns Массив объектов вкладок
 */
export const getAdminTabs = (): AdminTab[] => [
  {
    id: 0,
    name: 'Overview',
    icon: React.createElement(DashboardIcon),
    description: 'Main dashboard and statistics'
  },
  {
    id: 1,
    name: 'Settings',
    icon: React.createElement(SettingsIcon),
    description: 'Contract and system settings'
  },
  {
    id: 2,
    name: 'Pools',
    icon: React.createElement(PoolIcon),
    description: 'Manage mixing pools'
  },
  {
    id: 3,
    name: 'Transactions',
    icon: React.createElement(ReceiptLongIcon),
    description: 'View transaction history'
  }
];

/**
 * Получает значение вкладки по её ID
 * @param id - ID вкладки
 * @returns Значение AdminTabValue
 */
export const getTabValueById = (id: number): AdminTabValue => {
  switch (id) {
    case 0: return 'overview';
    case 1: return 'settings';
    case 2: return 'pools';
    case 3: return 'transactions';
    default:
      console.warn(`Unknown tab id: ${id}, returning 'overview'`);
      return 'overview';
  }
};

/**
 * Получает ID вкладки по её значению
 * @param value - Значение AdminTabValue
 * @returns ID вкладки
 */
export const getTabIdByValue = (value: AdminTabValue): number => {
  switch (value) {
    case 'overview': return 0;
    case 'settings': return 1;
    case 'pools': return 2;
    case 'transactions': return 3;
    default:
      console.warn(`Unknown tab value: ${value}, returning 0`);
      return 0;
  }
};

/**
 * Проверяет, является ли значение допустимым AdminTabValue
 * @param value - Проверяемое значение
 * @returns true если значение допустимо
 */
export const isValidTabValue = (value: string): value is AdminTabValue => {
  return ['overview', 'settings', 'pools', 'transactions'].includes(value);
};

/**
 * Получает иконку для вкладки по её значению
 * @param value - Значение AdminTabValue
 * @returns React-компонент иконки
 */
export const getTabIcon = (value: AdminTabValue): React.ReactNode => {
  switch (value) {
    case 'overview': return React.createElement(DashboardIcon);
    case 'settings': return React.createElement(SettingsIcon);
    case 'pools': return React.createElement(PoolIcon);
    case 'transactions': return React.createElement(ReceiptLongIcon);
    default: return React.createElement(HelpIcon);
  }
};

/**
 * Получает описание для вкладки по её значению
 * @param value - Значение AdminTabValue
 * @returns Описание вкладки
 */
export const getTabDescription = (value: AdminTabValue): string => {
  const tab = getAdminTabs().find(t => getTabValueById(t.id) === value);
  return tab?.description || 'No description available';
};

/**
 * Получает все возможные значения вкладок
 * @returns Массив значений AdminTabValue
 */
export const getAllTabValues = (): AdminTabValue[] => {
  return ['overview', 'settings', 'pools', 'transactions'];
};

/**
 * Получает следующую вкладку в последовательности
 * @param currentValue - Текущее значение вкладки
 * @returns Следующее значение AdminTabValue
 */
export const getNextTab = (currentValue: AdminTabValue): AdminTabValue => {
  const values = getAllTabValues();
  const currentIndex = values.indexOf(currentValue);
  const nextIndex = (currentIndex + 1) % values.length;
  return values[nextIndex];
};

/**
 * Получает предыдущую вкладку в последовательности
 * @param currentValue - Текущее значение вкладки
 * @returns Предыдущее значение AdminTabValue
 */
export const getPreviousTab = (currentValue: AdminTabValue): AdminTabValue => {
  const values = getAllTabValues();
  const currentIndex = values.indexOf(currentValue);
  const previousIndex = currentIndex === 0 ? values.length - 1 : currentIndex - 1;
  return values[previousIndex];
};

/**
 * Получает вкладку по её значению
 * @param value - Значение AdminTabValue
 * @returns Объект вкладки или undefined
 */
export const getTabByValue = (value: AdminTabValue): AdminTab | undefined => {
  return getAdminTabs().find(tab => getTabValueById(tab.id) === value);
};

/**
 * Получает вкладку по её ID
 * @param id - ID вкладки
 * @returns Объект вкладки или undefined
 */
export const getTabById = (id: number): AdminTab | undefined => {
  return getAdminTabs().find(tab => tab.id === id);
};

/**
 * Проверяет, является ли вкладка активной
 * @param currentTab - Текущая вкладка
 * @param tabToCheck - Проверяемая вкладка
 * @returns true если вкладки совпадают
 */
export const isTabActive = (currentTab: AdminTabValue, tabToCheck: AdminTabValue): boolean => {
  return currentTab === tabToCheck;
};

/**
 * Получает CSS класс для активной вкладки
 * @param isActive - Флаг активности
 * @returns CSS класс
 */
export const getActiveTabClass = (isActive: boolean): string => {
  return isActive ? 'active-tab' : 'inactive-tab';
};

/**
 * Получает цвет для вкладки в зависимости от её статуса
 * @param isActive - Флаг активности
 * @returns Цвет в формате Material-UI
 */
export const getTabColor = (isActive: boolean): 'primary' | 'inherit' => {
  return isActive ? 'primary' : 'inherit';
};