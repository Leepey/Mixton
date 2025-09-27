// src/features/shared/constants/contractConstants.ts
export const CONTRACT_OPERATIONS = {
  DEPOSIT: '0x6465706f',
  WITHDRAW: '0x695f7764',
  MULTI_WITHDRAW: '0x6d756c77',
  PROCESS_QUEUE: '0x70726f63',
} as const;

export const CONTRACT_ERRORS = {
  UNAUTHORIZED: 401,
  INVALID_AMOUNT: 402,
  INSUFFICIENT_BALANCE: 403,
} as const;