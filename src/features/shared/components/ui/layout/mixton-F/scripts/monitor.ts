// scripts/monitor.ts
import { NetworkProvider } from '@ton/blueprint';
import { Mixton } from '../wrappers/Mixton';
import { toNano, Address } from '@ton/core';

export async function run(provider: NetworkProvider) {
    const mixton = provider.open(
        Mixton.createFromAddress(Address.parse(process.env.CONTRACT_ADDRESS!))
    );

    console.log('=== Mixton Monitor ===');
    console.log('Contract:', mixton.address.toString());
    
    // Базовая статистика
    const stats = await mixton.getBasicStats();
    console.log('\n📊 Basic Stats:');
    console.log(`Total Deposits: ${stats.totalDeposits}`);
    console.log(`Total Withdrawn: ${Mixton.formatAmount(stats.totalWithdrawn)} TON`);
    
    // Информация об очереди
    const queueInfo = await mixton.getQueueInfo();
    console.log('\n⏳ Queue Info:');
    console.log(`Queue Length: ${queueInfo.queueLength}`);
    console.log(`Queue Amount: ${Mixton.formatAmount(queueInfo.totalAmount)} TON`);
    
    // Статус очереди
    const queueStatus = await mixton.getQueueStatus();
    console.log('\n🔄 Queue Status:');
    console.log(`Status: ${queueStatus === 0 ? 'Empty' : queueStatus === 1 ? 'Waiting' : 'Ready'}`);
    
    // Информация о подписантах
    const signers = await mixton.getSigners();
    console.log('\n👥 Signers:');
    console.log(`Count: ${signers.count}`);
    console.log(`Required: ${signers.required}`);
    
    // Данные оракула
    const oracleData = await mixton.getOracleData();
    console.log('\n🔮 Oracle Data:');
    console.log(`Rate: ${(oracleData.data / 1000000).toFixed(6)} USD/TON`);
    console.log(`Last Update: ${new Date(oracleData.lastUpdate * 1000).toISOString()}`);
    
    // История транзакций
    const history = await mixton.getTransactionHistory();
    console.log('\n📝 Recent Transactions:');
    history.slice(-5).forEach((tx, i) => {
        const type = tx.txType === 0 ? 'Deposit' : tx.txType === 1 ? 'Withdrawal' : 'Fee';
        const status = tx.status === 0 ? 'Pending' : tx.status === 1 ? 'Completed' : 'Failed';
        console.log(`${i + 1}. ${type} - ${Mixton.formatAmount(tx.amount)} TON - ${status}`);
    });
    
    // Проверка здоровья
    // Получаем ContractProvider из NetworkProvider
    const contractProvider = provider.provider(mixton.address);
    const health = await mixton.healthCheck(contractProvider);
    console.log('\n🏥 Health Check:');
    console.log(`Status: ${health.healthy ? 'Healthy' : 'Issues detected'}`);
    if (health.issues.length > 0) {
        health.issues.forEach(issue => console.log(`  - ${issue}`));
    }

    // Добавляем статистику производительности
    try {
        const perfStats = await mixton.getPerformanceStats();
        console.log('\n⚡ Performance Stats:');
        console.log(`Last Processed: ${perfStats.lastProcessedTime > 0 ? new Date(perfStats.lastProcessedTime * 1000).toISOString() : 'Never'}`);
        console.log(`Failed Transactions: ${perfStats.failedTransactions}`);
        console.log(`Current Queue Size: ${perfStats.queueSize}`);
    } catch (error) {
        console.log('\n⚠️ Performance stats not available');
    }

    // Добавляем детальную информацию об очереди
    try {
        const queueDetails = await mixton.getQueueDetails();
        console.log('\n📋 Queue Details:');
        console.log(`Items in Queue: ${queueDetails.queueLength}`);
        console.log(`Total Amount: ${Mixton.formatAmount(queueDetails.totalAmount)} TON`);
        if (queueDetails.nextTime > 0) {
            const nextProcessTime = new Date(queueDetails.nextTime * 1000);
            const now = new Date();
            const timeUntilNext = nextProcessTime.getTime() - now.getTime();
            
            if (timeUntilNext > 0) {
                const minutes = Math.floor(timeUntilNext / 60000);
                const seconds = Math.floor((timeUntilNext % 60000) / 1000);
                console.log(`Next Processing: ${nextProcessTime.toISOString()} (in ${minutes}m ${seconds}s)`);
            } else {
                console.log(`Next Processing: Ready now!`);
            }
        }
    } catch (error) {
        console.log('\n⚠️ Queue details not available');
    }

    // Добавляем информацию о балансе контракта
    try {
        // ИСПРАВЛЕНО: getBalance не принимает параметров
        const balance = await mixton.getBalance();
        console.log('\n💰 Contract Balance:');
        console.log(`Balance: ${Mixton.formatAmount(balance)} TON`);
    } catch (error) {
        console.log('\n⚠️ Balance info not available');
    }

    // Добавляем информацию о комиссиях
    try {
        const currentFeeRate = await mixton.getCurrentFeeRate();
        console.log('\n💸 Fee Information:');
        console.log(`Current Fee Rate: ${Mixton.formatFeeRate(currentFeeRate)}`);
    } catch (error) {
        console.log('\n⚠️ Fee info not available');
    }

    // Добавляем информацию об администраторе
    try {
        const admin = await mixton.getAdmin();
        console.log('\n👤 Admin Information:');
        console.log(`Admin Address: ${admin.toString()}`);
    } catch (error) {
        console.log('\n⚠️ Admin info not available');
    }

    // Добавляем информацию о параметрах миксера
    try {
        const mixerParams = await mixton.getMixerParams();
        console.log('\n⚙️ Mixer Parameters:');
        console.log(`Min Fee Rate: ${Mixton.formatFeeRate(mixerParams.minFeeRate)}`);
        console.log(`Max Fee Rate: ${Mixton.formatFeeRate(mixerParams.maxFeeRate)}`);
        console.log(`Min Delay: ${Mixton.formatDelay(mixerParams.minDelay)}`);
        console.log(`Max Delay: ${Mixton.formatDelay(mixerParams.maxDelay)}`);
    } catch (error) {
        console.log('\n⚠️ Mixer parameters not available');
    }

    // Добавляем информацию о лимитах
    try {
        const limits = await mixton.getLimits();
        console.log('\n📏 Contract Limits:');
        console.log(`Min Deposit: ${Mixton.formatAmount(limits.minDeposit)} TON`);
        console.log(`Max Deposit: ${Mixton.formatAmount(limits.maxDeposit)} TON`);
        console.log(`Min Withdraw: ${Mixton.formatAmount(limits.minWithdraw)} TON`);
    } catch (error) {
        console.log('\n⚠️ Limits info not available');
    }
}