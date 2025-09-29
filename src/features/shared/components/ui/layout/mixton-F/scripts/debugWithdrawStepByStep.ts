// scripts/debugWithdrawStepByStep.ts
import { Mixton } from '../wrappers/Mixton';
import { toNano, beginCell, Address } from '@ton/core';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const ui = provider.ui();

    const mixton = provider.open(
        Mixton.createFromAddress(
            Address.parse('EQDWwgurseY38CKqLIYt6ZbkOR8BAkkP4jmS6r6iB22rf3xK')
        )
    );

    ui.write(`🔍 Deep Debug of Withdraw Function for: ${mixton.address.toString()}`);

    // Шаг 1: Проверяем начальное состояние
    ui.write(`\n=== Шаг 1: Начальное состояние ===`);
    
    try {
        const basicStats = await mixton.getBasicStats();
        ui.write(`Total Deposits: ${basicStats.totalDeposits}`);
        ui.write(`Total Withdrawn: ${basicStats.totalWithdrawn} TON`);
    } catch (error) {
        ui.write(`❌ Ошибка получения базовой статистики: ${error instanceof Error ? error.message : String(error)}`);
    }

    try {
        const queueInfo = await mixton.getQueueInfo();
        ui.write(`Queue Length: ${queueInfo.queueLength}`);
        ui.write(`Queue Amount: ${queueInfo.totalAmount} TON`);
    } catch (error) {
        ui.write(`❌ Ошибка получения информации об очереди: ${error instanceof Error ? error.message : String(error)}`);
    }

    // Шаг 2: Проверяем информацию о депозите
    ui.write(`\n=== Шаг 2: Проверка депозита #5 ===`);
    
    try {
        const depositInfo = await mixton.getDepositInfo(5n);
        ui.write(`Deposit #5 Info:`);
        ui.write(`  Time: ${depositInfo.depositTime}`);
        ui.write(`  Delay: ${depositInfo.delay}`);
        ui.write(`  Status: ${depositInfo.status}`);
    } catch (error) {
        ui.write(`❌ Ошибка получения информации о депозите: ${error instanceof Error ? error.message : String(error)}`);
    }

    // Шаг 3: Создаем простой вывод (не множественный)
    ui.write(`\n=== Шаг 3: Создание простого вывода ===`);
    
    try {
        const recipient = Address.parse('EQDi6a6j5TUfF5dZcDvDZaYrG7YzxHAF7omZubrNJgJdxefE');
        const amount = toNano('0.3');
        const feeRate = 200; // 2%
        const delay = 30; // 30 секунд
        
        ui.write(`Создание вывода:`);
        ui.write(`  Recipient: ${recipient.toString()}`);
        ui.write(`  Amount: ${amount} TON`);
        ui.write(`  Fee Rate: ${feeRate / 100}%`);
        ui.write(`  Delay: ${delay} seconds`);
        
        // Формируем сообщение вручную для проверки
        const messageBody = beginCell()
            .storeUint(0x695f7764, 32) // OP_WITHDRAW
            .storeRef(beginCell().storeAddress(recipient).endCell())
            .storeCoins(amount)
            .storeUint(5, 64) // depositId
            .storeUint(feeRate, 32)
            .storeUint(delay, 32)
            .endCell();
        
        ui.write(`Message Body Hash: ${messageBody.hash().toString('hex')}`);
        ui.write(`Message Body Bits: ${messageBody.bits}`);
        
        // Отправляем сообщение
        await mixton.sendInternal(provider.sender(), {
            value: toNano('0.1'),
            body: messageBody,
            bounce: false
        });
        
        ui.write(`✅ Сообщение вывода отправлено!`);
        
        // Ждем обработки
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Проверяем состояние после создания вывода
        const queueInfoAfter = await mixton.getQueueInfo();
        ui.write(`Queue Length после создания вывода: ${queueInfoAfter.queueLength}`);
        ui.write(`Queue Amount после создания вывода: ${queueInfoAfter.totalAmount} TON`);
        
        // Проверяем статус депозита
        const depositInfoAfter = await mixton.getDepositInfo(5n);
        ui.write(`Deposit #5 Status после создания вывода: ${depositInfoAfter.status}`);
        
    } catch (error) {
        ui.write(`❌ Ошибка создания вывода: ${error instanceof Error ? error.message : String(error)}`);
    }

    // Шаг 4: Проверяем очередь напрямую
    ui.write(`\n=== Шаг 4: Проверка очереди ===`);
    
    try {
        const queueDetails = await mixton.getQueueDetails();
        ui.write(`Queue Details:`);
        ui.write(`  Length: ${queueDetails.queueLength}`);
        ui.write(`  Total Amount: ${queueDetails.totalAmount} TON`);
        ui.write(`  Next Time: ${queueDetails.nextTime}`);
        
        const queueStatus = await mixton.getQueueStatus();
        ui.write(`Queue Status: ${queueStatus} (0=пуста, 1=ожидает, 2=готова)`);
        
        const minNextTime = await mixton.getMinNextTime();
        ui.write(`Min Next Time: ${minNextTime}`);
        
    } catch (error) {
        ui.write(`❌ Ошибка проверки очереди: ${error instanceof Error ? error.message : String(error)}`);
    }

    // Шаг 5: Обрабатываем очередь
    ui.write(`\n=== Шаг 5: Обработка очереди ===`);
    
    try {
        const balanceBefore = await provider.provider(mixton.address).getState();
        ui.write(`Contract Balance Before Processing: ${balanceBefore.balance} TON`);
        
        // Отправляем команду обработки очереди
        await mixton.sendProcessQueue(provider.sender(), toNano('0.05'));
        ui.write(`✅ Команда обработки очереди отправлена!`);
        
        // Ждем обработки
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Проверяем состояние после обработки
        const balanceAfter = await provider.provider(mixton.address).getState();
        ui.write(`Contract Balance After Processing: ${balanceAfter.balance} TON`);
        ui.write(`Balance Change: ${balanceAfter.balance - balanceBefore.balance} TON`);
        
        // Проверяем очередь снова
        const queueInfoAfterProcess = await mixton.getQueueInfo();
        ui.write(`Queue Length после обработки: ${queueInfoAfterProcess.queueLength}`);
        ui.write(`Queue Amount после обработки: ${queueInfoAfterProcess.totalAmount} TON`);
        
        // Проверяем статистику
        const statsAfter = await mixton.getBasicStats();
        ui.write(`Total Withdrawn после обработки: ${statsAfter.totalWithdrawn} TON`);
        
    } catch (error) {
        ui.write(`❌ Ошибка обработки очереди: ${error instanceof Error ? error.message : String(error)}`);
    }

    // Шаг 6: Проверяем историю транзакций
    ui.write(`\n=== Шаг 6: Проверка истории транзакций ===`);
    
    try {
        const history = await mixton.getTransactionHistory();
        ui.write(`Transaction History Records: ${history.bits} bits`);
        ui.write(`Transaction History Cells: ${history.cells.length}`);
        
        // Проверяем производительность
        const perfStats = await mixton.getPerformanceStats();
        ui.write(`Performance Stats:`);
        ui.write(`  Last Processed Time: ${new Date(perfStats.lastProcessedTime * 1000).toISOString()}`);
        ui.write(`  Failed Transactions: ${perfStats.failedTransactions}`);
        ui.write(`  Current Queue Size: ${perfStats.queueSize}`);
        
    } catch (error) {
        ui.write(`❌ Ошибка проверки истории: ${error instanceof Error ? error.message : String(error)}`);
    }

    // Шаг 7: Проверяем балансы получателей
    ui.write(`\n=== Шаг 7: Проверка балансов получателей ===`);
    
    const recipients = [
        { name: 'Recipient 1', address: 'EQCD--pPXB5Q8zE1MqTj2b7P4uZJ5gK6sLqT3V7JYmN9kXpLqT' },
        { name: 'Recipient 2', address: 'EQDi6a6j5TUfF5dZcDvDZaYrG7YzxHAF7omZubrNJgJdxefE' },
        { name: 'Recipient 3', address: 'EQAHYc6-e1vgRLTAVGnHxUcHx4vIhuVFbcn912rBFLkOLEZW' }
    ];
    
    for (const recipient of recipients) {
        try {
            const recipientState = await provider.provider(Address.parse(recipient.address)).getState();
            ui.write(`${recipient.name} Balance: ${recipientState.balance} TON`);
        } catch (error) {
            ui.write(`❌ Ошибка получения баланса ${recipient.name}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    ui.write(`\n🎯 Анализ завершен!`);
}