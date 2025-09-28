import { Address, Cell, Contract, ContractProvider, Sender, beginCell } from '@ton/core';

export class PoolContract implements Contract {
  constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

  static createFromAddress(address: Address) {
    return new PoolContract(address);
  }

  async getPoolInfo(provider: ContractProvider) {
    const result = await provider.get('get_pool_info', []);
    return {
      balance: result.stack.readNumber(),
      totalDeposits: result.stack.readNumber(),
      totalWithdrawals: result.stack.readNumber(),
      fee: result.stack.readNumber(),
    };
  }

  async deposit(provider: ContractProvider, via: Sender, amount: bigint) {
    await provider.internal(via, {
      value: amount,
      sendMode: 1,
      body: beginCell()
        .storeUint(0x12345678, 32) // deposit op
        .endCell(),
    });
  }
}
