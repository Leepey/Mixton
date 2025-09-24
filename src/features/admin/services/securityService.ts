import type { SecuritySettings } from '../types/admin.types';

export const securityService = {
  getSecuritySettings: async (): Promise<SecuritySettings> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          blacklist: [
            'EQD1234567890abcdef1234567890abcdef12345678',
            'EQDabcdef1234567890abcdef1234567890abcdef12',
          ],
          signers: [
            'EQD11111111111111111111111111111111111111111',
            'EQD22222222222222222222222222222222222222222',
            'EQD33333333333333333333333333333333333333333',
          ],
          requiredSignatures: 2,
          maxRetries: 3,
          autoProcess: true,
          auditLogging: true,
        });
      }, 500);
    });
  },

  updateSecuritySettings: async (settings: SecuritySettings): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 300);
    });
  },

  addToBlacklist: async (address: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 300);
    });
  },

  removeFromBlacklist: async (address: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 300);
    });
  },

  addSigner: async (address: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 300);
    });
  },

  removeSigner: async (address: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 300);
    });
  },
};