export const APP_CONFIG = {
  NAME: 'Mixton',
  VERSION: '2.3.1',
  DESCRIPTION: 'Decentralized TON mixer with enhanced privacy',
  
  // Тайминги
  TIMEOUTS: {
    API_REQUEST: 30000, // 30 секунд
    TRANSACTION: 60000, // 60 секунд
    MIXING: 300000, // 5 минут
  },
  
  // Лимиты
  LIMITS: {
    MIN_MIX_AMOUNT: 0.1, // Минимальная сумма для микширования в TON
    MAX_MIX_AMOUNT: 1000, // Максимальная сумма для микширования в TON
    MAX_HISTORY_ITEMS: 100, // Максимальное количество элементов в истории
  },
  
  // Комиссии
  FEES: {
    MIXING_FEE: 0.001, // Комиссия за микширование в TON
    MINER_FEE: 0.0001, // Комиссия майнера в TON
  },
};
