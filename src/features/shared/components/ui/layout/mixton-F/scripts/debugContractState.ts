// scripts/debugContractState.ts
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

    ui.write(`🔍 Debug Contract State for: ${mixton.address.toString()}\n`);

    // Получаем текущее состояние контракта
    const admin = await mixton.getAdmin();
    const basicStats = await mixton.getBasicStats();
    const queueInfo = await mixton.getQueueInfo();
    const queueDetails = await mixton.getQueueDetails();
    const lastDepositId = await mixton.getLastDepositId();
    const currentFeeRate = await mixton.getCurrentFeeRate();
    const signers = await mixton.getSigners();
    const performanceStats = await mixton.getPerformanceStats();

    ui.write(`📊 Basic Contract State:`);
    ui.write(`   Admin: ${admin.toString()}`);
    ui.write(`   Total Deposits: ${basicStats.totalDeposits}`);
    ui.write(`   Total Withdrawn: ${formatAmount(basicStats.totalWithdrawn)} TON`);
    ui.write(`   Current Fee Rate: ${currentFeeRate / 100}%`);
    ui.write(`   Signers: ${signers.count} (required: ${signers.required})`);
    ui.write(`   Last Deposit ID: #${lastDepositId}`);
    ui.write(`   Queue Length: ${queueInfo.queueLength}`);
    ui.write(`   Queue Amount: ${formatAmount(queueInfo.totalAmount)} TON`);
    ui.write(`   Queue Status: ${queueDetails.nextTime === -1 ? 'Empty' : 'Has items'}`);
    
    ui.write(`\n⚡ Performance Stats:`);
    ui.write(`   Last Processed Time: ${performanceStats.lastProcessedTime === 0 ? 'Never' : new Date(performanceStats.lastProcessedTime * 1000).toISOString()}`);
    ui.write(`   Failed Transactions: ${performanceStats.failedTransactions}`);
    ui.write(`   Current Queue Size: ${performanceStats.queueSize}`);

    // Проверяем депозиты
    ui.write(`\n💰 Deposits Information:`);
    for (let i = 0; i <= lastDepositId && i < 10; i++) {
        const depositInfo = await mixton.getDepositInfo(BigInt(i));
        if (depositInfo && depositInfo.depositTime !== -1) {
            const status = depositInfo.status === 0 ? 'Pending' : depositInfo.status === 1 ? 'Processed' : 'Failed';
            ui.write(`   Deposit #${i}: ${status}, Time: ${new Date(depositInfo.depositTime * 1000).toISOString()}`);
        }
    }

    // Проверяем историю транзакций
    const history = await mixton.getTransactionHistory();
    ui.write(`\n📋 Transaction History: ${history.length} records`);

    // Проверяем детали очереди
    if (queueDetails.queueLength > 0) {
        ui.write(`\n⏳ Queue Details:`);
        ui.write(`   Next processing time: ${queueDetails.nextTime === -1 ? 'N/A' : new Date(queueDetails.nextTime * 1000).toISOString()}`);
        ui.write(`   Total amount in queue: ${formatAmount(queueDetails.totalAmount)} TON`);
    }

    // Проверяем баланс контракта
    const contractState = await provider.provider(contractAddress).getState();
    ui.write(`\n💎 Contract Balance: ${formatAmount(contractState.balance)} TON`);

    // Если есть депозиты в статусе Pending, пробуем создать простой вывод
    if (lastDepositId >= 0) {
        const depositInfo = await mixton.getDepositInfo(BigInt(lastDepositId));
        if (depositInfo && depositInfo.depositTime !== -1 && depositInfo.status === 0) {
            ui.write(`\n🔄 Testing simple withdrawal with deposit #${lastDepositId}...`);
            
            const recipient = Address.parse('0QDi6a6j5TUfF5dZcDvDZaYrG7YzxHAF7omZubrNJgJdxefE');
            const amount = toNano('0.1');
            const feeRate = 200;
            const delay = 30;

            try {
                // Получаем баланс получателя до
                const recipientBefore = await provider.provider(recipient).getState();
                
                const result = await mixton.sendWithdraw(
                    provider.sender(),
                    recipient,
                    amount,
                    BigInt(lastDepositId),
                    feeRate,
                    delay,
                    toNano('0.05')
                );
                
                ui.write(`✅ Simple withdrawal sent successfully!`);
                
                // Проверяем состояние после
                const queueInfoAfter = await mixton.getQueueInfo();
                const depositInfoAfter = await mixton.getDepositInfo(BigInt(lastDepositId));
                
                ui.write(`\n📊 State After Simple Withdrawal:`);
                ui.write(`   Queue Length: ${queueInfoAfter.queueLength}`);
                if (depositInfoAfter && depositInfoAfter.depositTime !== -1) {
                    ui.write(`   Deposit Status: ${depositInfoAfter.status === 0 ? 'Pending' : depositInfoAfter.status === 1 ? 'Processed' : 'Failed'}`);
                }
                
                // Получаем баланс получателя после
                const recipientAfter = await provider.provider(recipient).getState();
                ui.write(`   Recipient Balance Change: ${formatAmount(recipientAfter.balance - recipientBefore.balance)} TON`);
                
            } catch (error) {
                ui.write(`❌ Error sending simple withdrawal: ${error instanceof Error ? error.message : String(error)}`);
            }
        }
    }

    // Проверяем обработку очереди
    ui.write(`\n⚙️ Testing queue processing...`);
    try {
        const processResult = await mixton.sendProcessQueue(provider.sender(), toNano('0.05'));
        ui.write(`✅ Queue processing sent!`);
        
        // Проверяем состояние после обработки
        const queueInfoProcessed = await mixton.getQueueInfo();
        const basicStatsProcessed = await mixton.getBasicStats();
        
        ui.write(`\n📊 State After Processing:`);
        ui.write(`   Queue Length: ${queueInfoProcessed.queueLength}`);
        ui.write(`   Total Withdrawn: ${formatAmount(basicStatsProcessed.totalWithdrawn)} TON`);
        
    } catch (error) {
        ui.write(`❌ Error processing queue: ${error instanceof Error ? error.message : String(error)}`);
    }
}