import { compile } from '@ton/blueprint';
import { Address, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode, toNano, beginCell, Dictionary, Slice, ExternalAddress } from '@ton/core';

export interface MixtonConfig {
    admin: Address;
}

// Константы из TOLK-контракта
export const MIN_FEE_RATE = 100;          // 1%
export const MAX_FEE_RATE = 500;          // 5%
export const MIN_DELAY = 30;              // 30 секунд
export const MAX_DELAY = 259200;          // 3 дня
export const MIN_DEPOSIT_AMOUNT = 1000000000;    // 1 TON
export const MAX_DEPOSIT_AMOUNT = 10000000000000; // 10000 TON
export const MIN_WITHDRAW_AMOUNT = 500000000;    // 0.5 TON
export const MAX_PARTS = 4;                    // Максимальное количество частей
export const WITHDRAW_TIMEOUT = 604800;        // 7 дней
export const MAX_QUEUE_SIZE = 1000;           // Максимальный размер очереди
export const GAS_RESERVE = 5000000;          // Резерв газа
export const MAX_BATCH_SIZE = 5;              // Максимальный размер пакета обработки
export const MIN_GAS_PER_ITEM = 3000000;      // Минимальный газ на один элемент
export const BASE_GAS_COST = 10000000;        // Базовая стоимость операции
export const PER_ITEM_GAS_COST = 5000000;     // Стоимость на один элемент очереди

export const OP_DEPOSIT = 0x6465706f;
export const OP_WITHDRAW = 0x695f7764;
export const OP_MULTI_WITHDRAW = 0x6d756c77;
export const OP_EMERGENCY_WITHDRAW = 0x656d7764;
export const OP_ADD_BLACKLIST = 0x61646462;
export const OP_REMOVE_BLACKLIST = 0x72656d62;
export const OP_PROCESS_QUEUE = 0x70726f63; // ДОБАВЛЕНО ЭКСПОРТ

// Коды ошибок
export const ERROR_UNAUTHORIZED = 403;
export const ERROR_INVALID_AMOUNT = 400;
export const ERROR_INSUFFICIENT_BALANCE = 401;
export const ERROR_AMOUNT_TOO_LARGE = 402;
export const ERROR_AMOUNT_TOO_SMALL = 404;
export const ERROR_ADDRESS_BLACKLISTED = 406;
export const ERROR_DEPOSIT_NOT_FOUND = 407;
export const ERROR_WITHDRAWAL_TIMEOUT = 408;
export const ERROR_INVALID_ADDRESS = 409;
export const ERROR_TOO_MANY_WITHDRAWALS = 410;
export const ERROR_INVALID_FEE_RATE = 411;
export const ERROR_INVALID_DELAY = 412;
export const ERROR_QUEUE_FULL = 413;

export function mixtonConfigToCell(config: MixtonConfig): Cell {
    return beginCell()
        .storeAddress(config.admin)
        .storeDict(null) // deposits_dict
        .storeDict(null) // withdrawal_queue_dict
        .storeDict(null) // blacklist_dict
        .storeUint(0, 32) // total_deposits
        .storeUint(0, 64) // total_withdrawn
        .storeUint(0, 32) // next_deposit_id
        .storeUint(0, 32) // next_queue_id
        .storeUint(0, 1) // initialized
        // Новые поля v2.0
        .storeUint(100, 32) // current_fee_rate (1%)
        .storeDict(null) // signers_dict
        .storeUint(1, 8) // required_signatures
        .storeUint(1000000, 64) // oracle_data (1 TON = 1 USD)
        .storeUint(0, 64) // last_oracle_update
        .storeDict(null) // transaction_history
        .storeUint(0, 32) // next_history_id
        // Новые поля v2.1
        .storeUint(0, 64) // last_processed_time
        .storeUint(0, 32) // failed_transactions
        // Новые поля v2.3
        .storeDict(null) // queue_processing_stats
        .storeUint(0, 64) // last_queue_check
        .storeUint(0, 64) // global_time
        .endCell();
}

function isInternalAddress(address: Address | ExternalAddress | null | undefined): address is Address {
    return address !== null && address !== undefined && address instanceof Address;
}

