import { Address, Cell, Contract, ContractProvider, Sender, beginCell } from '@ton/core';

export class TokenContract implements Contract {
  constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

  static createFromAddress(address: Address) {
    return new TokenContract(address);
  }

  async getBalance(provider: ContractProvider) {
    const result = await provider.get('get_balance', []);
    return result.stack.readNumber();
  }

  async transfer(provider: ContractProvider, via: Sender, to: Address, amount: bigint) {
    await provider.internal(via, {
      value: amount,
      sendMode: 1,
      body: beginCell()
        .storeUint(0xf8a7ea5, 32) // transfer op
        .storeAddress(to)
        .storeCoins(amount)
        .endCell(),
    });
  }
}
