// src/services/contract/MixerContractService.ts
import { Address, toNano, fromNano, type Sender, beginCell, SendMode } from '@ton/core';
import { TonClient4 } from '@ton/ton';
import type { PoolType, PoolFeeRates, ContractLimits, PoolDelays, BasicStats, DepositPoolInfo, QueueItem, QueueStatus } from '../../types/ton';
export class MixerContractService {
  private client: TonClient4;
  private lastSuccessfulBalance: string = '0';
  private network: 'mainnet' | 'testnet';
  
  constructor(network: 'mainnet' | 'testnet') {
    this.network = network;
    const endpoint = network === 'mainnet' 
      ? 'https://mainnet-v4.tonhubapi.com'
      : 'https://testnet-v4.tonhubapi.com';
    
    this.client = new TonClient4({ 
      endpoint,
      timeout: 15000
    });
  }

  async getContractBalance(contractAddress: Address): Promise<string> {
    try {
      console.log('Getting contract balance via TonClient4 for:', contractAddress.toString());
      const lastBlock = await this.client.getLastBlock();
      const account = await this.client.getAccount(lastBlock.last.seqno, contractAddress);
      
      const balance = fromNano(account.account.balance.coins);
      console.log('Contract balance via TonClient4:', balance);
      
      this.lastSuccessfulBalance = balance;
      return balance;
    } catch (error) {
      console.error('Error getting contract balance via TonClient4:', error);
      
      if (this.lastSuccessfulBalance !== '0') {
        console.log('Using cached balance:', this.lastSuccessfulBalance);
        return this.lastSuccessfulBalance;
      }
      
      throw new Error('Failed to get contract balance');
    }
  }

  async sendDepositWithPool(
    contractAddress: Address,
    amount: string,
    poolType: PoolType,
    sender: Sender
  ): Promise<string> {
    try {
      const messageBody = beginCell()
        .storeUint(0x6465706f, 32) // OP_DEPOSIT = 0x6465706f
        .endCell();
      
      await sender.send({
        to: contractAddress,
        value: toNano(amount),
        body: messageBody,
        sendMode: SendMode.PAY_GAS_SEPARATELY
      });
      
      return `deposit_${Date.now()}`;
    } catch (error) {
      console.error('Error sending deposit with pool:', error);
      throw new Error('Failed to send deposit with pool');
    }
  }

  // Обновленный метод вывода средств согласно схеме контракта
  async sendWithdraw(
    contractAddress: Address,
    recipient: Address,
    amount: string,
    depositId: number,
    feeRate: number,
    delay: number,
    sender: Sender
  ): Promise<string> {
    try {
      const messageBody = beginCell()
        .storeUint(0x695f7764, 32) // OP_WITHDRAW = 0x695f7764
        .storeAddress(recipient)
        .storeCoins(toNano(amount))
        .storeUint(depositId, 64) // depositId
        .storeUint(feeRate, 16) // feeRate (в сотых долях процента)
        .storeUint(delay, 64) // delay (в секундах)
        .endCell();
      
      await sender.send({
        to: contractAddress,
        value: toNano('0.15'),
        body: messageBody,
        sendMode: SendMode.PAY_GAS_SEPARATELY
      });
      
      return `withdraw_${Date.now()}`;
    } catch (error) {
      console.error('Error sending withdrawal:', error);
      throw new Error('Failed to send withdrawal');
    }
  }

  // Новый метод для множественного вывода
// src/services/contract/MixerContractService.ts

// Исправленный метод sendMultiWithdraw
async sendMultiWithdraw(
  contractAddress: Address,
  withdrawals: Array<{
    recipient: Address;
    amount: string;
    feeRate: number;
    delay: number;
  }>,
  depositId: number,
  sender: Sender
): Promise<string> {
  try {
    const withdrawalsCount = withdrawals.length;
    if (withdrawalsCount < 1 || withdrawalsCount > 4) {
      throw new Error('Number of withdrawals must be between 1 and 4');
    }
    
    const messageBody = beginCell()
      .storeUint(0x6d756c77, 32) // OP_MULTI_WITHDRAW = 0x6d756c77
      .storeUint(withdrawalsCount, 8) // Количество выводов
      .storeUint(depositId, 64); // ID депозита
    
    // Добавляем каждый вывод
    for (const withdrawal of withdrawals) {
      messageBody
        .storeAddress(withdrawal.recipient)
        .storeCoins(toNano(withdrawal.amount))
        .storeUint(withdrawal.feeRate, 16) // feeRate (в сотых долях процента)
        .storeUint(withdrawal.delay, 64); // delay (в секундах)
    }
    
    // Завершаем построение ячейки перед отправкой
    const messageBodyCell = messageBody.endCell();
    
    await sender.send({
      to: contractAddress,
      value: toNano('0.2'),
      body: messageBodyCell, // Используем готовую ячейку
      sendMode: SendMode.PAY_GAS_SEPARATELY
    });
    
    return `multi_withdraw_${Date.now()}`;
  } catch (error) {
    console.error('Error sending multi-withdrawal:', error);
    throw new Error('Failed to send multi-withdrawal');
  }
}

