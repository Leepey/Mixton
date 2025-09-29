// scripts/debugQueueSimple.ts
import { Address, toNano } from '@ton/core';
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

    ui.write('🔍 Debug Queue Processing for: ' + mixton.address.toString() + '\n');

    // Получаем текущее состояние
    const queueInfo = await mixton.getQueueInfo();
    const queueDetails = await mixton.getQueueDetails();
    const basicStats = await mixton.getBasicStats();
    const contractBalance = (await provider.provider(contractAddress).getState()).balance;

    ui.write('📊 Initial State:');
    ui.write('   Queue Length: ' + queueInfo.queueLength);
    ui.write('   Queue Amount: ' + formatAmount(queueInfo.totalAmount) + ' TON');
    ui.write('   Next Processing Time: ' + (queueDetails.nextTime === -1 ? 'N/A' : new Date(queueDetails.nextTime * 1000).toISOString()));
    ui.write('   Total Withdrawn: ' + formatAmount(basicStats.totalWithdrawn) + ' TON');
    ui.write('   Contract Balance: ' + formatAmount(contractBalance) + ' TON');

    // Проверяем текущее время блокчейна
    const currentTime = Math.floor(Date.now() / 1000);
    ui.write('\n⏰ Current Time: ' + new Date(currentTime * 1000).toISOString());
    ui.write('   Time Until Next Processing: ' + (queueDetails.nextTime === -1 ? 'N/A' : Math.max(0, queueDetails.nextTime - currentTime)) + ' seconds');

    // Используем адрес отправителя как получателя для теста
    const sender = provider.sender().address;
    if (!sender) {
        ui.write('❌ Sender address not available');
        return;
    }

    const balanceBefore = (await provider.provider(sender).getState()).balance;
    ui.write('\n💳 Sender Balance Before Processing: ' + formatAmount(balanceBefore) + ' TON');

    // Отправляем команду обработки очереди
    ui.write('\n⚙️ Sending queue processing command...');
    try {
        const result = await mixton.sendProcessQueue(provider.sender(), toNano('0.05'));
        ui.write('✅ Queue processing command sent successfully!');

        // Проверяем транзакции
        const transactions = result as any;
        if (transactions && transactions.transactions && Array.isArray(transactions.transactions)) {
            const processingTx = transactions.transactions.find((tx: any) => 
                tx.inMessage && 
                tx.inMessage.info && 
                tx.inMessage.info.dest && 
                tx.inMessage.info.dest.toString() === mixton.address.toString() &&
                tx.inMessage.info.src?.toString() === provider.sender().address?.toString()
            );

            if (processingTx) {
                ui.write('\n📋 Processing Transaction Details:');
                ui.write('   Success: ' + (processingTx.description?.computePhase?.success === true));
                ui.write('   Exit Code: ' + processingTx.description?.computePhase?.exitCode);
                ui.write('   Gas Used: ' + (processingTx.totalFees ? formatAmount(processingTx.totalFees) : 'N/A') + ' TON');
                
                if (processingTx.description?.computePhase?.success !== true) {
                    ui.write('❌ Transaction failed with exit code: ' + processingTx.description?.computePhase?.exitCode);
                }

                // Проверяем исходящие сообщения
                if (processingTx.outMessages && processingTx.outMessages.length > 0) {
                    ui.write('   Out Messages: ' + processingTx.outMessages.length);
                    processingTx.outMessages.forEach((msg: any, index: number) => {
                        if (msg.info && msg.info.dest) {
                            const amount = msg.info.value || 0n;
                            ui.write('     Message ' + (index + 1) + ': To ' + msg.info.dest.toString() + ', Amount: ' + formatAmount(amount) + ' TON');
                        }
                    });
                } else {
                    ui.write('   No Out Messages');
                }
            }
        }

    } catch (error) {
        ui.write('❌ Error sending queue processing: ' + (error instanceof Error ? error.message : String(error)));
        return;
    }

    // Проверяем состояние после обработки
    ui.write('\n📊 State After Processing:');
    const queueInfoAfter = await mixton.getQueueInfo();
    const queueDetailsAfter = await mixton.getQueueDetails();
    const basicStatsAfter = await mixton.getBasicStats();
    const contractBalanceAfter = (await provider.provider(contractAddress).getState()).balance;

    ui.write('   Queue Length: ' + queueInfoAfter.queueLength);
    ui.write('   Queue Amount: ' + formatAmount(queueInfoAfter.totalAmount) + ' TON');
    ui.write('   Total Withdrawn: ' + formatAmount(basicStatsAfter.totalWithdrawn) + ' TON');
    ui.write('   Contract Balance: ' + formatAmount(contractBalanceAfter) + ' TON');
    ui.write('   Balance Change: ' + formatAmount(contractBalanceAfter - contractBalance) + ' TON');

    // Проверяем баланс отправителя после
    const balanceAfter = (await provider.provider(sender).getState()).balance;
    ui.write('\n💳 Sender Balance After Processing: ' + formatAmount(balanceAfter) + ' TON');
    ui.write('   Balance Change: ' + formatAmount(balanceAfter - balanceBefore) + ' TON');

    // Анализируем результат
    ui.write('\n🔍 Analysis:');
    
    if (queueInfoAfter.queueLength === queueInfo.queueLength) {
        ui.write('❌ Queue length did not change - processing failed');
    } else {
        ui.write('✅ Queue length changed from ' + queueInfo.queueLength + ' to ' + queueInfoAfter.queueLength);
    }

    if (basicStatsAfter.totalWithdrawn > basicStats.totalWithdrawn) {
        ui.write('✅ Total withdrawn increased from ' + formatAmount(basicStats.totalWithdrawn) + ' to ' + formatAmount(basicStatsAfter.totalWithdrawn) + ' TON');
    } else {
        ui.write('❌ Total withdrawn did not change');
    }

    if (balanceAfter > balanceBefore) {
        ui.write('✅ Sender received ' + formatAmount(balanceAfter - balanceBefore) + ' TON');
    } else {
        ui.write('❌ Sender did not receive any funds');
    }

    // Проверяем историю транзакций
    const history = await mixton.getTransactionHistory();
    ui.write('\n📋 Transaction History: ' + history.length + ' records');
    
    // Проверяем детали депозитов - ИСПРАВЛЕНО
    ui.write('\n💰 Deposits Information:');
    const lastDepositId = await mixton.getLastDepositId();
    const startId = Math.max(0, Number(lastDepositId) - 3);
    const endId = Number(lastDepositId);
    
    for (let i = startId; i <= endId; i++) {
        const depositInfo = await mixton.getDepositInfo(BigInt(i));
        if (depositInfo && depositInfo.depositTime !== -1) {
            const status = depositInfo.status === 0 ? 'Pending' : depositInfo.status === 1 ? 'Processed' : 'Failed';
            ui.write('   Deposit #' + i + ': ' + status + ', Time: ' + new Date(depositInfo.depositTime * 1000).toISOString());
        }
    }
}