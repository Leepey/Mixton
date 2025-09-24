// src/services/contract/wrappers/Mixton.ts
import { Address, Cell, contractAddress, SendMode, beginCell, Dictionary, toNano } from '@ton/core';
import type { Contract, ContractProvider, Sender } from '@ton/core';
import type { 
  PoolType, 
  PoolFeeRates, 
  ContractLimits, 
  PoolDelays, 
  BasicStats, 
  DepositPoolInfo,
  QueueStatus,
  QueueDetails,
  MixerParams,
  SignersInfo
} from '../../../types/ton';

export type MixtonConfig = {
    admin: Address;
    feeRateBasic: number;
    feeRateStandard: number;
    feeRatePremium: number;
};

export function mixtonConfigToCell(config: MixtonConfig): Cell {
    return beginCell()
        .storeAddress(config.admin)
        .storeUint(config.feeRateBasic, 32)
        .storeUint(config.feeRateStandard, 32)
        .storeUint(config.feeRatePremium, 32)
        .storeDict(Dictionary.empty())
        .storeDict(Dictionary.empty())
        .storeDict(Dictionary.empty())
        .endCell();
}

export class Mixton implements Contract {
    readonly address: Address;
    readonly init?: { code: Cell; data: Cell };
    
    constructor(address: Address, init?: { code: Cell; data: Cell }) {
        this.address = address;
        this.init = init;
    }
    
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
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
    
