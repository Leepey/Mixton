// src/app/config/tonConfig.ts
export const tonConfig = {
  network: 'mainnet', // или 'testnet'
  endpoints: {
    mainnet: 'https://toncenter.com/api/v2',
    testnet: 'https://testnet.toncenter.com/api/v2',
  },
};

// src/app/config/contractConfig.ts
export const contractConfig = {
  address: 'EQD...contract_address',
  operationCodes: {
    deposit: 0x6465706f,
    withdraw: 0x695f7764,
  },
};

// src/app/config/apiConfig.ts
export const apiConfig = {
  baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001',
  timeout: 10000,
};