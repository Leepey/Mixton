export const APP_CONFIG = {
  NAME: 'Mixton',
  VERSION: '2.3.1',
  DESCRIPTION: 'Decentralized TON mixer with enhanced privacy',
} as const;

export const ROUTES = {
  HOME: '/',
  MIXER: '/mixer',
  DASHBOARD: '/dashboard',
  WALLET: '/wallet',
  HISTORY: '/history',
  SETTINGS: '/settings',
  PROFILE: '/profile',
  ADMIN: '/admin',
} as const;

export const STORAGE_KEYS = {
  TOKEN: 'mixton_token',
  THEME: 'mixton_theme',
  LANGUAGE: 'mixton_language',
  SETTINGS: 'mixton_settings',
} as const;