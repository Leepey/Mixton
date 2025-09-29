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

    // Сначала проверяем последние депозиты
    const lastDepositId = await mixton.getLastDepositId();
    ui.write(`📋 Last Deposit ID: ${lastDepositId}`);
    
    if (lastDepositId >= 0) {
        ui.write(`💡 Available Deposit IDs: 0 to ${lastDepositId}`);
    }

    // Запрашиваем параметры у пользователя
    const depositIdStr = await ui.input(`Deposit ID (0-${lastDepositId}):`);
    const depositId = BigInt(depositIdStr);
    const withdrawalsCount = parseInt(await ui.input('Number of withdrawals (1-4):'));

    if (withdrawalsCount < 1 || withdrawalsCount > 4) {
        ui.write(`❌ Invalid number of withdrawals. Must be between 1 and 4.`);
        return;
    }

    // Проверяем существование депозита
    try {
        const depositInfo = await mixton.getDepositInfo(depositId);
        
        if (depositInfo === null || depositInfo.depositTime === -1) {
            ui.write(`❌ Deposit with ID ${depositId} not found!`);
            return;
        }
        
        ui.write(`✅ Found deposit #${depositId}:`);
        ui.write(`   Time: ${new Date(depositInfo.depositTime * 1000).toLocaleString()}`);
        ui.write(`   Status: ${depositInfo.status === 0 ? 'Pending' : 'Processed'}`);
    } catch (error) {
        ui.write(`❌ Error checking deposit: ${error instanceof Error ? error.message : String(error)}`);
        return;
    }

    const withdrawals = [];

    for (let i = 0; i < withdrawalsCount; i++) {
        ui.write(`\nWithdrawal #${i + 1}:`);
        const recipientAddress = await ui.input(`   Recipient address #${i + 1}:`);
        const amountStr = await ui.input(`   Amount (in TON) #${i + 1}:`);
        const amount = toNano(amountStr);
        const feeRate = parseInt(await ui.input(`   Fee rate (100-500) #${i + 1}:`)) || 250;
        const delay = parseInt(await ui.input(`   Delay in seconds #${i + 1}:`)) || 60;

        withdrawals.push({
            recipient: Address.parse(recipientAddress),
            amount,
            feeRate,
            delay
        });
    }

    ui.write(`💸 Sending multi-withdrawal request...`);
    ui.write(`   Deposit ID: ${depositId}`);
    ui.write(`   Number of withdrawals: ${withdrawalsCount}`);

    try {
        await mixton.sendMultiWithdraw(
            provider.sender(),
            {
                depositId,
                withdrawals
            },
            toNano('0.2') // комиссия за транзакцию
        );

        ui.write(`✅ Multi-withdrawal request sent successfully!`);
        
        // Ждем немного и проверяем состояние очереди
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Показываем информацию о транзакции
        const queueInfo = await mixton.getQueueInfo();
        ui.write(`📊 Current queue status:`);
        ui.write(`   Queue length: ${queueInfo.queueLength}`);
        ui.write(`   Total amount in queue: ${queueInfo.totalAmount.toString()} nanoTON`);

        // Если очередь пуста, показываем детали
        if (queueInfo.queueLength === 0) {
            ui.write(`⚠️  Queue is still empty. This might indicate:`);
            ui.write(`   1. Deposit was already processed`);
            ui.write(`   2. Invalid deposit ID`);
            ui.write(`   3. Insufficient contract balance`);
            ui.write(`   4. Transaction failed silently`);
        }

    } catch (error) {
        ui.write(`❌ Error sending multi-withdrawal: ${error instanceof Error ? error.message : String(error)}`);
    }
}