import crypto from 'crypto';

export const cryptoUtils = {
  // Генерация случайного ID
  generateId(): string {
    return crypto.randomBytes(16).toString('hex');
  },

  // Генерация случайной строки
  generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },

  // Хеширование строки
  hashString(str: string): string {
    return crypto.createHash('sha256').update(str).digest('hex');
  },

  // Генерация UUID
  generateUUID(): string {
    return crypto.randomUUID();
  },

  // Кодирование в Base64
  encodeBase64(str: string): string {
    return Buffer.from(str).toString('base64');
  },

  // Декодирование из Base64
  decodeBase64(base64: string): string {
    return Buffer.from(base64, 'base64').toString();
  },
};
