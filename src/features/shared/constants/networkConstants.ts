export const NETWORK_CONFIG = {
  // TON сети
  NETWORKS: {
    MAINNET: {
      ID: -239,
      NAME: 'mainnet',
      EXPLORER_URL: 'https://tonscan.org',
      API_URL: 'https://toncenter.com/api/v2',
    },
    TESTNET: {
      ID: -3,
      NAME: 'testnet',
      EXPLORER_URL: 'https://testnet.tonscan.org',
      API_URL: 'https://testnet.toncenter.com/api/v2',
    },
  },
  
  // Контракты
  CONTRACTS: {
    MIXTON: {
      MAINNET: 'EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c',
      TESTNET: 'EQB..............................................',
    },
    TOKEN: {
      MAINNET: 'EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c',
      TESTNET: 'EQB..............................................',
    },
  },
  
  // API эндпоинты
  API_ENDPOINTS: {
    MIXER: '/api/mixer',
    WALLET: '/api/wallet',
    ADMIN: '/api/admin',
    ANALYTICS: '/api/analytics',
  },
};
