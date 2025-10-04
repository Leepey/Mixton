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

describe('Mixton Performance Tests', () => {
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

    it('should measure gas consumption for deposits', async () => {
        const gasConsumptions: number[] = [];
        
        // Создаем несколько депозитов и измеряем потребление газа
        for (let i = 0; i < 5; i++) {
            const depositResult = await mixton.sendDeposit(user.getSender(), toNano('1.0'));
            
            // Добавляем задержку для обработки транзакции
            await new Promise(resolve => setTimeout(resolve, 200));
            
            const tx = findTransactionByAddresses(depositResult.transactions, user.address, mixton.address);
            if (tx && tx.description && tx.description.computePhase) {
                const gasUsed = tx.description.computePhase.gasUsed || 0;
                gasConsumptions.push(gasUsed);
            }
        }
        
        // ИСПРАВЛЕНО: Правильно вычисляем среднее значение с использованием BigInt
        const totalGas = gasConsumptions.reduce((sum, gas) => BigInt(sum) + BigInt(gas), BigInt(0));
        const averageGas = Number(totalGas) / gasConsumptions.length;
        console.log(`Average gas per deposit: ${averageGas}`);
        
        // Проверяем, что потребление газа находится в разумных пределах
        expect(averageGas).toBeLessThan(50000);
        expect(averageGas).toBeGreaterThan(10000);
    }, 15000);

    it('should handle large batches efficiently', async () => {
        // Создаем несколько депозитов
        for (let i = 0; i < 10; i++) {
            await mixton.sendDeposit(user.getSender(), toNano('2.0'));
            // Добавляем задержку для обработки транзакции
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        // Проверяем, что депозиты созданы
        const stats = await mixton.getBasicStats();
        expect(stats.totalDeposits).toBeGreaterThan(0);
        
        // Получаем последний ID депозита
        const lastDepositId = await mixton.getLastDepositId();
        expect(lastDepositId).toBeGreaterThanOrEqual(BigInt(0));
        
        // Создаем несколько запросов на вывод
        for (let i = 0; i < 10; i++) {
            const depositId = lastDepositId - BigInt(9 - i);
            expect(depositId).toBeGreaterThanOrEqual(BigInt(0));
            
            await mixton.sendWithdraw(
                admin.getSender(),
                recipient.address,
                toNano('0.5'),
                depositId,
                200,
                30, // Минимальная задержка
                toNano('0.05')
            );
        }
        
        const queueInfo = await mixton.getQueueInfo();
        expect(queueInfo.queueLength).toBe(10);
        
        // Увеличиваем время и обновляем его в контракте
        blockchain.now! += 120;
        await updateContractTime(mixton, blockchain.now!, user.getSender());
        
        // Обрабатываем очередь пакетами
        let processedCount = 0;
        const startTime = Date.now();
        
        for (let i = 0; i < 15; i++) {
            const nextQueueItemId = await mixton.getNextQueueItemId();
            if (nextQueueItemId < BigInt(0)) {
                break;
            }
            
            await mixton.sendProcessQueue(user.getSender(), nextQueueItemId, toNano('0.05'));
            processedCount++;
            // Небольшая задержка между обработками
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        const endTime = Date.now();
        const processingTime = endTime - startTime;
        
        console.log(`Processed ${processedCount} items in ${processingTime}ms`);
        
        // Проверяем, что обработка была эффективной
        expect(processedCount).toBeGreaterThan(0);
        expect(processingTime).toBeLessThan(10000); // Менее 10 секунд на обработку
    }, 20000);

    it('should process multiple queue items efficiently', async () => {
        // Создаем депозиты
        for (let i = 0; i < 5; i++) {
            await mixton.sendDeposit(user.getSender(), toNano('3.0'));
            // Добавляем задержку для обработки транзакции
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        // Проверяем, что депозиты созданы
        const stats = await mixton.getBasicStats();
        expect(stats.totalDeposits).toBeGreaterThan(0);
        
        // Получаем последний ID депозита
        const lastDepositId = await mixton.getLastDepositId();
        expect(lastDepositId).toBeGreaterThanOrEqual(BigInt(0));
        
        // Создаем запросы на вывод с разными задержками
        const delays = [30, 60, 90, 120, 150];
        for (let i = 0; i < 5; i++) {
            const depositId = lastDepositId - BigInt(4 - i);
            expect(depositId).toBeGreaterThanOrEqual(BigInt(0));
            
            await mixton.sendWithdraw(
                admin.getSender(),
                recipient.address,
                toNano('0.5'),
                depositId,
                200,
                delays[i],
                toNano('0.05')
            );
        }
        
        const queueInfo = await mixton.getQueueInfo();
        expect(queueInfo.queueLength).toBe(5);
        
        // Увеличиваем время и обновляем его в контракте
        blockchain.now! += 200;
        await updateContractTime(mixton, blockchain.now!, user.getSender());
        
        // Обрабатываем очередь
        let processedCount = 0;
        const startTime = Date.now();
        
        for (let i = 0; i < 10; i++) {
            const nextQueueItemId = await mixton.getNextQueueItemId();
            if (nextQueueItemId < BigInt(0)) {
                break;
            }
            
            await mixton.sendProcessQueue(user.getSender(), nextQueueItemId, toNano('0.05'));
            processedCount++;
            // Небольшая задержка между обработками
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        const endTime = Date.now();
        const processingTime = endTime - startTime;
        
        console.log(`Processed ${processedCount} items with different delays in ${processingTime}ms`);
        
        // Проверяем, что обработка была эффективной
        expect(processedCount).toBeGreaterThan(0);
        expect(processingTime).toBeLessThan(10000); // Менее 10 секунд на обработку
    }, 20000);

    it('should handle queue processing under high load', async () => {
        // Создаем много депозитов
        for (let i = 0; i < 20; i++) {
            await mixton.sendDeposit(user.getSender(), toNano('1.0'));
            // Добавляем задержку для обработки транзакции
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        // Проверяем, что депозиты созданы
        const stats = await mixton.getBasicStats();
        expect(stats.totalDeposits).toBeGreaterThan(0);
        
        // Получаем последний ID депозита
        const lastDepositId = await mixton.getLastDepositId();
        expect(lastDepositId).toBeGreaterThanOrEqual(BigInt(0));
        
        // Создаем много запросов на вывод
        for (let i = 0; i < 20; i++) {
            const depositId = lastDepositId - BigInt(19 - i);
            expect(depositId).toBeGreaterThanOrEqual(BigInt(0));
            
            await mixton.sendWithdraw(
                admin.getSender(),
                recipient.address,
                toNano('0.2'),
                depositId,
                200,
                30, // Минимальная задержка
                toNano('0.03')
            );
        }
        
        const queueInfo = await mixton.getQueueInfo();
        expect(queueInfo.queueLength).toBe(20);
        
        // Увеличиваем время и обновляем его в контракте
        blockchain.now! += 120;
        await updateContractTime(mixton, blockchain.now!, user.getSender());
        
        // Обрабатываем очередь под высокой нагрузкой
        let processedCount = 0;
        const startTime = Date.now();
        
        for (let i = 0; i < 25; i++) {
            const nextQueueItemId = await mixton.getNextQueueItemId();
            if (nextQueueItemId < BigInt(0)) {
                break;
            }
            
            await mixton.sendProcessQueue(user.getSender(), nextQueueItemId, toNano('0.03'));
            processedCount++;
            // Минимальная задержка между обработками
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        const endTime = Date.now();
        const processingTime = endTime - startTime;
        
        console.log(`Processed ${processedCount} items under high load in ${processingTime}ms`);
        
        // Проверяем, что обработка была эффективной даже под высокой нагрузкой
        expect(processedCount).toBeGreaterThan(0);
        expect(processingTime).toBeLessThan(15000); // Менее 15 секунд на обработку под высокой нагрузкой
    }, 30000);
});