function addressesEqual(addr1: Address | ExternalAddress | null | undefined, addr2: Address | ExternalAddress | null | undefined): boolean {
    if (!isInternalAddress(addr1) || !isInternalAddress(addr2)) {
        return false;
    }
    return addr1.toString() === addr2.toString();
}

export interface WithdrawalRequest {
    recipient: Address;
    amount: bigint;
    feeRate: number;
    delay: number;
}

export interface MultiWithdrawalRequest {
    withdrawals: WithdrawalRequest[];
    depositId: bigint;
}

export interface BasicStats {
    totalDeposits: number;
    totalWithdrawn: bigint;
}

export interface DepositInfo {
    depositTime: number;
    delay: number;
    status: number;
}

export interface QueueInfo {
    queueLength: number;
    totalAmount: bigint;
}

export interface MixerParams {
    minFeeRate: number;
    maxFeeRate: number;
    minDelay: number;
    maxDelay: number;
}

export interface ContractLimits {
    minDeposit: bigint;
    maxDeposit: bigint;
    minWithdraw: bigint;
}

export interface QueueStatus {
    status: number;
    nextTime: number;
}

// Новые интерфейсы v2.0
export interface QueueDetails {
    queueLength: number;
    totalAmount: bigint;
    nextTime: number;
}

export interface SignerInfo {
    count: number;
    required: number;
}

export interface OracleData {
    data: number;
    lastUpdate: number;
}

export interface TransactionRecord {
    txType: number; // 0 - депозит, 1 - вывод, 2 - комиссия
    address: Address;
    amount: bigint;
    timestamp: number;
    feeRate: number;
    status: number; // 0 - ожидает, 1 - завершена, 2 - ошибка
}

export interface PerformanceStats {
    lastProcessedTime: number;
    failedTransactions: number;
    queueSize: number;
}

export interface ProcessQueueResult {
    success: boolean;
    processed: number;
}

// Упрощенный интерфейс для результата отправки сообщения
interface SendMessageResult {
    source: Address;
}

export class Mixton implements Contract {
    constructor(
        readonly address: Address,
        readonly init?: { code: Cell; data: Cell }
    ) {}

    static createFromAddress(address: Address) {
        return new Mixton(address);
    }

    static async fromInit(adminAddress: Address) {
        const config: MixtonConfig = {
            admin: adminAddress,
        };
        
        const code = await compile('Mixton');
        const data = mixtonConfigToCell(config);
        const init = { code, data };
        
        const address = contractAddress(0, init);
        
        return new Mixton(address, init);
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

    async sendInternal(provider: ContractProvider, via: Sender, args: { value: bigint; body: Cell; bounce?: boolean; sendMode?: number }) {
        await provider.internal(via, {
            value: args.value,
            sendMode: args.sendMode ?? SendMode.PAY_GAS_SEPARATELY,
            body: args.body,
            bounce: args.bounce ?? false
        });
    }

    async sendDeposit(provider: ContractProvider, via: Sender, value: bigint) {
        // ИСПРАВЛЕНО: Добавляем отладку
        console.log('Sending deposit with value:', value.toString());
        
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendWithdraw(
        provider: ContractProvider,
        via: Sender, 
        recipient: Address, 
        amount: bigint, 
        depositId: bigint,
        feeRate: number,
        delay: number,
        value: bigint = toNano('0.03')
    ) {
        // ИСПРАВЛЕНО: Проверяем, что depositId не отрицательный
        if (depositId < 0n) {
            throw new Error(`Invalid depositId: ${depositId}. Deposit ID cannot be negative.`);
        }
        
        const messageBody = beginCell()
            .storeUint(0x695f7764, 32) // op_withdraw
            .storeRef(beginCell().storeAddress(recipient).endCell())
            .storeCoins(amount)
            .storeUint(depositId, 64)
            .storeUint(feeRate, 32)
            .storeUint(delay, 32)
            .endCell();
    
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: messageBody,
        });
    }

