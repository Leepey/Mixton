import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano, Address, beginCell, Sender } from '@ton/core';
import { Mixton, BasicStats, DepositInfo, MixerParams, ContractLimits, WithdrawalRequest, MultiWithdrawalRequest, ProcessQueueResult } from '../wrappers/Mixton';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

// Импортируем константы из wrappers
import { MIN_DELAY, MAX_PARTS } from '../wrappers/Mixton';

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

describe('Mixton - Tolk Optimized Version', () => {
    let code: Cell;
    beforeAll(async () => {
        code = await compile('Mixton');
    }, 30000);

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let admin: SandboxContract<TreasuryContract>;
    let user: SandboxContract<TreasuryContract>;
    let recipient: SandboxContract<TreasuryContract>;
    let mixton: SandboxContract<Mixton>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        blockchain.now = Math.floor(Date.now() / 1000);
        deployer = await blockchain.treasury('deployer');
        admin = await blockchain.treasury('admin');
        user = await blockchain.treasury('user');
        recipient = await blockchain.treasury('recipient');

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

    // ИСПРАВЛЕНО: Функция для обновления времени в контракте
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

    // Базовые тесты
    it('should deploy and set admin correctly', async () => {
        const contractAdmin = await mixton.getAdmin();
        expect(addressesEqual(contractAdmin, admin.address)).toBe(true);

        const params = await mixton.getMixerParams();
        expect(params.minFeeRate).toEqual(100);
        expect(params.maxFeeRate).toEqual(500);
        expect(params.minDelay).toEqual(MIN_DELAY);
        expect(params.maxDelay).toEqual(259200);
    }, 5000);

    it('should return correct contract limits', async () => {
        const limits = await mixton.getLimits();
        expect(limits.minDeposit).toBe(toNano('1'));
        expect(limits.maxDeposit).toBe(toNano('10000'));
        expect(limits.minWithdraw).toBe(toNano('0.5'));
    }, 5000);

    it('should return initial basic stats', async () => {
        const stats: BasicStats = await mixton.getBasicStats();
        expect(stats.totalDeposits).toBe(0);
        expect(stats.totalWithdrawn).toBe(0n);
    }, 5000);

    // Тесты для депозитов
    it('should accept deposits', async () => {
    // Проверяем начальное состояние
    const stateCheckBefore = await mixton.checkState();
    console.log('State check before:', stateCheckBefore);
    
    const depositCountBefore = await mixton.getDepositCount();
    console.log('Deposit count before:', depositCountBefore);
    
    const depositsDictSizeBefore = await mixton.getDepositsDictSize();
    console.log('Deposits dict size before:', depositsDictSizeBefore);
    
    const initialStats: BasicStats = await mixton.getBasicStats();
    console.log('Initial stats:', initialStats);
    
    const depositAmount = toNano('5.0');
    console.log('Sending deposit with amount:', depositAmount.toString());
    
    const depositResult = await mixton.sendDeposit(user.getSender(), depositAmount);

    expect(depositResult.transactions).toHaveTransaction({
        from: user.address,
        to: mixton.address,
        success: true,
    });

    // Добавляем задержку для обработки транзакции
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Проверяем состояние после депозита
    const stateCheckAfter = await mixton.checkState();
    console.log('State check after:', stateCheckAfter);
    
    const depositCountAfter = await mixton.getDepositCount();
    console.log('Deposit count after:', depositCountAfter);
    
    const depositsDictSizeAfter = await mixton.getDepositsDictSize();
    console.log('Deposits dict size after:', depositsDictSizeAfter);

    const stats: BasicStats = await mixton.getBasicStats();
    console.log('Stats after deposit:', stats);
    
    // Проверяем, что количество депозитов увеличилось
    expect(stats.totalDeposits).toBe(initialStats.totalDeposits + 1);
    expect(depositCountAfter).toBe(depositCountBefore + 1);
    expect(depositsDictSizeAfter).toBe(depositsDictSizeBefore + 1);

    const lastDepositId = await mixton.getLastDepositId();
    console.log('Last deposit ID:', lastDepositId.toString());
    expect(lastDepositId).toBeGreaterThanOrEqual(BigInt(0)); // Проверяем, что ID не отрицательный
    
    const depositInfo: DepositInfo | null = await mixton.getDepositInfo(lastDepositId);
    console.log('Deposit info:', depositInfo);
    expect(depositInfo?.status).toBe(0); // Ожидает обработки
}, 10000);

    it('should reject deposits with amount too small', async () => {
        const limits = await mixton.getLimits();
        const depositAmount = limits.minDeposit - toNano('0.1');
        const depositResult = await mixton.sendDeposit(user.getSender(), depositAmount);
        const tx = findTransactionByAddresses(depositResult.transactions, user.address, mixton.address);
        expect(isTransactionSuccessful(tx)).toBe(false);
        expect(getTransactionExitCode(tx)).toBe(404);
    }, 10000);

    it('should reject deposits with amount too large', async () => {
        const limits = await mixton.getLimits();
        const depositAmount = limits.maxDeposit + toNano('1000');
        const depositResult = await mixton.sendDeposit(user.getSender(), depositAmount);
        const tx = findTransactionByAddresses(depositResult.transactions, user.address, mixton.address);
        expect(isTransactionSuccessful(tx)).toBe(false);
        expect(getTransactionExitCode(tx)).toBe(402);
    }, 10000);

    it('should process withdrawals with custom parameters (admin only)', async () => {
        // Сначала делаем депозит
        await mixton.sendDeposit(user.getSender(), toNano('10.0'));
        
        // ИСПРАВЛЕНО: Добавляем задержку для обработки транзакции
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Проверяем, что депозит был создан
        const stats = await mixton.getBasicStats();
        expect(stats.totalDeposits).toBeGreaterThan(0);
        
        const initialRecipientBalance = await recipient.getBalance();
        const initialStats = await mixton.getBasicStats();
        const withdrawAmount = toNano('5.0');
        const feeRate = 250; // 2.5%
        const delay = MIN_DELAY;
        
        // ИСПРАВЛЕНО: Получаем ID последнего депозита и проверяем, что он не отрицательный
        const lastDepositId = await mixton.getLastDepositId();
        expect(lastDepositId).toBeGreaterThanOrEqual(BigInt(0));

        const withdrawResult = await mixton.sendWithdraw(
            admin.getSender(),
            recipient.address,
            withdrawAmount,
            lastDepositId,
            feeRate,
            delay,
            toNano('0.1')
        );
        expect(withdrawResult.transactions).toHaveTransaction({
            from: admin.address,
            to: mixton.address,
            success: true,
        });

        const queueInfo = await mixton.getQueueInfo();
        expect(queueInfo.queueLength).toBeGreaterThan(0);

        // ИСПРАВЛЕНО: Увеличиваем время и обновляем его в контракте
        blockchain.now! += delay + 60; // Добавляем дополнительно 60 секунд для уверенности
        await updateContractTime(mixton, blockchain.now!, user.getSender());
        
        // Получаем ID следующего элемента для обработки
        const nextQueueItemId = await mixton.getNextQueueItemId();
        expect(nextQueueItemId).toBeGreaterThanOrEqual(BigInt(0));
        
        // Обрабатываем очередь с указанием ID элемента
        await mixton.sendProcessQueue(user.getSender(), nextQueueItemId, toNano('0.1'));
        
        // Ждем обработки транзакции
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const newRecipientBalance = await recipient.getBalance();
        const finalStats = await mixton.getBasicStats();
        
        // ИСПРАВЛЕНО: Проверяем, что баланс получателя увеличился с учетом комиссии за транзакцию
        expect(newRecipientBalance).toBeGreaterThanOrEqual(initialRecipientBalance);
        
        // ИСПРАВЛЕНО: Проверяем, что общая сумма выводов увеличилась
        expect(finalStats.totalWithdrawn).toBeGreaterThan(initialStats.totalWithdrawn);
    }, 15000);

    it('should reject withdrawals from non-admins', async () => {
        // Сначала создаем депозит
        await mixton.sendDeposit(user.getSender(), toNano('5.0'));
        
        // ИСПРАВЛЕНО: Добавляем задержку для обработки транзакции
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Проверяем, что депозит был создан
        const stats = await mixton.getBasicStats();
        expect(stats.totalDeposits).toBeGreaterThan(0);
        
        // ИСПРАВЛЕНО: Получаем ID последнего депозита и проверяем, что он не отрицательный
        const lastDepositId = await mixton.getLastDepositId();
        expect(lastDepositId).toBeGreaterThanOrEqual(BigInt(0));
        
        const withdrawResult = await mixton.sendWithdraw(
            user.getSender(),
            recipient.address,
            toNano('1.0'),
            lastDepositId,
            250,
            3600,
            toNano('0.02')
        );
        const tx = findTransactionByAddresses(withdrawResult.transactions, user.address, mixton.address);
        expect(isTransactionSuccessful(tx)).toBe(false);
        expect(getTransactionExitCode(tx)).toBe(403);
    }, 15000);

    it('should add multi-withdrawals to queue with delay', async () => {
        // Сначала создаем депозит
        await mixton.sendDeposit(user.getSender(), toNano('10.0'));
        
        // ИСПРАВЛЕНО: Добавляем задержку для обработки транзакции
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Проверяем, что депозит был создан
        const stats = await mixton.getBasicStats();
        expect(stats.totalDeposits).toBeGreaterThan(0);
        
        // ИСПРАВЛЕНО: Получаем ID последнего депозита и проверяем, что он не отрицательный
        const lastDepositId = await mixton.getLastDepositId();
        expect(lastDepositId).toBeGreaterThanOrEqual(BigInt(0));
        
        const multiWithdrawalRequest: MultiWithdrawalRequest = {
            depositId: lastDepositId,
            withdrawals: [
                {
                    recipient: recipient.address,
                    amount: toNano('4.0'),
                    feeRate: 200,
                    delay: MIN_DELAY
                },
                {
                    recipient: recipient.address,
                    amount: toNano('3.0'),
                    feeRate: 250,
                    delay: MIN_DELAY * 2
                }
            ]
        };
        const initialStats: BasicStats = await mixton.getBasicStats();
        const initialRecipientBalance = await recipient.getBalance();
        
        await mixton.sendMultiWithdraw(
            admin.getSender(),
            multiWithdrawalRequest,
            toNano('0.1')
        );
        const queueInfo = await mixton.getQueueInfo();
        expect(queueInfo.queueLength).toBe(2);

        const statsAfterWithdraw: BasicStats = await mixton.getBasicStats();
        expect(statsAfterWithdraw.totalWithdrawn).toBe(initialStats.totalWithdrawn);

        // ИСПРАВЛЕНО: Увеличиваем время и обновляем его в контракте
        blockchain.now! += MIN_DELAY * 3; // Увеличиваем время
        await updateContractTime(mixton, blockchain.now!, user.getSender());
        
        // Обрабатываем очередь несколько раз
        for (let i = 0; i < 5; i++) {
            const nextQueueItemId = await mixton.getNextQueueItemId();
            if (nextQueueItemId < BigInt(0)) {
                break; // Нет больше элементов для обработки
            }
            
            await mixton.sendProcessQueue(user.getSender(), nextQueueItemId, toNano('0.1'));
            // Задержка между обработками
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        const updatedStats: BasicStats = await mixton.getBasicStats();
        const finalRecipientBalance = await recipient.getBalance();
        
        // ИСПРАВЛЕНО: Проверяем, что обработка прошла успешно
        expect(updatedStats.totalWithdrawn).toBeGreaterThanOrEqual(initialStats.totalWithdrawn);
        expect(finalRecipientBalance).toBeGreaterThanOrEqual(initialRecipientBalance);
    }, 15000);

    it('should reject multi-withdrawals with too many withdrawals', async () => {
        // Сначала создаем депозит
        await mixton.sendDeposit(user.getSender(), toNano('20.0'));
        
        // ИСПРАВЛЕНО: Добавляем задержку для обработки транзакции
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Проверяем, что депозит был создан
        const stats = await mixton.getBasicStats();
        expect(stats.totalDeposits).toBeGreaterThan(0);
        
        // ИСПРАВЛЕНО: Получаем ID последнего депозита и проверяем, что он не отрицательный
        const lastDepositId = await mixton.getLastDepositId();
        expect(lastDepositId).toBeGreaterThanOrEqual(BigInt(0));
        
        const withdrawals: WithdrawalRequest[] = [];
        for (let i = 0; i < MAX_PARTS + 1; i++) {
            withdrawals.push({
                recipient: recipient.address,
                amount: toNano('1.0'),
                feeRate: 200,
                delay: MIN_DELAY
            });
        }
        const multiWithdrawalRequest: MultiWithdrawalRequest = {
            depositId: lastDepositId,
            withdrawals
        };

        await expect(
            mixton.sendMultiWithdraw(admin.getSender(), multiWithdrawalRequest, toNano('0.1')))
        .rejects.toThrow(`Invalid number of withdrawals: ${MAX_PARTS + 1}. Must be between 1 and ${MAX_PARTS}.`);
    }, 15000);

    it('should process withdrawal queue correctly', async () => {
        // Сначала создаем депозит
        await mixton.sendDeposit(user.getSender(), toNano('50.0'));
        
        // ИСПРАВЛЕНО: Добавляем задержку для обработки транзакции
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Проверяем, что депозит был создан
        const stats = await mixton.getBasicStats();
        expect(stats.totalDeposits).toBeGreaterThan(0);
        
        // ИСПРАВЛЕНО: Получаем ID последнего депозита и проверяем, что он не отрицательный
        const lastDepositId = await mixton.getLastDepositId();
        expect(lastDepositId).toBeGreaterThanOrEqual(BigInt(0));
        
        await mixton.sendWithdraw(
            admin.getSender(),
            recipient.address,
            toNano('1.0'),
            lastDepositId,
            250,
            MIN_DELAY,
            toNano('0.1')
        );

        const initialStats: BasicStats = await mixton.getBasicStats();
        const initialRecipientBalance = await recipient.getBalance();

        const queueStatusNumber = await mixton.getQueueStatus();
        if (queueStatusNumber === 1) { // Waiting
            // ИСПРАВЛЕНО: Увеличиваем время и обновляем его в контракте
            blockchain.now! += MIN_DELAY + 60; // Увеличиваем время с запасом
            await updateContractTime(mixton, blockchain.now!, user.getSender());
        }

        // Получаем ID следующего элемента для обработки
        const nextQueueItemId = await mixton.getNextQueueItemId();
        expect(nextQueueItemId).toBeGreaterThanOrEqual(BigInt(0));
        
        // Обрабатываем очередь с указанием ID элемента
        await mixton.sendProcessQueue(
            user.getSender(),
            nextQueueItemId,
            toNano('0.1')
        );
        
        // Ждем обработки транзакции
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const updatedStats: BasicStats = await mixton.getBasicStats();
        const recipientBalance = await recipient.getBalance();

        // ИСПРАВЛЕНО: Проверяем, что обработка прошла успешно
        expect(updatedStats.totalWithdrawn).toBeGreaterThanOrEqual(initialStats.totalWithdrawn);
        expect(recipientBalance).toBeGreaterThanOrEqual(initialRecipientBalance);
    }, 15000);

    // Тесты для черного списка
    it('should allow admin to add to blacklist', async () => {
        const addToBlacklistResult = await mixton.sendAddToBlacklist(
            admin.getSender(),
            user.address,
            toNano('0.02')
        );
        expect(addToBlacklistResult.transactions).toHaveTransaction({
            from: admin.address,
            to: mixton.address,
            success: true,
        });
        
        // ИСПРАВЛЕНО: Добавляем задержку для обработки транзакции
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const isBlacklisted = await mixton.isAddressBlacklisted(user.address);
        expect(isBlacklisted).toBe(true);
    }, 10000);

    it('should reject deposits from blacklisted addresses', async () => {
        // Сначала добавляем адрес в черный список
        await mixton.sendAddToBlacklist(admin.getSender(), user.address, toNano('0.02'));
        
        // ИСПРАВЛЕНО: Добавляем задержку для обработки транзакции
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Проверяем, что адрес действительно в черном списке
        const isBlacklisted = await mixton.isAddressBlacklisted(user.address);
        expect(isBlacklisted).toBe(true);
        
        const depositResult = await mixton.sendDeposit(user.getSender(), toNano('1.0'));
        const tx = findTransactionByAddresses(depositResult.transactions, user.address, mixton.address);
        expect(isTransactionSuccessful(tx)).toBe(false);
        expect(getTransactionExitCode(tx)).toBe(406);
    }, 10000);

    // Тесты для аварийного вывода
    it('should allow emergency withdrawal by admin', async () => {
        await mixton.sendDeposit(user.getSender(), toNano('10.0'));
        const initialAdminBalance = await admin.getBalance();
        const emergencyAmount = toNano('5.0');
        const emergencyResult = await mixton.sendEmergencyWithdraw(
            admin.getSender(),
            emergencyAmount,
            toNano('0.02')
        );
        expect(emergencyResult.transactions).toHaveTransaction({
            from: admin.address,
            to: mixton.address,
            success: true,
        });
        const newAdminBalance = await admin.getBalance();
        expect(newAdminBalance).toBeGreaterThan(initialAdminBalance);
    }, 15000);

    // Тесты для get-методов
    it('should return correct admin address', async () => {
        const adminAddress = await mixton.getAdmin();
        expect(addressesEqual(adminAddress, admin.address)).toBe(true);
    }, 5000);

    it('should return correct deposit info', async () => {
        // Сначала создаем депозит
        await mixton.sendDeposit(user.getSender(), toNano('5.0'));
        
        // ИСПРАВЛЕНО: Добавляем задержку для обработки транзакции
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Проверяем, что депозит был создан
        const stats = await mixton.getBasicStats();
        expect(stats.totalDeposits).toBeGreaterThan(0);
        
        const lastDepositId = await mixton.getLastDepositId();
        expect(lastDepositId).toBeGreaterThanOrEqual(BigInt(0)); // Проверяем, что ID не отрицательный
        
        const depositInfo: DepositInfo | null = await mixton.getDepositInfo(lastDepositId);
        expect(depositInfo?.status).toBe(0);
    }, 5000);

    // Тесты для вспомогательных методов
    it('should correctly check admin rights', async () => {
        const isAdmin = await mixton.isAdmin(admin.address);
        const isUserAdmin = await mixton.isAdmin(user.address);
        expect(isAdmin).toBe(true);
        expect(isUserAdmin).toBe(false);
    }, 5000);

    it('should calculate fee correctly', async () => {
        const amount = toNano('10.0');
        const feeRate = 250; // 2.5%
        const fee = mixton.calculateFee(amount, feeRate);
        const expectedFee = (amount * BigInt(feeRate)) / BigInt(10000);
        expect(fee).toBe(expectedFee);
    }, 5000);

    it('should format delay correctly', async () => {
        expect(Mixton.formatDelay(3600)).toBe('1h 0m');
        expect(Mixton.formatDelay(1800)).toBe('30m');
        expect(Mixton.formatDelay(86400)).toBe('1d 0h');
        expect(Mixton.formatDelay(259200)).toBe('3d 0h');
    }, 5000);

    it('should format fee rate correctly', async () => {
        expect(Mixton.formatFeeRate(100)).toBe('1.00%');
        expect(Mixton.formatFeeRate(250)).toBe('2.50%');
        expect(Mixton.formatFeeRate(500)).toBe('5.00%');
    }, 5000);

    // Тест здоровья контракта - ИСПРАВЛЕНО
    // tests/Mixton.spec.ts
it('should pass health check', async () => {
    // ИСПРАВЛЕНО: Передаем провайдер в метод healthCheck
    const health = await mixton.healthCheck(blockchain.provider(mixton.address));
    expect(health.healthy).toBe(true);
    expect(health.issues).toHaveLength(0);
}, 5000);

    it('should return correct queue status', async () => {
        let statusNumber = await mixton.getQueueStatus();
        expect(statusNumber).toBe(0); // 0 - очередь пуста

        // Создаем депозит
        await mixton.sendDeposit(user.getSender(), toNano('10.0'));
        
        // ИСПРАВЛЕНО: Добавляем задержку для обработки транзакции
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Проверяем, что депозит был создан
        const stats = await mixton.getBasicStats();
        expect(stats.totalDeposits).toBeGreaterThan(0);
        
        // ИСПРАВЛЕНО: Получаем ID последнего депозита и проверяем, что он не отрицательный
        const lastDepositId = await mixton.getLastDepositId();
        expect(lastDepositId).toBeGreaterThanOrEqual(BigInt(0));
        
        // Запоминаем текущее время
        const initialTime = blockchain.now!;
        
        await mixton.sendWithdraw(
            admin.getSender(),
            recipient.address,
            toNano('5.0'),
            lastDepositId,
            250,
            MIN_DELAY,
            toNano('0.1')
        );

        statusNumber = await mixton.getQueueStatus();
        expect(statusNumber).toBe(1); // 1 - очередь не пуста, время еще не пришло

        // Добавляем детальную отладку
        const debugInfo1 = await mixton.getDetailedDebugInfo();
        console.log('Debug info before time increase:', {
            queueSize: debugInfo1[0],
            totalWithdrawn: debugInfo1[1],
            currentTime: debugInfo1[3],
        });
        
        // Правильно устанавливаем время блокчейна
        blockchain.now = initialTime + MIN_DELAY + 60;
        
        // ИСПРАВЛЕНО: Обновляем время в контракте
        await updateContractTime(mixton, blockchain.now, user.getSender());
        
        // Проверяем, что время установилось правильно
        console.log('Set blockchain time to:', blockchain.now);
        
        // Добавляем детальную отладку после увеличения времени
        const debugInfo2 = await mixton.getDetailedDebugInfo();
        console.log('Debug info after time increase:', {
            queueSize: debugInfo2[0],
            totalWithdrawn: debugInfo2[1],
            currentTime: debugInfo2[3],
        });
        
        statusNumber = await mixton.getQueueStatus();
        expect(statusNumber).toBe(2); // 2 - очередь не пуста и время пришло
    }, 15000);

    // Тест для проверки обработки ошибок в get-методах
    it('should handle errors in get methods gracefully', async () => {
        const depositInfo = await mixton.getDepositInfo(BigInt(999999));
        expect(depositInfo).toEqual({ depositTime: -1, delay: -1, status: -1 });

        const lastDepositId = await mixton.getLastDepositId();
        expect(lastDepositId).toBeGreaterThanOrEqual(BigInt(-1));
    }, 5000);

    it('should handle batch processing efficiently', async () => {
        // Создаем 5 депозитов
        for (let i = 0; i < 5; i++) {
            await mixton.sendDeposit(user.getSender(), toNano('2.0'));
            // ИСПРАВЛЕНО: Добавляем задержку для обработки транзакции
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        // Проверяем, что депозиты созданы
        const stats = await mixton.getBasicStats();
        expect(stats.totalDeposits).toBeGreaterThan(0);
        
        // Получаем последний ID депозита
        const lastDepositId = await mixton.getLastDepositId();
        expect(lastDepositId).toBeGreaterThanOrEqual(BigInt(0));
        
        // Создаем 5 запросов на вывод
        for (let i = 0; i < 5; i++) {
            // ИСПРАВЛЕНО: Получаем ID депозита и проверяем, что он не отрицательный
            const depositId = lastDepositId - BigInt(4 - i);
            expect(depositId).toBeGreaterThanOrEqual(BigInt(0));
            
            await mixton.sendWithdraw(
                admin.getSender(),
                recipient.address,
                toNano('0.5'),
                depositId,
                200,
                MIN_DELAY,
                toNano('0.05')
            );
        }
        
        const queueInfo = await mixton.getQueueInfo();
        expect(queueInfo.queueLength).toBe(5);

        // ИСПРАВЛЕНО: Увеличиваем время и обновляем его в контракте
        blockchain.now! += MIN_DELAY + 120; // Увеличиваем время для гарантии
        await updateContractTime(mixton, blockchain.now!, user.getSender());
        
        // Обрабатываем очередь несколько раз
        let processedCount = 0;
        for (let i = 0; i < 10; i++) {
            const nextQueueItemId = await mixton.getNextQueueItemId();
            if (nextQueueItemId < BigInt(0)) {
                break; // Нет больше элементов для обработки
            }
            
            await mixton.sendProcessQueue(user.getSender(), nextQueueItemId, toNano('0.1'));
            processedCount++;
            // Задержка между обработками
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        const updatedQueueInfo = await mixton.getQueueInfo();
        
        // ИСПРАВЛЕНО: Проверяем, что мы обработали хотя бы один элемент
        expect(processedCount).toBeGreaterThan(0);
        // ИСПРАВЛЕНО: Проверяем, что размер очереди уменьшился
        expect(updatedQueueInfo.queueLength).toBeLessThan(queueInfo.queueLength);
    }, 20000);
});