    // Обновленный метод для депозита
    async sendDeposit(
        provider: ContractProvider,
        via: Sender,
        value: bigint
    ) {
        const messageBody = beginCell()
            .storeUint(0x6465706f, 32) // OP_DEPOSIT = 0x6465706f
            .endCell();
        
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: messageBody,
        });
    }
    
    // Обновленный метод для вывода средств
    async sendWithdraw(
        provider: ContractProvider,
        via: Sender,
        recipient: Address,
        amount: bigint,
        depositId: number,
        feeRate: number,
        delay: number,
        value: bigint = toNano('0.15')
    ) {
        const messageBody = beginCell()
            .storeUint(0x695f7764, 32) // OP_WITHDRAW = 0x695f7764
            .storeAddress(recipient)
            .storeCoins(amount)
            .storeUint(depositId, 64) // depositId
            .storeUint(feeRate, 16) // feeRate (в сотых долях процента)
            .storeUint(delay, 64) // delay (в секундах)
            .endCell();
        
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: messageBody,
        });
    }
    
    // Новый метод для множественного вывода
    async sendMultiWithdraw(
        provider: ContractProvider,
        via: Sender,
        withdrawals: Array<{
            recipient: Address;
            amount: bigint;
            feeRate: number;
            delay: number;
        }>,
        depositId: number,
        value: bigint = toNano('0.2')
    ) {
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
                .storeCoins(withdrawal.amount)
                .storeUint(withdrawal.feeRate, 16) // feeRate (в сотых долях процента)
                .storeUint(withdrawal.delay, 64); // delay (в секундах)
        }
        
        // Завершаем построение ячейки перед отправкой
        const messageBodyCell = messageBody.endCell();
        
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: messageBodyCell,
        });
    }
    
    // Обновленный метод для обработки очереди
    async sendProcessQueue(
        provider: ContractProvider,
        via: Sender,
        queueItemId: number,
        value: bigint = toNano('0.05')
    ) {
        const messageBody = beginCell()
            .storeUint(0x70726f63, 32) // OP_PROCESS_QUEUE = 0x70726f63
            .storeUint(queueItemId, 64) // ID элемента очереди
            .endCell();
        
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: messageBody,
        });
    }
    
    // Get-методы
    
    async getAdmin(provider: ContractProvider): Promise<Address> {
        const result = await provider.get('get_admin', []);
        return result.stack.readAddress();
    }
    
    async getFeeRates(provider: ContractProvider): Promise<PoolFeeRates> {
        const result = await provider.get('get_fee_rates', []);
        return {
            basicRate: result.stack.readNumber(),
            standardRate: result.stack.readNumber(),
            premiumRate: result.stack.readNumber()
        };
    }
    
    async getLimits(provider: ContractProvider): Promise<ContractLimits> {
        const result = await provider.get('get_limits', []);
        return {
            minDeposit: result.stack.readBigNumber(),
            maxDeposit: result.stack.readBigNumber(),
            minWithdraw: result.stack.readBigNumber()
        };
    }
    
    async getDelays(provider: ContractProvider): Promise<PoolDelays> {
        const result = await provider.get('get_delays', []);
        return {
            basicDelay: result.stack.readNumber(),
            standardDelay: result.stack.readNumber(),
            premiumDelay: result.stack.readNumber()
        };
    }
    
    async getBasicStats(provider: ContractProvider): Promise<BasicStats> {
        const result = await provider.get('get_basic_stats', []);
        return {
            totalDeposits: result.stack.readNumber(),
            totalWithdrawn: result.stack.readNumber()
        };
    }
    
    async getDepositPoolInfo(provider: ContractProvider, depositId: bigint): Promise<DepositPoolInfo | null> {
        try {
            const result = await provider.get('get_deposit_pool_info', [
                { type: 'int', value: depositId }
            ]);
            
            const pool = result.stack.readNumber();
            const status = result.stack.readNumber();
            
            return {
                pool: pool as PoolType,
                status
            };
        } catch (error) {
            console.error('Error getting deposit pool info:', error);
            return null;
        }
    }
    
    async getLastDepositId(provider: ContractProvider): Promise<bigint> {
        const result = await provider.get('get_last_deposit_id', []);
        return result.stack.readBigNumber();
    }
    
    async isAddressBlacklistedSimple(provider: ContractProvider, address: Address): Promise<boolean> {
        const result = await provider.get('is_address_blacklisted_simple', [
            { type: 'slice', cell: beginCell().storeAddress(address).endCell() }
        ]);
        return result.stack.readBoolean();
    }
    
    async getBalance(provider: ContractProvider): Promise<bigint> {
        const state = await provider.getState();
        return state.balance;
    }
    
    // Новые get-методы для работы с очередью
    
    async getNextQueueItemId(provider: ContractProvider): Promise<number> {
        const result = await provider.get('get_next_queue_item_id', []);
        return result.stack.readNumber();
    }
    
    async getMinNextTime(provider: ContractProvider): Promise<number> {
        const result = await provider.get('get_min_next_time', []);
        return result.stack.readNumber();
    }
    
    async getQueueDetails(provider: ContractProvider): Promise<QueueDetails> {
        const result = await provider.get('get_queue_details', []);
        return {
            length: result.stack.readNumber(),
            totalAmount: result.stack.readNumber(),
            nextTime: result.stack.readNumber()
        };
    }
    
    async getQueueStatus(provider: ContractProvider): Promise<QueueStatus> {
        const result = await provider.get('get_queue_status', []);
        return result.stack.readNumber() as QueueStatus;
    }
    
    async getCurrentFeeRate(provider: ContractProvider): Promise<number> {
        const result = await provider.get('get_current_fee_rate', []);
        return result.stack.readNumber();
    }
    
    async getMixerParams(provider: ContractProvider): Promise<MixerParams> {
        const result = await provider.get('get_mixer_params', []);
        return {
            minFee: result.stack.readNumber(),
            maxFee: result.stack.readNumber(),
            minDelay: result.stack.readNumber(),
            maxDelay: result.stack.readNumber()
        };
    }
    
    async getSigners(provider: ContractProvider): Promise<SignersInfo> {
        const result = await provider.get('get_signers', []);
        return {
            count: result.stack.readNumber(),
            required: result.stack.readNumber()
        };
    }
    
    async isAdmin(provider: ContractProvider, addr: Address): Promise<boolean> {
        const result = await provider.get('is_admin', [
            { type: 'slice', cell: beginCell().storeAddress(addr).endCell() }
        ]);
        return result.stack.readBoolean();
    }
}