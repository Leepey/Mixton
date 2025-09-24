// src/features/auth/utils/authUtils.ts
export const validateAddress = (address: string): boolean => {
  // Валидация адреса TON
  return address.startsWith('0:') && address.length === 66;
};

export const generateNonce = (): string => {
  return Math.random().toString(36).substring(2);
};