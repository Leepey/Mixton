export const appConfig = {
  name: 'Mixton',
  version: '2.3.1',
  description: 'Decentralized TON mixer with enhanced privacy',
  author: 'Mixton Team',
  debug: process.env.NODE_ENV === 'development',
  features: {
    mixer: true,
    dashboard: true,
    wallet: true,
    admin: true,
  },
  theme: {
    default: 'light',
    supported: ['light', 'dark'],
  },
  language: {
    default: 'en',
    supported: ['en', 'ru', 'zh'],
  },
};
