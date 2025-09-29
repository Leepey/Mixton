import { Mixton } from '../wrappers/Mixton';
import { toNano, Address } from '@ton/core';
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

    // Сначала показываем информацию о доступных депозитах
    try {
        const basicStats = await mixton.getBasicStats();
        const lastDepositId = await mixton.getLastDepositId();
        
        ui.write(`📊 Current Contract Status:`);
        ui.write(`   Total Deposits: ${basicStats.totalDeposits}`);
        ui.write(`   Total Withdrawn: ${(Number(basicStats.totalWithdrawn) / 1000000000).toFixed(9)} TON`);
        ui.write(`   Last Deposit ID: ${lastDepositId}`);
        
        if (basicStats.totalDeposits === 0) {
            ui.write(`❌ No deposits found. Please make a deposit first.`);
            ui.write(`💡 Run: npx blueprint run deposit`);
            return;
        }
        
        // Показываем информацию о последних депозитах
        ui.write(`\n📋 Available Deposits:`);
        for (let i = Math.max(0, Number(lastDepositId) - 4); i <= Number(lastDepositId); i++) {
            try {
                const depositInfo = await mixton.getDepositInfo(BigInt(i));
                // ИСПРАВЛЕНО: Добавляем проверку на null
                if (depositInfo && depositInfo.depositTime !== -1) {
                    const statusStr = depositInfo.status === 0 ? 'Available' : 'Used';
                    const date = new Date(depositInfo.depositTime * 1000);
                    ui.write(`   ID ${i}: ${statusStr} - Created: ${date.toLocaleString()}`);
                }
            } catch (error) {
                // Пропускаем ошибку, если депозит не найден
            }
        }
        
    } catch (error) {
        ui.write(`⚠️  Could not load deposit information: ${error instanceof Error ? error.message : String(error)}`);
    }

    // Запрашиваем параметры у пользователя
    const recipientAddress = await ui.input('Recipient address:');
    const amountStr = await ui.input('Amount (in TON):');
    const amount = toNano(amountStr);
    const depositIdStr = await ui.input('Deposit ID:');
    const depositId = BigInt(depositIdStr);
    const feeRateStr = await ui.input('Fee rate (100-500, default 250):');
    const feeRate = feeRateStr ? parseInt(feeRateStr) : 250;
    const delayStr = await ui.input('Delay in seconds (default 60):');
    const delay = delayStr ? parseInt(delayStr) : 60;

    ui.write(`💸 Sending withdrawal request...`);
    ui.write(`   Recipient: ${recipientAddress}`);
    ui.write(`   Amount: ${amountStr} TON`);
    ui.write(`   Deposit ID: ${depositId}`);
    ui.write(`   Fee Rate: ${feeRate}`);
    ui.write(`   Delay: ${delay} seconds`);

    try {
        await mixton.sendWithdraw(
            provider.sender(),
            Address.parse(recipientAddress),
            amount,
            depositId,
            feeRate,
            delay,
            toNano('0.1') // комиссия за транзакцию
        );

        ui.write(`✅ Withdrawal request sent successfully!`);
        
        // Показываем информацию о транзакции
        const queueInfo = await mixton.getQueueInfo();
        ui.write(`📊 Current queue status:`);
        ui.write(`   Queue length: ${queueInfo.queueLength}`);
        ui.write(`   Total amount in queue: ${(Number(queueInfo.totalAmount) / 1000000000).toFixed(9)} TON`);

    } catch (error) {
        ui.write(`❌ Error sending withdrawal: ${error instanceof Error ? error.message : String(error)}`);
        
        // Даем дополнительную информацию об ошибке
        if (error instanceof Error && error.message.includes('Deposit with ID')) {
            ui.write(`💡 Make sure you have a deposit with the specified ID.`);
            ui.write(`💡 Check available deposits with: npx blueprint run debugQueue`);
        }
    }
}