  // Обновленный метод обработки очереди согласно схеме контракта
  async sendProcessQueue(
    contractAddress: Address,
    queueItemId: number,
    sender: Sender
  ): Promise<string> {
    try {
      const messageBody = beginCell()
        .storeUint(0x70726f63, 32) // OP_PROCESS_QUEUE = 0x70726f63
        .storeUint(queueItemId, 64) // ID элемента очереди
        .endCell();
      
      await sender.send({
        to: contractAddress,
        value: toNano('0.05'),
        body: messageBody,
        sendMode: SendMode.PAY_GAS_SEPARATELY
      });
      
      return `process_queue_${Date.now()}`;
    } catch (error) {
      console.error('Error processing queue:', error);
      throw new Error('Failed to process queue');
    }
  }

  async getContractState(contractAddress: Address) {
    try {
      const lastBlock = await this.client.getLastBlock();
      const account = await this.client.getAccount(lastBlock.last.seqno, contractAddress);
      
      return {
        balance: fromNano(account.account.balance.coins),
        state: account.account.state,
        lastTransactionLt: account.account.last?.lt,
        lastTransactionHash: account.account.last?.hash
      };
    } catch (error) {
      console.error('Error getting contract state:', error);
      throw new Error('Failed to get contract state');
    }
  }

  // Исправленные методы для работы с get-методами через TonClient4
  async getFeeRates(contractAddress: Address): Promise<PoolFeeRates> {
    try {
      const lastBlock = await this.client.getLastBlock();
      const result = await this.client.runMethod(lastBlock.last.seqno, contractAddress, 'get_fee_rates', []);
      
      // Используем reader для чтения результатов
      const reader = result.reader;
      return {
        basicRate: reader.readNumber(),
        standardRate: reader.readNumber(),
        premiumRate: reader.readNumber()
      };
    } catch (error) {
      console.error('Error getting fee rates:', error);
      throw new Error('Failed to get fee rates');
    }
  }
  
  async getLimits(contractAddress: Address): Promise<ContractLimits> {
    try {
      const lastBlock = await this.client.getLastBlock();
      const result = await this.client.runMethod(lastBlock.last.seqno, contractAddress, 'get_limits', []);
      
      const reader = result.reader;
      return {
        minDeposit: reader.readBigNumber(),
        maxDeposit: reader.readBigNumber(),
        minWithdraw: reader.readBigNumber()
      };
    } catch (error) {
      console.error('Error getting limits:', error);
      throw new Error('Failed to get limits');
    }
  }
  
  async getDelays(contractAddress: Address): Promise<PoolDelays> {
    try {
      const lastBlock = await this.client.getLastBlock();
      const result = await this.client.runMethod(lastBlock.last.seqno, contractAddress, 'get_delays', []);
      
      const reader = result.reader;
      return {
        basicDelay: reader.readNumber(),
        standardDelay: reader.readNumber(),
        premiumDelay: reader.readNumber()
      };
    } catch (error) {
      console.error('Error getting delays:', error);
      throw new Error('Failed to get delays');
    }
  }
  
  async getBasicStats(contractAddress: Address): Promise<BasicStats> {
    try {
      const lastBlock = await this.client.getLastBlock();
      const result = await this.client.runMethod(lastBlock.last.seqno, contractAddress, 'get_basic_stats', []);
      
      const reader = result.reader;
      return {
        totalDeposits: reader.readNumber(),
        totalWithdrawn: reader.readNumber()
      };
    } catch (error) {
      console.error('Error getting basic stats:', error);
      throw new Error('Failed to get basic stats');
    }
  }
  
  async getDepositPoolInfo(contractAddress: Address, depositId: bigint): Promise<DepositPoolInfo | null> {
    try {
      const lastBlock = await this.client.getLastBlock();
      const result = await this.client.runMethod(lastBlock.last.seqno, contractAddress, 'get_deposit_pool_info', [
        { type: 'int', value: depositId }
      ]);
      
      const reader = result.reader;
      const pool = reader.readNumber();
      const status = reader.readNumber();
      
      return {
        pool: pool as PoolType,
        status
      };
    } catch (error) {
      console.error('Error getting deposit pool info:', error);
      return null;
    }
  }
  
  async getLastDepositId(contractAddress: Address): Promise<bigint> {
    try {
      const lastBlock = await this.client.getLastBlock();
      const result = await this.client.runMethod(lastBlock.last.seqno, contractAddress, 'get_last_deposit_id', []);
      
      const reader = result.reader;
      return reader.readBigNumber();
    } catch (error) {
      console.error('Error getting last deposit id:', error);
      throw new Error('Failed to get last deposit id');
    }
  }
  
