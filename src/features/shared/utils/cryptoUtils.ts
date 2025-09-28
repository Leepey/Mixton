import crypto from 'crypto';

export const cryptoUtils = {
  // ��������� ���������� ID
  generateId(): string {
    return crypto.randomBytes(16).toString('hex');
  },

  // ��������� ��������� ������
  generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },

  // ����������� ������
  hashString(str: string): string {
    return crypto.createHash('sha256').update(str).digest('hex');
  },

  // ��������� UUID
  generateUUID(): string {
    return crypto.randomUUID();
  },

  // ����������� � Base64
  encodeBase64(str: string): string {
    return Buffer.from(str).toString('base64');
  },

  // ������������� �� Base64
  decodeBase64(base64: string): string {
    return Buffer.from(base64, 'base64').toString();
  },
};
