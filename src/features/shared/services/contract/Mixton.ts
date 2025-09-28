import { Address, Cell, Contract, ContractProvider, Sender, beginCell } from '@ton/core';

export class MixtonContract implements Contract {
  static readonly address: Address = Address.parse('EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c');
  
  constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

  static createFromAddress(address: Address) {
    return new MixtonContract(address);
  }

  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      value,
      sendMode: 1,
      body: beginCell().endCell(),
    });
  }

  async getMixingInfo(provider: ContractProvider) {
    const result = await provider.get('get_mixing_info', []);
    return {
      totalPools: result.stack.readNumber(),
      totalMixed: result.stack.readNumber(),
      totalVolume: result.stack.readNumber(),
    };
  }
}