  async getAdmin(contractAddress: Address): Promise<Address> {
    try {
      const lastBlock = await this.client.getLastBlock();
      const result = await this.client.runMethod(lastBlock.last.seqno, contractAddress, 'get_admin', []);
      
      const reader = result.reader;
      return reader.readAddress();
    } catch (error) {
      console.error('Error getting admin:', error);
      throw new Error('Failed to get admin');
    }
  }
  
  async isAddressBlacklistedSimple(contractAddress: Address, address: Address): Promise<boolean> {
    try {
      const lastBlock = await this.client.getLastBlock();
      const result = await this.client.runMethod(lastBlock.last.seqno, contractAddress, 'is_address_blacklisted_simple', [
        { type: 'slice', cell: beginCell().storeAddress(address).endCell() }
      ]);
      
      const reader = result.reader;
      return reader.readBoolean();
    } catch (error) {
      console.error('Error checking blacklist:', error);
      throw new Error('Failed to check blacklist');
    }
  }
  
  // Новые методы для работы с очередью
  
  async getNextQueueItemId(contractAddress: Address): Promise<number> {
    try {
      const lastBlock = await this.client.getLastBlock();
      const result = await this.client.runMethod(lastBlock.last.seqno, contractAddress, 'get_next_queue_item_id', []);
      
      const reader = result.reader;
      return reader.readNumber();
    } catch (error) {
      console.error('Error getting next queue item id:', error);
      throw new Error('Failed to get next queue item id');
    }
  }
  
  async getMinNextTime(contractAddress: Address): Promise<number> {
    try {
      const lastBlock = await this.client.getLastBlock();
      const result = await this.client.runMethod(lastBlock.last.seqno, contractAddress, 'get_min_next_time', []);
      
      const reader = result.reader;
      return reader.readNumber();
    } catch (error) {
      console.error('Error getting min next time:', error);
      throw new Error('Failed to get min next time');
    }
  }
  
  async getQueueDetails(contractAddress: Address): Promise<{ length: number; totalAmount: number; nextTime: number }> {
    try {
      const lastBlock = await this.client.getLastBlock();
      const result = await this.client.runMethod(lastBlock.last.seqno, contractAddress, 'get_queue_details', []);
      
      const reader = result.reader;
      return {
        length: reader.readNumber(),
        totalAmount: reader.readNumber(),
        nextTime: reader.readNumber()
      };
    } catch (error) {
      console.error('Error getting queue details:', error);
      throw new Error('Failed to get queue details');
    }
  }
  
  async getQueueStatus(contractAddress: Address): Promise<QueueStatus> {
    try {
      const lastBlock = await this.client.getLastBlock();
      const result = await this.client.runMethod(lastBlock.last.seqno, contractAddress, 'get_queue_status', []);
      
      const reader = result.reader;
      return reader.readNumber() as QueueStatus;
    } catch (error) {
      console.error('Error getting queue status:', error);
      throw new Error('Failed to get queue status');
    }
  }
  
  async getCurrentFeeRate(contractAddress: Address): Promise<number> {
    try {
      const lastBlock = await this.client.getLastBlock();
      const result = await this.client.runMethod(lastBlock.last.seqno, contractAddress, 'get_current_fee_rate', []);
      
      const reader = result.reader;
      return reader.readNumber();
    } catch (error) {
      console.error('Error getting current fee rate:', error);
      throw new Error('Failed to get current fee rate');
    }
  }
  
  async getMixerParams(contractAddress: Address): Promise<{ minFee: number; maxFee: number; minDelay: number; maxDelay: number }> {
    try {
      const lastBlock = await this.client.getLastBlock();
      const result = await this.client.runMethod(lastBlock.last.seqno, contractAddress, 'get_mixer_params', []);
      
      const reader = result.reader;
      return {
        minFee: reader.readNumber(),
        maxFee: reader.readNumber(),
        minDelay: reader.readNumber(),
        maxDelay: reader.readNumber()
      };
    } catch (error) {
      console.error('Error getting mixer params:', error);
      throw new Error('Failed to get mixer params');
    }
  }
  
  async getSigners(contractAddress: Address): Promise<{ count: number; required: number }> {
    try {
      const lastBlock = await this.client.getLastBlock();
      const result = await this.client.runMethod(lastBlock.last.seqno, contractAddress, 'get_signers', []);
      
      const reader = result.reader;
      return {
        count: reader.readNumber(),
        required: reader.readNumber()
      };
    } catch (error) {
      console.error('Error getting signers:', error);
      throw new Error('Failed to get signers');
    }
  }
  
  async isAdmin(contractAddress: Address, addr: Address): Promise<boolean> {
    try {
      const lastBlock = await this.client.getLastBlock();
      const result = await this.client.runMethod(lastBlock.last.seqno, contractAddress, 'is_admin', [
        { type: 'slice', cell: beginCell().storeAddress(addr).endCell() }
      ]);
      
      const reader = result.reader;
      return reader.readBoolean();
    } catch (error) {
      console.error('Error checking admin rights:', error);
      throw new Error('Failed to check admin rights');
    }
  }
}