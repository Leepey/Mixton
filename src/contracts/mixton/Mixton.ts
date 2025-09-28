import { Address, Cell, Contract, beginCell, contractAddress, ContractProvider, Sender, toNano } from '@ton/core';

export interface MixtonConfig {
  owner: Address;
  fee: bigint;
  minAmount: bigint;
  maxAmount: bigint;
}

export function mixtonConfigToCell(config: MixtonConfig): Cell {
  return beginCell()
    .storeAddress(config.owner)
    .storeCoins(config.fee)
    .storeCoins(config.minAmount)
    .storeCoins(config.maxAmount)
    .endCell();
}

export class Mixton implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell }
  ) {}

  static createFromAddress(address: Address) {
    return new Mixton(address);
  }

  static createFromConfig(config: MixtonConfig, code: Cell, workchain = 0) {
    const data = mixtonConfigToCell(config);
    const init = { code, data };
    return new Mixton(contractAddress(workchain, init), init);
  }

  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      value,
      sendMode: 1, // pay all fees and transfer value
      body: beginCell().endCell(),
    });
  }

  async sendMix(
    provider: ContractProvider,
    via: Sender,
    opts: {
      value: bigint;
      amount: bigint;
      queryId?: number;
    }
  ) {
    await provider.internal(via, {
      value: opts.value,
      sendMode: 1,
      body: beginCell()
        .storeUint(0x1, 32) // mix operation
        .storeUint(opts.queryId ?? 0, 64)
        .storeCoins(opts.amount)
        .endCell(),
    });
  }

  async getMixtonData(provider: ContractProvider) {
    const { stack } = await provider.get('get_mixton_data', []);
    return {
      owner: stack.readAddress(),
      fee: stack.readBigNumber(),
      minAmount: stack.readBigNumber(),
      maxAmount: stack.readBigNumber(),
    };
  }
}
