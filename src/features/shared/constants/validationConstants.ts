export const VALIDATION_CONFIG = {
  // Регулярные выражения
  REGEX: {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    TON_ADDRESS: /^EQ[A-Za-z0-9_-]{46}$/,
    TRANSACTION_HASH: /^[A-Za-z0-9]{64}$/,
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  },
  
  // Длины
  LENGTHS: {
    USERNAME_MIN: 3,
    USERNAME_MAX: 20,
    PASSWORD_MIN: 8,
    PASSWORD_MAX: 128,
    ADDRESS_LENGTH: 48,
    TRANSACTION_HASH_LENGTH: 64,
  },
  
  // Сообщения об ошибках
  ERROR_MESSAGES: {
    INVALID_EMAIL: 'Неверный формат email',
    INVALID_ADDRESS: 'Неверный формат адреса TON',
    INVALID_PASSWORD: 'Пароль должен содержать минимум 8 символов, включая заглавную букву, строчную букву и цифру',
    INVALID_AMOUNT: 'Неверная сумма',
    INSUFFICIENT_BALANCE: 'Недостаточно средств',
    NETWORK_ERROR: 'Ошибка сети',
    UNKNOWN_ERROR: 'Неизвестная ошибка',
  },
};
