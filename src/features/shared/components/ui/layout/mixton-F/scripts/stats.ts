// scripts/stats.ts
import { Address } from '@ton/core';
import { Mixton } from '../wrappers/Mixton';
import { NetworkProvider } from '@ton/blueprint';

// Вспомогательная функция для форматирования даты
const formatDate = (timestamp: number): string => {
    if (timestamp === -1) return 'N/A';
    return new Date(timestamp * 1000).toLocaleString();
};

// Вспомогательная функция для форматирования адреса
const formatAddress = (address: Address | null | undefined): string => {
    if (!address) return 'N/A';
    return address.toString();
};

export async function run(provider: NetworkProvider) {
    const ui = provider.ui();

    // Пытаемся получить адрес из .env, если нет - используем захардкоженный для примера
    let contractAddress: Address;
    const contractAddressFromEnv = process.env.CONTRACT_ADDRESS;
    if (contractAddressFromEnv) {
        contractAddress = Address.parse(contractAddressFromEnv);
        ui.write(`Using contract address from .env: ${contractAddress.toString()}\n`);
    } else {
        // Fallback для демонстрации
        contractAddress = Address.parse('EQBo4bABNgp0aSVRy6TUKDGgEkyc6c-oZcT_pdS5anjdg1gx');
        ui.write(`Using fallback contract address: ${contractAddress.toString()}\n`);
        ui.write(`⚠️  Consider setting CONTRACT_ADDRESS in your .env file.\n`);
    }
    
    const mixton = provider.open(Mixton.createFromAddress(contractAddress));

    ui.write(`📊 Mixton Contract Statistics\n`);
    ui.write(`📍 Address: ${contractAddress.toString()}\n\n`);

    try {
        const stats = await mixton.getBasicStats();
        ui.write(`📈 Basic Statistics:\n`);
        ui.write(`   Total Deposits: ${stats.totalDeposits}\n`);
        ui.write(`   Total Withdrawn: ${Mixton.formatAmount(stats.totalWithdrawn)} TON\n\n`);

        // ИСПРАВЛЕНО: Используем getQueueDetails вместо getQueueInfo
        const queueDetails = await mixton.getQueueDetails();
        ui.write(`📋 Withdrawal Queue:\n`);
        ui.write(`   Queue Length: ${queueDetails.queueLength}\n`);
        ui.write(`   Total Amount: ${Mixton.formatAmount(queueDetails.totalAmount)} TON\n\n`);
        
        const queueStatusNumber = await mixton.getQueueStatus();
        let statusText = 'Unknown';
        if (queueStatusNumber === 0) statusText = 'Empty';
        else if (queueStatusNumber === 1) statusText = 'Waiting';
        else if (queueStatusNumber === 2) statusText = 'Ready';
        ui.write(`⏳ Queue Status: ${statusText}\n`);
        if (queueDetails.nextTime > 0) {
            ui.write(`   Next Processing: ${formatDate(queueDetails.nextTime)}\n`);
        }
        ui.write(`\n`);

        const params = await mixton.getMixerParams();
        ui.write(`⚙️ Mixer Parameters:\n`);
        ui.write(`   Min Fee Rate: ${(params.minFeeRate / 100).toFixed(2)}%\n`);
        ui.write(`   Max Fee Rate: ${(params.maxFeeRate / 100).toFixed(2)}%\n`);
        ui.write(`   Min Delay: ${Mixton.formatDelay(params.minDelay)}\n`);
        ui.write(`   Max Delay: ${Mixton.formatDelay(params.maxDelay)}\n\n`);

        const limits = await mixton.getLimits();
        ui.write(`📋 Contract Limits:\n`);
        ui.write(`   Min Deposit: ${Mixton.formatAmount(limits.minDeposit)} TON\n`);
        ui.write(`   Max Deposit: ${Mixton.formatAmount(limits.maxDeposit)} TON\n`);
        ui.write(`   Min Withdraw: ${Mixton.formatAmount(limits.minWithdraw)} TON\n\n`);

        const admin = await mixton.getAdmin();
        ui.write(`👤 Administrator:\n`);
        ui.write(`   Address: ${formatAddress(admin)}\n\n`);

        const contractState = await provider.provider(contractAddress).getState();
        ui.write(`💰 Contract Balance: ${Mixton.formatAmount(contractState.balance)} TON\n\n`);
        
        ui.write(`💳 Recent Deposits:\n`);
        let depositsShown = 0;
        const maxDepositsToShow = 3;
        for (let i = stats.totalDeposits; i > 0 && depositsShown < maxDepositsToShow; i--) {
            try {
                const depositInfo = await mixton.getDepositInfo(BigInt(i - 1));
                if (depositInfo && depositInfo.depositTime !== -1) {
                    ui.write(`   Deposit #${i - 1}:\n`);
                    ui.write(`     Time: ${formatDate(depositInfo.depositTime)}\n`);
                    ui.write(`     Delay: ${Mixton.formatDelay(depositInfo.delay)}\n`);
                    ui.write(`     Status: ${depositInfo.status === 0 ? 'Pending' : 'Processed'}\n`);
                    depositsShown++;
                }
            } catch (e) {
                // Игнорируем ошибки при чтении старых депозитов, которых может не быть
            }
        }
        if (depositsShown === 0) {
            ui.write(`   No recent deposits found.\n`);
        }

        ui.write(`\n🎉 Statistics loaded successfully!\n`);

    } catch (error) {
        ui.write(`❌ Error loading statistics: ${error instanceof Error ? error.message : String(error)}\n`);
    }
}