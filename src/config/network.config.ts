export const networkConfig = {
  // Mainnet configuration
  mainnet: {
    endpoint: 'https://toncenter.com/api/v2/jsonRPC',
    apiKey: process.env.TON_MAINNET_API_KEY,
    mixtonContractAddress: process.env.MIXTON_MAINNET_ADDRESS,
  },
  
  // Testnet configuration
  testnet: {
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
    apiKey: process.env.TON_TESTNET_API_KEY,
    mixtonContractAddress: process.env.MIXTON_TESTNET_ADDRESS,
  },
  
  // Current network (mainnet or testnet)
  current: process.env.NODE_ENV === 'production' ? 'mainnet' : 'testnet',
};