    async sendMultiWithdraw(
        provider: ContractProvider,
        via: Sender, 
        request: MultiWithdrawalRequest,
        value: bigint = toNano('0.05')
    ) {
        if (request.withdrawals.length < 1 || request.withdrawals.length > MAX_PARTS) {
            throw new Error(`Invalid number of withdrawals: ${request.withdrawals.length}. Must be between 1 and ${MAX_PARTS}.`);
        }
        
        // ИСПРАВЛЕНО: Проверяем, что depositId не отрицательный
        if (request.depositId < 0n) {
            throw new Error(`Invalid depositId: ${request.depositId}. Deposit ID cannot be negative.`);
        }
        
        const messageBody = beginCell()
            .storeUint(0x6d756c77, 32) // op_multi_withdraw
            .storeUint(request.withdrawals.length, 8)
            .storeUint(request.depositId, 64);
    
        for (const withdrawal of request.withdrawals) {
            if (withdrawal.amount <= 0n) {
                throw new Error(`Invalid withdrawal amount: ${withdrawal.amount}`);
            }
            
            messageBody
                .storeRef(beginCell().storeAddress(withdrawal.recipient).endCell())
                .storeCoins(withdrawal.amount)
                .storeUint(withdrawal.feeRate, 32)
                .storeUint(withdrawal.delay, 32);
        }
        
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: messageBody.endCell(),
        });
    }

    // Исправленный метод sendProcessQueue
    async sendProcessQueue(
        provider: ContractProvider,
        via: Sender,
        queueItemId: bigint,
        value: bigint = toNano('0.05')
    ) {
        // ИСПРАВЛЕНО: Проверяем, что queueItemId не отрицательный
        if (queueItemId < 0n) {
            throw new Error(`Invalid queueItemId: ${queueItemId}. Queue item ID cannot be negative.`);
        }
        
        const messageBody = beginCell()
            .storeUint(OP_PROCESS_QUEUE, 32) // Используем экспортированную константу
            .storeUint(queueItemId, 64)
            .endCell();

        // ИСПРАВЛЕНО: Возвращаем результат вызова provider.internal
        const result = await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: messageBody,
        });
        
        return result;
    }

    // Вспомогательный метод для получения результата обработки очереди
    async getProcessQueueResult(
        provider: ContractProvider,
        sendResult: SendMessageResult
    ): Promise<ProcessQueueResult> {
        try {
            const queueInfoBefore = await this.getQueueInfo(provider);
            
            await new Promise(resolve => setTimeout(resolve, 100));
            
            const queueInfoAfter = await this.getQueueInfo(provider);
            
            const success = queueInfoAfter.queueLength < queueInfoBefore.queueLength;
            const processed = success ? (queueInfoBefore.queueLength - queueInfoAfter.queueLength) : 0;
            
            return { success, processed };
        } catch (error) {
            console.error('Error in getProcessQueueResult:', error);
            return { success: false, processed: 0 };
        }
    }

    async sendEmergencyWithdraw(
        provider: ContractProvider,
        via: Sender, 
        amount: bigint, 
        value: bigint = toNano('0.02')
    ) {
        const messageBody = beginCell()
            .storeUint(0x656d7764, 32) // op_emergency_withdraw
            .storeCoins(amount)
            .endCell();
        
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: messageBody,
        });
    }

    async sendAddToBlacklist(
        provider: ContractProvider,
        via: Sender, 
        address: Address, 
        value: bigint = toNano('0.02')
    ) {
        const messageBody = beginCell()
            .storeUint(0x61646462, 32) // op_add_blacklist
            .storeRef(beginCell().storeAddress(address).endCell())
            .endCell();
    
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: messageBody,
        });
    }

    async sendRemoveFromBlacklist(
        provider: ContractProvider,
        via: Sender, 
        address: Address, 
        value: bigint = toNano('0.02')
    ) {
        const messageBody = beginCell()
            .storeUint(0x72656d62, 32) // op_remove_blacklist
            .storeRef(beginCell().storeAddress(address).endCell())
            .endCell();
    
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: messageBody,
        });
    }

    // Новые методы v2.0
    async sendSetFeeRate(
        provider: ContractProvider,
        via: Sender,
        feeRate: number,
        value: bigint = toNano('0.02')
    ) {
        const messageBody = beginCell()
            .storeUint(0x73657466, 32) // op_set_fee_rate
            .storeUint(feeRate, 32)
            .endCell();
        
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: messageBody,
        });
    }

    async sendAddSigner(
        provider: ContractProvider,
        via: Sender,
        signer: Address,
        value: bigint = toNano('0.02')
    ) {
        const messageBody = beginCell()
            .storeUint(0x61647369, 32) // op_add_signer
            .storeRef(beginCell().storeAddress(signer).endCell())
            .endCell();
        
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: messageBody,
        });
    }

    async sendRemoveSigner(
        provider: ContractProvider,
        via: Sender,
        signer: Address,
        value: bigint = toNano('0.02')
    ) {
        const messageBody = beginCell()
            .storeUint(0x726d7369, 32) // op_remove_signer
            .storeRef(beginCell().storeAddress(signer).endCell())
            .endCell();
        
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: messageBody,
        });
    }

    async sendUpdateOracle(
        provider: ContractProvider,
        via: Sender,
        oracleData: number,
        value: bigint = toNano('0.02')
    ) {
        const messageBody = beginCell()
            .storeUint(0x7570646f, 32) // op_update_oracle
            .storeUint(oracleData, 64)
            .endCell();
        
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: messageBody,
        });
    }

    async getAdmin(provider: ContractProvider): Promise<Address> {
        const result = await provider.get('getAdmin', []);
        return result.stack.readAddress();
    }

    async getBalance(provider: ContractProvider): Promise<bigint> {
        const state = await provider.getState();
        return state.balance;
    }

    async getMixerParams(provider: ContractProvider): Promise<MixerParams> {
        const result = await provider.get('getMixerParams', []);
        return {
            minFeeRate: result.stack.readNumber(),
            maxFeeRate: result.stack.readNumber(),
            minDelay: result.stack.readNumber(),
            maxDelay: result.stack.readNumber()
        };
    }

    async getCurrentFeeRate(provider: ContractProvider): Promise<number> {
        const result = await provider.get('getCurrentFeeRate', []);
        return result.stack.readNumber();
    }

    async getLimits(provider: ContractProvider): Promise<ContractLimits> {
        const result = await provider.get('getLimits', []);
        return {
            minDeposit: result.stack.readBigNumber(),
            maxDeposit: result.stack.readBigNumber(),
            minWithdraw: result.stack.readBigNumber()
        };
    }

    async isAddressBlacklisted(provider: ContractProvider, address: Address): Promise<boolean> {
        const result = await provider.get('isAddressBlacklisted', [
            { type: 'slice', cell: beginCell().storeAddress(address).endCell() }
        ]);
        return result.stack.readBoolean();
    }
    
    async getDepositInfo(provider: ContractProvider, depositId: bigint): Promise<DepositInfo | null> {
        try {
            const result = await provider.get('getDepositInfo', [
                { type: 'int', value: depositId }
            ]);
            
            const depositTime = result.stack.readNumber();
            const delay = result.stack.readNumber();
            const status = result.stack.readNumber();
                
            if (depositTime === -1) {
                return { depositTime: -1, delay: -1, status: -1 };
            }
                
            return { depositTime, delay, status };
        } catch (error) {
            return { depositTime: -1, delay: -1, status: -1 };
        }
    }

    async getBasicStats(provider: ContractProvider): Promise<BasicStats> {
        try {
            const result = await provider.get('getBasicStats', []);
            return {
                totalDeposits: result.stack.readNumber(),
                totalWithdrawn: result.stack.readBigNumber() 
            };
        } catch {
            return { totalDeposits: 0, totalWithdrawn: BigInt(0) };
        }
    }

    async getLastDepositId(provider: ContractProvider): Promise<bigint> {
        try {
            const result = await provider.get('getLastDepositId', []);
            return result.stack.readBigNumber();
        } catch {
            return BigInt(-1);
        }
    }

    async getQueueInfo(provider: ContractProvider): Promise<QueueInfo> {
        try {
            const result = await provider.get('getQueueInfo', []);
            return {
                queueLength: result.stack.readNumber(),
                totalAmount: result.stack.readBigNumber()
            };
        } catch {
            return { queueLength: 0, totalAmount: BigInt(0) };
        }
    }

    // ИСПРАВЛЕНО: Добавляем отладочные методы
    async getDebugState(provider: ContractProvider): Promise<[number, number, number, number]> {
        const result = await provider.get('getDebugState', []);
        return [
            Number(result.stack.readNumber()),
            Number(result.stack.readNumber()),
            Number(result.stack.readNumber()),
            Number(result.stack.readNumber())
        ];
    }

    async getFullState(provider: ContractProvider): Promise<[number, number, number, number, number, number]> {
        const result = await provider.get('getFullState', []);
        return [
            Number(result.stack.readNumber()),
            Number(result.stack.readNumber()),
            Number(result.stack.readNumber()),
            Number(result.stack.readNumber()),
            Number(result.stack.readNumber()),
            Number(result.stack.readNumber())
        ];
    }

    // В файле wrappers/Mixton.ts добавляем этот метод в класс Mixton

