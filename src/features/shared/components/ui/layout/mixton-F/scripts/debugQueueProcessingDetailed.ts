// scripts/debugQueueProcessingDetailed.ts
import { Address, toNano, beginCell } from '@ton/core';
import { Mixton } from '../wrappers/Mixton';
import { NetworkProvider } from '@ton/blueprint';

// Вспомогательная функция для форматирования суммы
function formatAmount(amount: bigint): string {
    return (Number(amount) / 1000000000).toFixed(9);
}

export async function run(provider: NetworkProvider) {
    const ui = provider.ui();

    const contractAddressFromEnv = process.env.CONTRACT_ADDRESS;
    if (!contractAddressFromEnv) {
        throw new Error('Contract address not found. Please set CONTRACT_ADDRESS in your .env file.');
    }
    const contractAddress = Address.parse(contractAddressFromEnv);
    const mixton = provider.open(Mixton.createFromAddress(contractAddress));

    ui.write(`🔍 Debug Queue Processing for: ${mixton.address.toString()}\n`);

    // Получаем текущее состояние
    const basicStatsBefore = await mixton.getBasicStats();
    const queueInfoBefore = await mixton.getQueueInfo();
    const queueDetailsBefore = await mixton.getQueueDetails();
    const queueStatusBefore = await mixton.getQueueStatus();

    ui.write(`📊 State Before Processing:`);
    ui.write(`   Total Deposits: ${basicStatsBefore.totalDeposits}`);
    ui.write(`   Total Withdrawn: ${formatAmount(basicStatsBefore.totalWithdrawn)} TON`);
    ui.write(`   Queue Length: ${queueInfoBefore.queueLength}`);
    ui.write(`   Queue Amount: ${formatAmount(queueInfoBefore.totalAmount)} TON`);
    ui.write(`   Queue Status: ${queueStatusBefore === 0 ? 'Empty' : queueStatusBefore === 1 ? 'Waiting' : 'Ready'}`);
    ui.write(`   Queue Details: Length=${queueDetailsBefore.queueLength}, Amount=${formatAmount(queueDetailsBefore.totalAmount)} TON, NextTime=${queueDetailsBefore.nextTime}`);

    // Проверяем время следующей обработки
    const currentTime = Math.floor(Date.now() / 1000);
    const nextTime = queueDetailsBefore.nextTime;
    const timeUntilNext = nextTime > 0 ? nextTime - currentTime : -1;

    ui.write(`\n⏰ Timing Information:`);
    ui.write(`   Current Time: ${new Date(currentTime * 1000).toISOString()}`);
    ui.write(`   Next Processing Time: ${nextTime > 0 ? new Date(nextTime * 1000).toISOString() : 'N/A'}`);
    ui.write(`   Time Until Next Processing: ${timeUntilNext > 0 ? `${timeUntilNext} seconds` : 'Ready now'}`);

    // Получаем балансы
    const getBalance = async (address: Address) => {
        try {
            const state = await provider.provider(address).getState();
            return state.balance;
        } catch (e) {
            return 0n;
        }
    };

    const contractBalanceBefore = await mixton.getBalance();
    const adminBalanceBefore = await getBalance(await mixton.getAdmin());

    ui.write(`\n💰 Balances Before Processing:`);
    ui.write(`   Contract: ${formatAmount(contractBalanceBefore)} TON`);
    ui.write(`   Admin: ${formatAmount(adminBalanceBefore)} TON`);

    // Проверяем, нужно ли ждать
    if (timeUntilNext > 0) {
        ui.write(`\n⏳ Queue is not ready yet. Waiting ${timeUntilNext} seconds...`);
        
        // Ждем необходимое время
        await new Promise(resolve => setTimeout(resolve, timeUntilNext * 1000));
        
        ui.write(`   ✅ Wait completed. Queue should be ready now.`);
    }

    // Получаем адрес получателя из очереди для проверки баланса
    const recipientAddress = Address.parse('0QDi6a6j5TUfF5dZcDvDZaYrG7YzxHAF7omZubrNJgJdxQGL');
    const recipientBalanceBefore = await getBalance(recipientAddress);
    ui.write(`   Recipient Balance Before: ${formatAmount(recipientBalanceBefore)} TON`);

    // Отправляем команду обработки очереди
    ui.write(`\n⚙️ Sending queue processing command...`);
    
    try {
        // Используем sendProcessQueue и проверяем состояние после
        await mixton.sendProcessQueue(provider.sender(), toNano('0.05'));
        ui.write(`   ✅ Queue processing command sent successfully!`);

        // Ждем для обработки транзакции
        ui.write(`\n⏳ Waiting for transaction to settle...`);
        await new Promise(resolve => setTimeout(resolve, 10000)); // Увеличили время ожидания

        // Проверяем состояние после обработки
        ui.write(`\n📊 State After Processing:`);
        const basicStatsAfter = await mixton.getBasicStats();
        const queueInfoAfter = await mixton.getQueueInfo();
        const queueDetailsAfter = await mixton.getQueueDetails();
        const queueStatusAfter = await mixton.getQueueStatus();

        ui.write(`   Total Deposits: ${basicStatsAfter.totalDeposits}`);
        ui.write(`   Total Withdrawn: ${formatAmount(basicStatsAfter.totalWithdrawn)} TON`);
        ui.write(`   Queue Length: ${queueInfoAfter.queueLength}`);
        ui.write(`   Queue Amount: ${formatAmount(queueInfoAfter.totalAmount)} TON`);
        ui.write(`   Queue Status: ${queueStatusAfter === 0 ? 'Empty' : queueStatusAfter === 1 ? 'Waiting' : 'Ready'}`);
        ui.write(`   Queue Details: Length=${queueDetailsAfter.queueLength}, Amount=${formatAmount(queueDetailsAfter.totalAmount)} TON, NextTime=${queueDetailsAfter.nextTime}`);

        // Получаем балансы после обработки
        const contractBalanceAfter = await mixton.getBalance();
        const adminBalanceAfter = await getBalance(await mixton.getAdmin());
        const recipientBalanceAfter = await getBalance(recipientAddress);

        ui.write(`\n💰 Balances After Processing:`);
        ui.write(`   Contract: ${formatAmount(contractBalanceAfter)} TON`);
        ui.write(`   Admin: ${formatAmount(adminBalanceAfter)} TON`);
        ui.write(`   Recipient: ${formatAmount(recipientBalanceAfter)} TON`);

        ui.write(`\n💸 Balance Changes:`);
        ui.write(`   Contract: ${formatAmount(contractBalanceAfter - contractBalanceBefore)} TON`);
        ui.write(`   Admin: ${formatAmount(adminBalanceAfter - adminBalanceBefore)} TON`);
        ui.write(`   Recipient: ${formatAmount(recipientBalanceAfter - recipientBalanceBefore)} TON`);

        // Проверяем изменения
        const queueLengthChanged = queueInfoBefore.queueLength !== queueInfoAfter.queueLength;
        const totalWithdrawnChanged = basicStatsBefore.totalWithdrawn !== basicStatsAfter.totalWithdrawn;
        const contractBalanceChanged = contractBalanceBefore !== contractBalanceAfter;
        const recipientBalanceChanged = recipientBalanceBefore !== recipientBalanceAfter;

        ui.write(`\n📈 Changes Detected:`);
        ui.write(`   Queue Length Changed: ${queueLengthChanged}`);
        ui.write(`   Total Withdrawn Changed: ${totalWithdrawnChanged}`);
        ui.write(`   Contract Balance Changed: ${contractBalanceChanged}`);
        ui.write(`   Recipient Balance Changed: ${recipientBalanceChanged}`);

        if (!queueLengthChanged && !totalWithdrawnChanged && !contractBalanceChanged && !recipientBalanceChanged) {
            ui.write(`   ⚠️  No changes detected - this indicates the queue processing function is not working properly`);
        } else {
            ui.write(`   ✅ Some changes detected - processing may have worked partially`);
        }

        // Проверяем историю транзакций
        const history = await mixton.getTransactionHistory();
        ui.write(`\n📋 Transaction History Records: ${history.length}`);

        // Анализируем результаты
        ui.write(`\n🔍 Analysis:`);
        
        if (queueInfoAfter.queueLength === 0 && queueInfoBefore.queueLength > 0) {
            ui.write(`   ✅ Queue was processed successfully (length decreased from ${queueInfoBefore.queueLength} to 0)`);
        } else if (queueInfoAfter.queueLength < queueInfoBefore.queueLength) {
            ui.write(`   ⚠️  Queue was partially processed (length decreased from ${queueInfoBefore.queueLength} to ${queueInfoAfter.queueLength})`);
        } else {
            ui.write(`   ❌ Queue was not processed (length remained ${queueInfoAfter.queueLength})`);
        }

        if (basicStatsAfter.totalWithdrawn > basicStatsBefore.totalWithdrawn) {
            ui.write(`   ✅ Total withdrawn increased by ${formatAmount(basicStatsAfter.totalWithdrawn - basicStatsBefore.totalWithdrawn)} TON`);
        } else {
            ui.write(`   ❌ Total withdrawn did not change`);
        }

        if (recipientBalanceAfter > recipientBalanceBefore) {
            ui.write(`   ✅ Recipient received ${formatAmount(recipientBalanceAfter - recipientBalanceBefore)} TON`);
        } else {
            ui.write(`   ❌ Recipient did not receive any funds`);
        }

        // Если очередь все еще не пуста, пробуем еще раз
        if (queueInfoAfter.queueLength > 0) {
            ui.write(`\n🔄 Queue is still not empty. Trying one more time...`);
            
            try {
                await mixton.sendProcessQueue(provider.sender(), toNano('0.05'));
                ui.write(`   ✅ Second processing command sent!`);
                
                // Ждем и проверяем снова
                await new Promise(resolve => setTimeout(resolve, 10000));
                
                const finalQueueInfo = await mixton.getQueueInfo();
                const finalBasicStats = await mixton.getBasicStats();
                const finalRecipientBalance = await getBalance(recipientAddress);
                
                ui.write(`   Final Queue Length: ${finalQueueInfo.queueLength}`);
                ui.write(`   Final Total Withdrawn: ${formatAmount(finalBasicStats.totalWithdrawn)} TON`);
                ui.write(`   Final Recipient Balance: ${formatAmount(finalRecipientBalance)} TON`);
                
                if (finalQueueInfo.queueLength === 0) {
                    ui.write(`   ✅ Queue is now empty! Processing successful.`);
                } else {
                    ui.write(`   ❌ Queue is still not empty. There may be an issue with the processing logic.`);
                }
            } catch (error) {
                ui.write(`   ❌ Error sending second processing command: ${error instanceof Error ? error.message : String(error)}`);
            }
        }

        // Дополнительная отладочная информация
        ui.write(`\n🔧 Additional Debug Info:`);
        ui.write(`   Contract Address: ${mixton.address.toString()}`);
        
        const senderAddress = provider.sender();
        if (senderAddress && senderAddress.address) {
            ui.write(`   Sender Address: ${senderAddress.address.toString()}`);
        }
        
        ui.write(`   Recipient Address: ${recipientAddress.toString()}`);
        
        const adminAddress = await mixton.getAdmin();
        ui.write(`   Admin Address: ${adminAddress.toString()}`);

        // Проверяем производительность с правильной обработкой типа
        try {
            const perfStats = await mixton.getPerformanceStats();
            ui.write(`   Last Processed Time: ${perfStats.lastProcessedTime > 0 ? new Date(perfStats.lastProcessedTime * 1000).toISOString() : 'Never'}`);
            ui.write(`   Failed Transactions: ${perfStats.failedTransactions}`);
            ui.write(`   Current Queue Size: ${perfStats.queueSize}`);
        } catch (error) {
            ui.write(`   Performance Stats: Error retrieving - ${error instanceof Error ? error.message : String(error)}`);
        }

    } catch (error) {
        ui.write(`❌ Error sending queue processing command: ${error instanceof Error ? error.message : String(error)}`);
    }
}