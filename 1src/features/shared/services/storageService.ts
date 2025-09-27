// src/services/storageService.ts


// Экспортируем константы STORAGE_KEYS
export const STORAGE_KEYS = {
  MIX_HISTORY: 'ton_mixer_history',
  PENDING_TRANSACTIONS: 'ton_mixer_pending_transactions',
  SETTINGS: 'ton_mixer_settings'
};

// Сохранение истории транзакций
export const saveMixHistory = (history: any[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.MIX_HISTORY, JSON.stringify(history));
    console.log('History saved to localStorage:', history);
  } catch (error) {
    console.error('Failed to save mix history:', error);
  }
};

// Загрузка истории транзакций
export const loadMixHistory = (): any[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.MIX_HISTORY);
    const history = stored ? JSON.parse(stored) : [];
    console.log('History loaded from localStorage:', history);
    return history;
  } catch (error) {
    console.error('Failed to load mix history:', error);
    return [];
  }
};

// Сохранение отложенных транзакций
export const savePendingTransactions = (transactions: any[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PENDING_TRANSACTIONS, JSON.stringify(transactions));
    console.log('Pending transactions saved to localStorage:', transactions);
  } catch (error) {
    console.error('Failed to save pending transactions:', error);
  }
};

// Загрузка отложенных транзакций
export const loadPendingTransactions = (): any[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PENDING_TRANSACTIONS);
    const transactions = stored ? JSON.parse(stored) : [];
    console.log('Pending transactions loaded from localStorage:', transactions);
    return transactions;
  } catch (error) {
    console.error('Failed to load pending transactions:', error);
    return [];
  }
};

// Добавление транзакции в историю
export const addTransactionToHistory = (transaction: any) => {
  try {
    const currentHistory = loadMixHistory();
    const updatedHistory = [transaction, ...currentHistory];
    saveMixHistory(updatedHistory);
    console.log('Transaction added to history:', transaction);
    return updatedHistory;
  } catch (error) {
    console.error('Failed to add transaction to history:', error);
    return loadMixHistory(); // Возвращаем текущую историю в случае ошибки
  }
};

// Очистка хранилища
export const clearStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.MIX_HISTORY);
    localStorage.removeItem(STORAGE_KEYS.PENDING_TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    console.log('Storage cleared');
  } catch (error) {
    console.error('Failed to clear storage:', error);
  }
};