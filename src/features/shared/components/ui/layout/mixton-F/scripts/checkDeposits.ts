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

    ui.write(`🔍 Checking Deposits in Mixton Contract`);
    ui.write(`📍 Contract address: ${contractAddress}`);

    try {
        // Получаем основную информацию
        const admin = await mixton.getAdmin();
        const basicStats = await mixton.getBasicStats();
        const lastDepositId = await mixton.getLastDepositId();

        ui.write(`\n📊 Contract Information:`);
        ui.write(`   Admin: ${admin.toString()}`);
        ui.write(`   Total Deposits: ${basicStats.totalDeposits}`);
        ui.write(`   Total Withdrawn: ${(Number(basicStats.totalWithdrawn) / 1000000000).toFixed(9)} TON`);
        ui.write(`   Last Deposit ID: ${lastDepositId}`);

        // Проверяем последние 10 депозитов
        ui.write(`\n💰 Recent Deposits (last 10 or less):`);
        
        const startId = Math.max(0, Number(lastDepositId) - 9);
        let foundDeposits = 0;
        
        for (let i = startId; i <= Number(lastDepositId); i++) {
            try {
                const depositInfo = await mixton.getDepositInfo(BigInt(i));
                
                if (depositInfo !== null && depositInfo.depositTime !== -1) {
                    foundDeposits++;
                    const date = new Date(depositInfo.depositTime * 1000);
                    const statusStr = depositInfo.status === 0 ? 'Pending' : 'Processed';
                    
                    ui.write(`   Deposit #${i}:`);
                    ui.write(`      Time: ${date.toLocaleString()}`);
                    ui.write(`      Delay: ${depositInfo.delay} seconds`);
                    ui.write(`      Status: ${statusStr}`);
                }
            } catch (error) {
                ui.write(`   Deposit #${i}: Error - ${error instanceof Error ? error.message : String(error)}`);
            }
        }
        
        if (foundDeposits === 0) {
            ui.write(`   No deposits found.`);
        }

        ui.write(`\n✅ Deposit check completed!`);

    } catch (error) {
        ui.write(`❌ Error checking deposits: ${error instanceof Error ? error.message : String(error)}`);
    }
}