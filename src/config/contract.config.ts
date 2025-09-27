import type { ContractConfiguration } from './types/config.types';

export const contractConfig: ContractConfiguration = {
  address: process.env.REACT_APP_CONTRACT_ADDRESS || 'EQD...contract_address',
  operationCodes: {
    deposit: 0x6465706f,        // 'depo'
    withdraw: 0x695f7764,     // 'i_wd'
    mix: 0x6d697800,           // 'mix\x00'
    emergencyWithdraw: 0x656d657267, // 'emerg'
    updateSettings: 0x75706473, // 'upds'
  },
  gasLimits: {
    deposit: parseInt(process.env.REACT_APP_GAS_LIMIT_DEPOSIT || '1000000'),
    withdraw: parseInt(process.env.REACT_APP_GAS_LIMIT_WITHDRAW || '1500000'),
    mix: parseInt(process.env.REACT_APP_GAS_LIMIT_MIX || '2000000'),
    emergencyWithdraw: parseInt(process.env.REACT_APP_GAS_LIMIT_EMERGENCY || '1000000'),
    updateSettings: parseInt(process.env.REACT_APP_GAS_LIMIT_UPDATE_SETTINGS || '500000'),
  },
  fees: {
    basic: parseFloat(process.env.REACT_APP_FEE_BASIC || '0.003'),
    standard: parseFloat(process.env.REACT_APP_FEE_STANDARD || '0.005'),
    premium: parseFloat(process.env.REACT_APP_FEE_PREMIUM || '0.01'),
  },
};

// Вспомогательные функции для работы с контрактами
export const getOperationCode = (operation: keyof ContractConfiguration['operationCodes']): number => {
  return contractConfig.operationCodes[operation];
};

export const getGasLimit = (operation: keyof ContractConfiguration['gasLimits']): number => {
  return contractConfig.gasLimits[operation];
};

export const getFeeByPool = (poolType: keyof ContractConfiguration['fees']): number => {
  return contractConfig.fees[poolType];
};

export const getContractAddress = (): string => {
  return contractConfig.address;
};