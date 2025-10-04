import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano, Address, beginCell, Sender } from '@ton/core';
import { Mixton } from '../wrappers/Mixton';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

// Вспомогательная функция для безопасного сравнения адресов
function isInternalAddress(address: Address | any): address is Address {
    return address !== null && address !== undefined && address instanceof Address;
}

function addressesEqual(addr1: Address | any, addr2: Address | any): boolean {
    if (!isInternalAddress(addr1) || !isInternalAddress(addr2)) {
        return false;
    }
    return addr1.toString() === addr2.toString();
}

describe('Mixton Security Tests', () => {
    let code: Cell;
    beforeAll(async () => {
        code = await compile('Mixton');
    }, 30000);

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let admin: SandboxContract<TreasuryContract>;
    let user: SandboxContract<TreasuryContract>;
    let attacker: SandboxContract<TreasuryContract>;
    let mixton: SandboxContract<Mixton>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        blockchain.now = Math.floor(Date.now() / 1000);
        deployer = await blockchain.treasury('deployer');
        admin = await blockchain.treasury('admin');
        user = await blockchain.treasury('user');
        attacker = await blockchain.treasury('attacker');

        mixton = blockchain.openContract(
            Mixton.createFromConfig(
                {
                    admin: admin.address,
                },
                code
            )
        );

        // Отправляем сообщение от администратора для инициализации контракта
        const initResult = await mixton.sendInternal(admin.getSender(), {
            value: toNano('0.05'),
            body: beginCell().endCell(),
        });
        expect(initResult.transactions).toHaveTransaction({
            from: admin.address,
            to: mixton.address,
            success: true,
        });
    }, 10000);

    // Вспомогательные функции
    const findTransactionByAddresses = (transactions: any[], from: Address, to: Address) => {
        return transactions.find((tx: any) =>
            tx.inMessage &&
            tx.inMessage.info &&
            tx.inMessage.info.src &&
            tx.inMessage.info.dest &&
            addressesEqual(tx.inMessage.info.src, from) &&
            addressesEqual(tx.inMessage.info.dest, to)
        );
    };

    const isTransactionSuccessful = (tx: any) => {
        return tx?.description?.computePhase?.success === true;
    };

    const getTransactionExitCode = (tx: any) => {
        return tx?.description?.computePhase?.exitCode;
    };

    // Функция для обновления времени в контракте
    const updateContractTime = async (mixton: SandboxContract<Mixton>, newTime: number, sender: Sender) => {
        const updateTimeResult = await mixton.sendInternal(sender, {
            value: toNano('0.01'),
            body: beginCell()
                .storeUint(0x75706474, 32) // OP_UPDATE_TIME = "updt"
                .storeUint(newTime, 64)
                .endCell(),
        });
        return updateTimeResult;
    };

    it('should prevent unauthorized access', async () => {
    // Добавляем отладочную информацию перед созданием депозита
    const debugStateBefore = await mixton.getDebugState();
    console.log('Debug state before deposit:', debugStateBefore);
    
    // Создаем депозит
    await mixton.sendDeposit(user.getSender(), toNano('10.0'));
    
    // Добавляем задержку для обработки транзакции
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Добавляем отладочную информацию после создания депозита
    const debugStateAfter = await mixton.getDebugState();
    console.log('Debug state after deposit:', debugStateAfter);
    
    // Проверяем, что депозит был создан
    const stats = await mixton.getBasicStats();
    console.log('Basic stats after deposit:', stats);
    expect(stats.totalDeposits).toBeGreaterThan(0);
    
    // Получаем ID последнего депозита
    const lastDepositId = await mixton.getLastDepositId();
    console.log('Last deposit ID:', lastDepositId.toString());
    expect(lastDepositId).toBeGreaterThanOrEqual(BigInt(0));
    
    // Пытаемся сделать вывод от имени не-администратора
    const withdrawResult = await mixton.sendWithdraw(
        attacker.getSender(),
        attacker.address,
        toNano('1.0'),
        lastDepositId,
        250,
        3600,
        toNano('0.02')
    );
    
    const tx = findTransactionByAddresses(withdrawResult.transactions, attacker.address, mixton.address);
    expect(isTransactionSuccessful(tx)).toBe(false);
    expect(getTransactionExitCode(tx)).toBe(403); // ERROR_UNAUTHORIZED
}, 15000);

    it('should validate input parameters', async () => {
        // Создаем депозит
        await mixton.sendDeposit(user.getSender(), toNano('10.0'));
        
        // Добавляем задержку для обработки транзакции
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Проверяем, что депозит был создан
        const stats = await mixton.getBasicStats();
        expect(stats.totalDeposits).toBeGreaterThan(0);
        
        // Получаем ID последнего депозита
        const lastDepositId = await mixton.getLastDepositId();
        expect(lastDepositId).toBeGreaterThanOrEqual(BigInt(0));
        
        // Пытаемся сделать вывод с некорректной комиссией
        const invalidFeeRateResult = await mixton.sendWithdraw(
            admin.getSender(),
            user.address,
            toNano('1.0'),
            lastDepositId,
            50, // Слишком низкая комиссия
            3600,
            toNano('0.02')
        );
        
        const invalidFeeRateTx = findTransactionByAddresses(invalidFeeRateResult.transactions, admin.address, mixton.address);
        expect(isTransactionSuccessful(invalidFeeRateTx)).toBe(false);
        expect(getTransactionExitCode(invalidFeeRateTx)).toBe(411); // ERROR_INVALID_FEE_RATE
        
        // Пытаемся сделать вывод с некорректной задержкой
        const invalidDelayResult = await mixton.sendWithdraw(
            admin.getSender(),
            user.address,
            toNano('1.0'),
            lastDepositId,
            250,
            10, // Слишком маленькая задержка
            toNano('0.02')
        );
        
        const invalidDelayTx = findTransactionByAddresses(invalidDelayResult.transactions, admin.address, mixton.address);
        expect(isTransactionSuccessful(invalidDelayTx)).toBe(false);
        expect(getTransactionExitCode(invalidDelayTx)).toBe(412); // ERROR_INVALID_DELAY
    }, 15000);

    it('should handle bounced messages correctly', async () => {
        // Создаем депозит
        await mixton.sendDeposit(user.getSender(), toNano('10.0'));
        
        // Добавляем задержку для обработки транзакции
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Проверяем, что депозит был создан
        const stats = await mixton.getBasicStats();
        expect(stats.totalDeposits).toBeGreaterThan(0);
        
        // Получаем ID последнего депозита
        const lastDepositId = await mixton.getLastDepositId();
        expect(lastDepositId).toBeGreaterThanOrEqual(BigInt(0));
        
        // Создаем вывод с очень большой суммой, которая не может быть обработана
        const withdrawResult = await mixton.sendWithdraw(
            admin.getSender(),
            user.address,
            toNano('100.0'), // Очень большая сумма
            lastDepositId,
            250,
            3600,
            toNano('0.02')
        );
        
        // Увеличиваем время и обновляем его в контракте
        blockchain.now! += 4000;
        await updateContractTime(mixton, blockchain.now!, user.getSender());
        
        // Получаем ID следующего элемента для обработки
        const nextQueueItemId = await mixton.getNextQueueItemId();
        expect(nextQueueItemId).toBeGreaterThanOrEqual(BigInt(0));
        
        // Пытаемся обработать очередь
        const processResult = await mixton.sendProcessQueue(
            user.getSender(),
            nextQueueItemId,
            toNano('0.02')
        );
        
        // Проверяем, что транзакция обработки была успешной, но вывод не был выполнен
        const processTx = findTransactionByAddresses(processResult.transactions, user.address, mixton.address);
        expect(isTransactionSuccessful(processTx)).toBe(true);
        
        // Проверяем, что средства все еще в контракте
        const balance = await mixton.getBalance();
        expect(balance).toBeGreaterThan(toNano('0'));
    }, 15000);
});
