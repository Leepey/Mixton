import { Mixton } from '../wrappers/Mixton';
import { Address } from '@ton/core';
import { NetworkProvider } from '@ton/blueprint';
import { config } from 'dotenv';

// Загружаем переменные окружения
config();

export async function run(provider: NetworkProvider) {
    const ui = provider.ui();

    // Получаем адрес контракта из .env
    const contractAddress = process.env.CONTRACT_ADDRESS;
    if (!contractAddress) {
        throw new Error('CONTRACT_ADDRESS not found in .env file');
    }

    // Создаем экземпляр контракта с адресом из .env
    const mixton = provider.open(Mixton.createFromAddress(Address.parse(contractAddress)));

    ui.write(`🔍 Debugging Mixton Contract`);
    ui.write(`📍 Contract address: ${contractAddress}`);

    try {
        // Получаем основную информацию
        const admin = await mixton.getAdmin();
        const basicStats = await mixton.getBasicStats();
        const queueInfo = await mixton.getQueueInfo();
        const queueStatus = await mixton.getQueueStatus();
        const minNextTime = await mixton.getMinNextTime();
        const contractBalance = await mixton.getBalance();
        const mixerParams = await mixton.getMixerParams();
        const currentFeeRate = await mixton.getCurrentFeeRate();
        const limits = await mixton.getLimits();

        ui.write(`\n📊 Contract Information:`);
        ui.write(`   Admin: ${admin.toString()}`);
        ui.write(`   Balance: ${(Number(contractBalance) / 1000000000).toFixed(9)} TON`);
        ui.write(`   Current Fee Rate: ${(currentFeeRate / 100).toFixed(2)}%`);

        ui.write(`\n📈 Statistics:`);
        ui.write(`   Total Deposits: ${basicStats.totalDeposits}`);
        ui.write(`   Total Withdrawn: ${(Number(basicStats.totalWithdrawn) / 1000000000).toFixed(9)} TON`);

        ui.write(`\n⚙️  Contract Parameters:`);
        ui.write(`   Min Fee Rate: ${(mixerParams.minFeeRate / 100).toFixed(2)}%`);
        ui.write(`   Max Fee Rate: ${(mixerParams.maxFeeRate / 100).toFixed(2)}%`);
        ui.write(`   Min Delay: ${mixerParams.minDelay} seconds`);
        ui.write(`   Max Delay: ${mixerParams.maxDelay} seconds`);

        ui.write(`\n💰 Limits:`);
        ui.write(`   Min Deposit: ${(Number(limits.minDeposit) / 1000000000).toFixed(9)} TON`);
        ui.write(`   Max Deposit: ${(Number(limits.maxDeposit) / 1000000000).toFixed(9)} TON`);
        ui.write(`   Min Withdraw: ${(Number(limits.minWithdraw) / 1000000000).toFixed(9)} TON`);

        ui.write(`\n📋 Queue Status:`);
        ui.write(`   Queue Length: ${queueInfo.queueLength}`);
        ui.write(`   Total Amount in Queue: ${(Number(queueInfo.totalAmount) / 1000000000).toFixed(9)} TON`);
        ui.write(`   Status: ${queueStatus} (0=empty, 1=waiting, 2=ready)`);
        
        if (minNextTime > 0) {
            const nextTime = new Date(minNextTime * 1000);
            ui.write(`   Next Processing Time: ${nextTime.toLocaleString()}`);
            ui.write(`   Time until next: ${Math.max(0, Math.floor((nextTime.getTime() - Date.now()) / 1000))} seconds`);
        } else {
            ui.write(`   Next Processing Time: N/A`);
        }

        // Получаем детальную информацию об очереди
        if (queueInfo.queueLength > 0) {
            const queueDetails = await mixton.getQueueDetails();
            ui.write(`\n🔍 Queue Details:`);
            ui.write(`   Queue Length: ${queueDetails.queueLength}`);
            ui.write(`   Total Amount: ${(Number(queueDetails.totalAmount) / 1000000000).toFixed(9)} TON`);
            ui.write(`   Next Time: ${queueDetails.nextTime > 0 ? new Date(queueDetails.nextTime * 1000).toLocaleString() : 'N/A'}`);
        }

        // Получаем информацию о производительности
        const perfStats = await mixton.getPerformanceStats();
        ui.write(`\n⚡ Performance Stats:`);
        ui.write(`   Last Processed Time: ${perfStats.lastProcessedTime > 0 ? new Date(perfStats.lastProcessedTime * 1000).toLocaleString() : 'Never'}`);
        ui.write(`   Failed Transactions: ${perfStats.failedTransactions}`);
        ui.write(`   Current Queue Size: ${perfStats.queueSize}`);

        // Получаем историю транзакций (последние 5)
        ui.write(`\n📜 Recent Transaction History (last 5):`);
        try {
            const history = await mixton.getTransactionHistory();
            const recentHistory = history.slice(-5);
            
            if (recentHistory.length > 0) {
                recentHistory.forEach((tx, index) => {
                    const typeStr = tx.txType === 0 ? 'Deposit' : tx.txType === 1 ? 'Withdraw' : 'Fee';
                    const statusStr = tx.status === 0 ? 'Pending' : tx.status === 1 ? 'Completed' : 'Error';
                    const date = new Date(tx.timestamp * 1000);
                    
                    ui.write(`   ${index + 1}. ${typeStr} - ${(Number(tx.amount) / 1000000000).toFixed(9)} TON`);
                    ui.write(`      Address: ${tx.address.toString().slice(0, 10)}...`);
                    ui.write(`      Status: ${statusStr}`);
                    ui.write(`      Time: ${date.toLocaleString()}`);
                });
            } else {
                ui.write(`   No transaction history found.`);
            }
        } catch (error) {
            ui.write(`   Could not load transaction history: ${error instanceof Error ? error.message : String(error)}`);
        }

        ui.write(`\n✅ Debug information loaded successfully!`);

    } catch (error) {
        ui.write(`❌ Error loading debug information: ${error instanceof Error ? error.message : String(error)}`);
    }
}