async checkState(provider: ContractProvider): Promise<[number, number, number, number]> {
    const result = await provider.get('checkState', []);
    return [
        Number(result.stack.readNumber()),
        Number(result.stack.readNumber()),
        Number(result.stack.readNumber()),
        Number(result.stack.readNumber())
    ];
}

    async getDepositCount(provider: ContractProvider): Promise<number> {
        const result = await provider.get('getDepositCount', []);
        return result.stack.readNumber();
    }

    async getDepositsDictSize(provider: ContractProvider): Promise<number> {
        const result = await provider.get('getDepositsDictSize', []);
        return result.stack.readNumber();
    }

    async getDetailedDebugInfo(provider: ContractProvider): Promise<[number, number, number, number]> {
        const result = await provider.get('getDetailedDebugInfo', []);
        return [
            Number(result.stack.readNumber()),
            Number(result.stack.readNumber()),
            Number(result.stack.readNumber()),
            Number(result.stack.readNumber())
        ];
    }

    // ИСПРАВЛЕНО: Правильный метод getQueueStatus
    async getQueueStatus(provider: ContractProvider): Promise<number> {
        try {
            const result = await provider.get('getQueueStatus', []);
            return result.stack.readNumber();
        } catch {
            return 0; 
        }
    }

    async getMinNextTime(provider: ContractProvider): Promise<number> {
        try {
            const result = await provider.get('getMinNextTime', []);
            return result.stack.readNumber();
        } catch {
            return -1;
        }
    }

    async getQueueDetails(provider: ContractProvider): Promise<{ queueLength: number; totalAmount: bigint; nextTime: number }> {
        try {
            const result = await provider.get('getQueueDetails', []);
            
            if (result.stack.remaining < 3) {
                return { queueLength: 0, totalAmount: BigInt(0), nextTime: -1 };
            }
            
            const queueLength = result.stack.readNumber();  
            const totalAmount = result.stack.readBigNumber(); 
            const nextTime = result.stack.readNumber();     
            
            return { queueLength, totalAmount, nextTime };
        } catch {
            return { queueLength: 0, totalAmount: BigInt(0), nextTime: -1 };
        }
    }

    // Новые методы v2.0
    async getSigners(provider: ContractProvider): Promise<SignerInfo> {
        try {
            const result = await provider.get('getSigners', []);
            return {
                count: result.stack.readNumber(),
                required: result.stack.readNumber()
            };
        } catch {
            return { count: 0, required: 1 };
        }
    }

    async getOracleData(provider: ContractProvider): Promise<OracleData> {
        try {
            const result = await provider.get('getOracleData', []);
            return {
                data: result.stack.readNumber(),
                lastUpdate: result.stack.readNumber()
            };
        } catch {
            return { data: 1000000, lastUpdate: 0 };
        }
    }

    async getTransactionHistory(provider: ContractProvider): Promise<TransactionRecord[]> {
        try {
            const result = await provider.get('getTransactionHistory', []);
            const historyCell = result.stack.readCell();
            const historySlice = historyCell.beginParse();
            const records: TransactionRecord[] = [];
            
            while (historySlice.remainingBits >= 8 + 267 + 64 + 64 + 32 + 8) {
                records.push({
                    txType: historySlice.loadUint(8),
                    address: historySlice.loadAddress(),
                    amount: historySlice.loadCoins(),
                    timestamp: historySlice.loadUint(64),
                    feeRate: historySlice.loadUint(32),
                    status: historySlice.loadUint(8)
                });
            }
            
            return records;
        } catch {
            return [];
        }
    }

    async getPerformanceStats(provider: ContractProvider): Promise<{ lastProcessedTime: number; failedTransactions: number; queueSize: number }> {
        try {
            const result = await provider.get('getPerformanceStats', []);
            return {
                lastProcessedTime: result.stack.readNumber(),
                failedTransactions: result.stack.readNumber(),
                queueSize: result.stack.readNumber()
            };
        } catch {
            return { lastProcessedTime: 0, failedTransactions: 0, queueSize: 0 };
        }
    }

    // Новый метод для получения ID следующего готового элемента очереди
    async getNextQueueItemId(provider: ContractProvider): Promise<bigint> {
        try {
            const result = await provider.get('getNextQueueItemId', []);
            return result.stack.readBigNumber();
        } catch(e) {
            // Если get-метод бросил исключение (например, очередь пуста и он вернул -1, что не bigint)
            // или если сам вызов failed
            return BigInt(-1);
        }
    }

    // Новый метод для получения информации о конкретном элементе очереди
    async getQueueItemInfo(provider: ContractProvider, queueItemId: bigint): Promise<{ exists: boolean; isReady: boolean }> {
        try {
            // Сначала проверяем, существует ли элемент с таким ID
            const queueDetails = await this.getQueueDetails(provider);
            if (queueDetails.queueLength === 0) {
                return { exists: false, isReady: false };
            }
            
            // Проверяем статус очереди
            const queueStatus = await this.getQueueStatus(provider);
            const minNextTime = await this.getMinNextTime(provider);
            
            // Если статус 2 (очередь не пуста и время пришло), то элемент готов
            const currentTime = Math.floor(Date.now() / 1000); // Используем текущее время
            const isReady = queueStatus === 2 || (minNextTime > 0 && currentTime >= minNextTime);
            
            return { exists: true, isReady };
        } catch (error) {
            console.error(`Error checking queue item ${queueItemId}:`, error);
            return { exists: false, isReady: false };
        }
    }

    // ИСПРАВЛЕНО: Добавляем недостающие отладочные методы
    async getCurrentTime(provider: ContractProvider): Promise<number> {
        try {
            const result = await provider.get('getCurrentTime', []);
            return result.stack.readNumber();
        } catch {
            return Math.floor(Date.now() / 1000);
        }
    }

    async getFirstItemTime(provider: ContractProvider): Promise<number> {
        try {
            const result = await provider.get('getFirstItemTime', []);
            return result.stack.readNumber();
        } catch {
            return -1;
        }
    }

    async getSimpleDebug(provider: ContractProvider): Promise<{ queueSize: number; currentTime: number }> {
        try {
            const result = await provider.get('getSimpleDebug', []);
            return {
                queueSize: result.stack.readNumber(),
                currentTime: result.stack.readNumber()
            };
        } catch {
            return { queueSize: 0, currentTime: Math.floor(Date.now() / 1000) };
        }
    }

    async isAdmin(provider: ContractProvider, address?: Address | ExternalAddress): Promise<boolean> {
        if (!address || !isInternalAddress(address)) return false;
        try {
            const admin = await this.getAdmin(provider);
            return admin.equals(address);
        } catch {
            return false;
        }
    }

    calculateFee(amount: bigint, feeRate: number): bigint {
        return (amount * BigInt(feeRate)) / BigInt(10000);
    }

    calculateNetAmount(amount: bigint, feeRate: number): bigint {
        return amount - this.calculateFee(amount, feeRate);
    }

    static formatDelay(seconds: number): string {
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        
        if (days > 0) return `${days}d ${hours}h`;
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    }

    static formatFeeRate(feeRate: number): string {
        return `${(feeRate / 100).toFixed(2)}%`;
    }

    static formatAmount(amount: bigint): string {
        return (Number(amount) / 1000000000).toFixed(9);
    }

    static formatAddress(address: Address | ExternalAddress, length: number = 10): string {
        const addressStr = address.toString();
        return `${addressStr.substring(0, length)}...${addressStr.substring(addressStr.length - 6)}`;
    }

    async healthCheck(provider: ContractProvider): Promise<{ healthy: boolean; issues: string[] }> {
        const issues: string[] = [];
        
        try {
            await this.getAdmin(provider);
            await this.getBalance(provider);
            await this.getMixerParams(provider);
            await this.getCurrentFeeRate(provider);
            
            const admin = await this.getAdmin(provider);
            if (!admin) {
                issues.push('Admin address not set');
            }
            
            return { healthy: issues.length === 0, issues };
        } catch (error) {
            return {
                healthy: false,
                issues: [`Health check failed: ${error instanceof Error ? error.message : String(error)}`]
            };
        }
    }
}
