//scripts\checkStatus.ts
import { Address } from '@ton/core';
import { Mixton } from '../wrappers/Mixton';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();
    
    ui.write(`📊 Mixton Contract Status`);
    ui.write(``.padEnd(50, '═')); // Используем padEnd вместо padRepeat
    
    try {
        // Получаем адрес контракта из .env файла
        const contractAddressStr = process.env.CONTRACT_ADDRESS;
        if (!contractAddressStr) {
            ui.write('Error: CONTRACT_ADDRESS not found in .env file');
            return;
        }
        
        const contractAddress = Address.parse(contractAddressStr);
        
        // Открываем контракт
        const mixton = provider.open(Mixton.createFromAddress(contractAddress));
        
        // Получаем базовую информацию
        const admin = await mixton.getAdmin();
        const stats = await mixton.getBasicStats();
        const limits = await mixton.getLimits();
        const params = await mixton.getMixerParams();
        const queueInfo = await mixton.getQueueInfo();
        const queueStatus = await mixton.getQueueStatus();
        const contractBalance = await mixton.getBalance();
        
        // Выводим основную информацию
        ui.write(`🏢 Contract Address: ${Mixton.formatAddress(contractAddress)}`);
        ui.write(`👤 Admin Address: ${Mixton.formatAddress(admin)}`);
        ui.write(`💰 Contract Balance: ${Mixton.formatAmount(contractBalance)} TON`);
        ui.write(``);
        
        // Статистика
        ui.write(`📈 Statistics:`);
        ui.write(`   Total Deposits: ${stats.totalDeposits}`);
        ui.write(`   Total Withdrawn: ${Mixton.formatAmount(BigInt(stats.totalWithdrawn))} TON`);
        ui.write(`   Success Rate: ${stats.totalDeposits > 0 ? ((Number(stats.totalWithdrawn) / (stats.totalDeposits * 1000000000)) * 100).toFixed(2) : '0'}%`);
        ui.write(``);
        
        // Лимиты
        ui.write(`📋 Contract Limits:`);
        ui.write(`   Min Deposit: ${Mixton.formatAmount(limits.minDeposit)} TON`);
        ui.write(`   Max Deposit: ${Mixton.formatAmount(limits.maxDeposit)} TON`);
        ui.write(`   Min Withdraw: ${Mixton.formatAmount(limits.minWithdraw)} TON`);
        ui.write(``);
        
        // Параметры миксера
        ui.write(`⚙️  Mixer Parameters:`);
        ui.write(`   Min Fee Rate: ${params.minFeeRate / 100}%`);
        ui.write(`   Max Fee Rate: ${params.maxFeeRate / 100}%`);
        ui.write(`   Min Delay: ${Mixton.formatDelay(params.minDelay)}`);
        ui.write(`   Max Delay: ${Mixton.formatDelay(params.maxDelay)}`);
        ui.write(``);
        
        // Статус очереди
        ui.write(`📋 Withdrawal Queue:`);
        ui.write(`   Status: ${queueStatus.status === 0 ? 'Empty' : queueStatus.status === 1 ? 'Waiting' : 'Ready'}`);
        ui.write(`   Items in Queue: ${queueInfo.queueLength}`);
        ui.write(`   Pending Amount: ${Mixton.formatAmount(queueInfo.totalAmount)} TON`);
        
        if (queueInfo.queueLength > 0) {
            const queueDetails = await mixton.getQueueDetails();
            const minNextTime = queueDetails.nextTime; // Используем свойство nextTime
            
            if (minNextTime > 0) {
                const nextTime = new Date(minNextTime * 1000);
                const now = new Date();
                const timeUntilNext = minNextTime - Math.floor(now.getTime() / 1000);
                
                ui.write(`   Next Processing: ${nextTime.toLocaleString()}`);
                if (timeUntilNext > 0) {
                    ui.write(`   Time Until Next: ${Mixton.formatDelay(timeUntilNext)}`);
                } else {
                    ui.write(`   Status: Ready to process!`);
                }
            }
        }
        
        ui.write(``);
        
        // Последний депозит
        const lastDepositId = await mixton.getLastDepositId();
        if (lastDepositId >= 0) {
            const depositInfo = await mixton.getDepositInfo(BigInt(lastDepositId));
            if (depositInfo && depositInfo.depositTime > 0) {
                const depositTime = new Date(depositInfo.depositTime * 1000);
                ui.write(`💳 Last Deposit (ID: ${lastDepositId}):`);
                ui.write(`   Time: ${depositTime.toLocaleString()}`);
                ui.write(`   Delay: ${Mixton.formatDelay(depositInfo.delay)}`);
                ui.write(`   Status: ${depositInfo.status === 0 ? '⏳ Pending' : '✅ Processed'}`);
            }
        }
        
        ui.write(``);
        ui.write(`✅ Status check completed successfully!`);
        
    } catch (error) {
        ui.write(`❌ Error during status check: ${error instanceof Error ? error.message : String(error)}`);
    }
}