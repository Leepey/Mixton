// scripts/debugFinalAnalysis.ts
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

    ui.write(`🔍 Final Analysis for: ${mixton.address.toString()}\n`);

    // Проверяем текущее состояние
    const basicStats = await mixton.getBasicStats();
    const queueInfo = await mixton.getQueueInfo();
    const queueDetails = await mixton.getQueueDetails();
    const queueStatus = await mixton.getQueueStatus();
    const perfStats = await mixton.getPerformanceStats();

    ui.write(`📊 Current State:`);
    ui.write(`   Total Deposits: ${basicStats.totalDeposits}`);
    ui.write(`   Total Withdrawn: ${formatAmount(basicStats.totalWithdrawn)} TON`);
    ui.write(`   Queue Length: ${queueInfo.queueLength}`);
    ui.write(`   Queue Amount: ${formatAmount(queueInfo.totalAmount)} TON`);
    ui.write(`   Queue Status: ${queueStatus === 0 ? 'Empty' : queueStatus === 1 ? 'Waiting' : 'Ready'}`);
    ui.write(`   Queue Details: Length=${queueDetails.queueLength}, Amount=${formatAmount(queueDetails.totalAmount)} TON, NextTime=${queueDetails.nextTime}`);
    ui.write(`   Performance Stats: Last Processed=${perfStats.lastProcessedTime > 0 ? new Date(perfStats.lastProcessedTime * 1000).toISOString() : 'Never'}, Failed=${perfStats.failedTransactions}, Queue Size=${perfStats.queueSize}`);

    // Проверяем все депозиты
    ui.write(`\n💰 Deposits Status:`);
    for (let i = 0; i <= 4; i++) {
        const depositInfo = await mixton.getDepositInfo(BigInt(i));
        if (depositInfo) {
            ui.write(`   Deposit #${i}: ${depositInfo.status === 0 ? 'Pending' : depositInfo.status === 1 ? 'Processed' : 'Failed'}`);
        } else {
            ui.write(`   Deposit #${i}: Not found`);
        }
    }

    // Проверяем баланс контракта
    const contractBalance = await mixton.getBalance();
    ui.write(`\n💰 Contract Balance: ${formatAmount(contractBalance)} TON`);

    // Тестируем создание нового вывода
    ui.write(`\n📝 Testing new withdrawal creation...`);
    
    // Находим доступный депозит
    let availableDepositId = -1;
    for (let i = 0; i <= 4; i++) {
        const depositInfo = await mixton.getDepositInfo(BigInt(i));
        if (depositInfo && depositInfo.status === 0) { // Pending
            availableDepositId = i;
            break;
        }
    }

    if (availableDepositId === -1) {
        ui.write(`   ❌ No available deposits found for testing.`);
        
        // Создаем новый депозит для тестирования
        ui.write(`\n💰 Creating new deposit for testing...`);
        try {
            await mixton.sendDeposit(provider.sender(), toNano('1'));
            ui.write(`   ✅ New deposit created successfully!`);
            
            // Ждем немного и проверяем ID нового депозита
            await new Promise(resolve => setTimeout(resolve, 3000));
            const newLastDepositId = await mixton.getLastDepositId();
            ui.write(`   New Deposit ID: #${newLastDepositId}`);
            availableDepositId = Number(newLastDepositId);
        } catch (error) {
            ui.write(`   ❌ Error creating deposit: ${error instanceof Error ? error.message : String(error)}`);
            return;
        }
    }

    ui.write(`   Using Deposit #${availableDepositId} for testing`);

    // Создаем простой вывод
    const recipient = Address.parse('0QDi6a6j5TUfF5dZcDvDZaYrG7YzxHAF7omZubrNJgJdxQGL');
    const amount = toNano('0.3');
    const feeRate = 200;
    const delay = 30;

    ui.write(`   Creating withdrawal: ${formatAmount(amount)} TON to ${recipient.toString().slice(0, 10)}...`);

    try {
        const result = await mixton.sendWithdraw(
            provider.sender(),
            recipient,
            amount,
            BigInt(availableDepositId),
            feeRate,
            delay,
            toNano('0.05')
        );
        ui.write(`   ✅ Withdrawal created successfully!`);

        // Проверяем состояние после создания вывода
        const queueInfoAfter = await mixton.getQueueInfo();
        const queueDetailsAfter = await mixton.getQueueDetails();
        const depositInfoAfter = await mixton.getDepositInfo(BigInt(availableDepositId));

        ui.write(`   Queue Length After: ${queueInfoAfter.queueLength}`);
        ui.write(`   Queue Amount After: ${formatAmount(queueInfoAfter.totalAmount)} TON`);
        if (depositInfoAfter) {
            ui.write(`   Deposit Status After: ${depositInfoAfter.status === 0 ? 'Pending' : depositInfoAfter.status === 1 ? 'Processed' : 'Failed'}`);
        }

        // Если очередь не пуста, пробуем обработать ее сразу
        if (queueInfoAfter.queueLength > 0) {
            ui.write(`\n⚙️ Processing queue immediately...`);
            
            // Ждем время задержки
            ui.write(`   Waiting ${delay} seconds for delay...`);
            await new Promise(resolve => setTimeout(resolve, delay * 1000));
            
            try {
                const processResult = await mixton.sendProcessQueue(provider.sender(), toNano('0.05'));
                ui.write(`   ✅ Queue processing sent!`);

                // Ждем обработки
                await new Promise(resolve => setTimeout(resolve, 5000));

                // Проверяем финальное состояние
                const finalQueueInfo = await mixton.getQueueInfo();
                const finalBasicStats = await mixton.getBasicStats();
                const finalDepositInfo = await mixton.getDepositInfo(BigInt(availableDepositId));

                ui.write(`   Final Queue Length: ${finalQueueInfo.queueLength}`);
                ui.write(`   Final Total Withdrawn: ${formatAmount(finalBasicStats.totalWithdrawn)} TON`);
                if (finalDepositInfo) {
                    ui.write(`   Final Deposit Status: ${finalDepositInfo.status === 0 ? 'Pending' : finalDepositInfo.status === 1 ? 'Processed' : 'Failed'}`);
                }

                if (finalQueueInfo.queueLength === 0) {
                    ui.write(`   ✅ SUCCESS: Queue processed successfully!`);
                } else {
                    ui.write(`   ❌ ISSUE: Queue still not empty after processing`);
                }

            } catch (error) {
                ui.write(`   ❌ Error processing queue: ${error instanceof Error ? error.message : String(error)}`);
            }
        } else {
            ui.write(`   ❌ ISSUE: Queue is empty after creating withdrawal`);
        }

    } catch (error) {
        ui.write(`   ❌ Error creating withdrawal: ${error instanceof Error ? error.message : String(error)}`);
    }

    // Финальная проверка состояния
    ui.write(`\n📋 Final State Summary:`);
    const finalBasicStats = await mixton.getBasicStats();
    const finalQueueInfo = await mixton.getQueueInfo();
    const finalPerfStats = await mixton.getPerformanceStats();

    ui.write(`   Total Deposits: ${finalBasicStats.totalDeposits}`);
    ui.write(`   Total Withdrawn: ${formatAmount(finalBasicStats.totalWithdrawn)} TON`);
    ui.write(`   Queue Length: ${finalQueueInfo.queueLength}`);
    ui.write(`   Last Processed Time: ${finalPerfStats.lastProcessedTime > 0 ? new Date(finalPerfStats.lastProcessedTime * 1000).toISOString() : 'Never'}`);
    ui.write(`   Failed Transactions: ${finalPerfStats.failedTransactions}`);

    ui.write(`\n🎯 CONCLUSION:`);
    if (finalQueueInfo.queueLength === 0) {
        ui.write(`   ✅ The contract is working correctly now.`);
        ui.write(`   The issue might have been temporary or related to specific conditions.`);
    } else {
        ui.write(`   ⚠️  There are still issues with the contract.`);
        ui.write(`   The queue processing function may need further investigation.`);
    }
}