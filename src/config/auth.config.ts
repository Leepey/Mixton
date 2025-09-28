import type { AuthConfiguration } from './types/config.types';

export const authConfig: AuthConfiguration = {
  sessionTimeout: parseInt(process.env.REACT_APP_AUTH_SESSION_TIMEOUT || '3600000'),
  maxLoginAttempts: parseInt(process.env.REACT_APP_AUTH_MAX_LOGIN_ATTEMPTS || '5'),
  tokenRefreshThreshold: parseInt(process.env.REACT_APP_AUTH_TOKEN_REFRESH_THRESHOLD || '300000'),
  providers: {
    wallet: process.env.REACT_APP_AUTH_ENABLE_WALLET !== 'false',
    email: process.env.REACT_APP_AUTH_ENABLE_EMAIL === 'true',
  },
};

// Вспомогательные функции для аутентификации
export const getSessionTimeout = (): number => {
  return authConfig.sessionTimeout;
};

export const getMaxLoginAttempts = (): number => {
  return authConfig.maxLoginAttempts;
};

export const getTokenRefreshThreshold = (): number => {
  return authConfig.tokenRefreshThreshold;
};

export const isWalletAuthEnabled = (): boolean => {
  return authConfig.providers.wallet;
};

export const isEmailAuthEnabled = (): boolean => {
  return authConfig.providers.email;
};

export const isAuthEnabled = (): boolean => {
  return isWalletAuthEnabled() || isEmailAuthEnabled();
};