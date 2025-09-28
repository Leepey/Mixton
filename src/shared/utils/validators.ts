export const isValidAddress = (address: string): boolean => {
  // Базовая валидация адреса TON
  return /^0:[0-9a-fA-F]{64}$/.test(address);
};

export const isValidAmount = (amount: string): boolean => {
  // Валидация суммы (неотрицательное число)
  const num = parseFloat(amount);
  return !isNaN(num) && num >= 0;
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  // Минимум 8 символов, хотя бы одна заглавная буква, одна строчная и одна цифра
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const validateRequired = (value: any): boolean => {
  return value !== null && value !== undefined && value !== '';
};