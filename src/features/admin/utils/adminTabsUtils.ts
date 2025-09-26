// features/admin/utils/adminTabsUtils.ts
import type { AdminTab, AdminTabValue } from '../types/admin.types';

/**
 * Получает все доступные вкладки административной панели
 * @returns Массив объектов вкладок
 */
export const getAdminTabs = (): AdminTab[] => [
  {
    id: 0,
    name: 'Overview',
    icon: <Dashboard />,
    description: 'Main dashboard and statistics'
  },
  {
    id: 1,
    name: 'Settings',
    icon: <Settings />,
    description: 'Contract and system settings'
  },
  {
    id: 2,
    name: 'Pools',
    icon: <Group />,
    description: 'Manage mixing pools'
  },
  {
    id: 3,
    name: 'Transactions',
    icon: <History />,
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
    case 0:
      return 'overview';
    case 1:
      return 'settings';
    case 2:
      return 'pools';
    case 3:
      return 'transactions';
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
    case 'overview':
      return 0;
    case 'settings':
      return 1;
    case 'pools':
      return 2;
    case 'transactions':
      return 3;
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
    case 'overview':
      return <Dashboard />;
    case 'settings':
      return <Settings />;
    case 'pools':
      return <Group />;
    case 'transactions':
      return <History />;
    default:
      return <Dashboard />;
  }
};

/**
 * Получает описание для вкладки по её значению
 * @param value - Значение AdminTabValue
 * @returns Описание вкладки
 */
export const getTabDescription = (value: AdminTabValue): string => {
  switch (value) {
    case 'overview':
      return 'Main dashboard and statistics';
    case 'settings':
      return 'Contract and system settings';
    case 'pools':
      return 'Manage mixing pools';
    case 'transactions':
      return 'View transaction history';
    default:
      return 'Admin panel';
  }
};

/**
 * Получает все возможные значения AdminTabValue
 * @returns Массив всех возможных значений
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
 * Получает вкладку по индексу
 * @param index - Индекс вкладки
 * @returns Объект вкладки или undefined
 */
export const getTabByIndex = (index: number): AdminTab | undefined => {
  const tabs = getAdminTabs();
  return tabs.find(tab => tab.id === index);
};

/**
 * Получает вкладку по значению
 * @param value - Значение AdminTabValue
 * @returns Объект вкладки или undefined
 */
export const getTabByValue = (value: AdminTabValue): AdminTab | undefined => {
  const tabs = getAdminTabs();
  const id = getTabIdByValue(value);
  return tabs.find(tab => tab.id === id);
};

/**
 * Проверяет существование вкладки по ID
 * @param id - ID вкладки
 * @returns true если вкладка существует
 */
export const tabExists = (id: number): boolean => {
  const tabs = getAdminTabs();
  return tabs.some(tab => tab.id === id);
};

/**
 * Проверяет существование вкладки по значению
 * @param value - Значение AdminTabValue
 * @returns true если вкладка существует
 */
export const tabValueExists = (value: string): boolean => {
  return isValidTabValue(value);
};

/**
 * Получает количество вкладок
 * @returns Количество доступных вкладок
 */
export const getTabCount = (): number => {
  return getAdminTabs().length;
};

/**
 * Получает первую вкладку
 * @returns Первая вкладка
 */
export const getFirstTab = (): AdminTab => {
  const tabs = getAdminTabs();
  return tabs[0];
};

/**
 * Получает последнюю вкладку
 * @returns Последняя вкладка
 */
export const getLastTab = (): AdminTab => {
  const tabs = getAdminTabs();
  return tabs[tabs.length - 1];
};