import type { SharedConfiguration } from './types/config.types';

export const sharedConfig: SharedConfiguration = {
  features: {
    adminPanel: process.env.REACT_APP_ENABLE_ADMIN_PANEL === 'true',
    analytics: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
    notifications: process.env.REACT_APP_ENABLE_NOTIFICATIONS === 'true',
  },
  performance: {
    enableCaching: process.env.REACT_APP_ENABLE_CACHING !== 'false',
    cacheTimeout: parseInt(process.env.REACT_APP_CACHE_TIMEOUT || '300000'),
  },
  security: {
    enableCSP: process.env.REACT_APP_ENABLE_CSP === 'true',
    maxSessionAge: parseInt(process.env.REACT_APP_MAX_SESSION_AGE || '86400000'),
  },
};