// scripts/debugMultiWithdrawStepByStep.ts
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

    ui.write(`🔍 Step-by-Step Debug Multi-Withdrawal for: ${mixton.address.toString()}\n`);

    // Проверяем, что sender.address существует
    const senderAddress = provider.sender().address;
    if (!senderAddress) {
        ui.write(`❌ Sender address is undefined`);
        return;
    }

    // Шаг 1: Проверяем текущее состояние
    ui.write(`📋 Step 1: Checking current state`);
    const basicStats = await mixton.getBasicStats();
    const queueInfo = await mixton.getQueueInfo();
    const queueDetails = await mixton.getQueueDetails();
    
    ui.write(`   Total Deposits: ${basicStats.totalDeposits}`);
    ui.write(`   Total Withdrawn: ${formatAmount(basicStats.totalWithdrawn)} TON`);
    ui.write(`   Queue Length: ${queueInfo.queueLength}`);
    ui.write(`   Queue Amount: ${formatAmount(queueInfo.totalAmount)} TON`);
    ui.write(`   Queue Details: Length=${queueDetails.queueLength}, Amount=${formatAmount(queueDetails.totalAmount)} TON, NextTime=${queueDetails.nextTime}`);

    // Шаг 2: Находим доступный депозит
    ui.write(`\n📋 Step 2: Finding available deposit`);
    let availableDepositId = -1;
    
    for (let i = 0; i <= 4; i++) {
        const depositInfo = await mixton.getDepositInfo(BigInt(i));
        if (depositInfo && depositInfo.depositTime !== -1) {
            ui.write(`   Deposit #${i}: Status=${depositInfo.status === 0 ? 'Pending' : depositInfo.status === 1 ? 'Processed' : 'Failed'}`);
            
            if (depositInfo.status === 0) { // Pending
                availableDepositId = i;
                break;
            }
        } else {
            ui.write(`   Deposit #${i}: Not found`);
        }
    }

    if (availableDepositId === -1) {
        ui.write(`❌ No available deposits in Pending status found.`);
        return;
    }

    ui.write(`   Using Deposit #${availableDepositId}`);

    // Шаг 3: Создаем простой вывод (не множественный) для тестирования
    ui.write(`\n📋 Step 3: Creating simple withdrawal for testing`);
    const recipient = Address.parse('0QDi6a6j5TUfF5dZcDvDZaYrG7YzxHAF7omZubrNJgJdxQGL');
    const withdrawAmount = toNano('0.5');
    const feeRate = 200;
    const delay = 30;

    // Получаем балансы до операции
    const getBalance = async (address: Address) => {
        try {
            const state = await provider.provider(address).getState();
            return state.balance;
        } catch (e) {
            return 0n;
        }
    };

    const contractBalanceBefore = await mixton.getBalance();
    const recipientBalanceBefore = await getBalance(recipient);
    const senderBalanceBefore = await getBalance(senderAddress);

    ui.write(`   Contract Balance Before: ${formatAmount(contractBalanceBefore)} TON`);
    ui.write(`   Recipient Balance Before: ${formatAmount(recipientBalanceBefore)} TON`);
    ui.write(`   Sender Balance Before: ${formatAmount(senderBalanceBefore)} TON`);

    try {
        ui.write(`   Sending withdrawal request...`);
        const result = await mixton.sendWithdraw(
            provider.sender(),
            recipient,
            withdrawAmount,
            BigInt(availableDepositId),
            feeRate,
            delay,
            toNano('0.05')
        );
        ui.write(`   ✅ Withdrawal request sent successfully!`);

        // Шаг 4: Проверяем состояние после вывода
        ui.write(`\n📋 Step 4: Checking state after withdrawal`);
        const queueInfoAfter = await mixton.getQueueInfo();
        const queueDetailsAfter = await mixton.getQueueDetails();
        const basicStatsAfter = await mixton.getBasicStats();
        
        ui.write(`   Queue Length: ${queueInfoAfter.queueLength}`);
        ui.write(`   Queue Amount: ${formatAmount(queueInfoAfter.totalAmount)} TON`);
        ui.write(`   Queue Details: Length=${queueDetailsAfter.queueLength}, Amount=${formatAmount(queueDetailsAfter.totalAmount)} TON, NextTime=${queueDetailsAfter.nextTime}`);
        ui.write(`   Total Withdrawn: ${formatAmount(basicStatsAfter.totalWithdrawn)} TON`);

        // Проверяем статус депозита
        const depositInfoAfter = await mixton.getDepositInfo(BigInt(availableDepositId));
        if (depositInfoAfter) {
            ui.write(`   Deposit Status: ${depositInfoAfter.status === 0 ? 'Pending' : depositInfoAfter.status === 1 ? 'Processed' : 'Failed'}`);
        } else {
            ui.write(`   Deposit Info: Not found`);
        }

        // Получаем балансы после операции
        const contractBalanceAfter = await mixton.getBalance();
        const recipientBalanceAfter = await getBalance(recipient);
        const senderBalanceAfter = await getBalance(senderAddress);

        ui.write(`   Contract Balance After: ${formatAmount(contractBalanceAfter)} TON`);
        ui.write(`   Recipient Balance After: ${formatAmount(recipientBalanceAfter)} TON`);
        ui.write(`   Sender Balance After: ${formatAmount(senderBalanceAfter)} TON`);

        // Шаг 5: Если очередь не пуста, пробуем обработать ее
        if (queueInfoAfter.queueLength > 0) {
            ui.write(`\n📋 Step 5: Processing queue`);
            ui.write(`   Waiting for queue to mature...`);
            
            // Ждем 30 секунд
            ui.write(`   Waiting 30 seconds...`);
            await new Promise(resolve => setTimeout(resolve, 30000));
            
            try {
                const processResult = await mixton.sendProcessQueue(provider.sender(), toNano('0.05'));
                ui.write(`   ✅ Queue processing sent!`);

                // Проверяем состояние после обработки
                const queueInfoProcessed = await mixton.getQueueInfo();
                const basicStatsProcessed = await mixton.getBasicStats();
                
                ui.write(`   Queue Length After Processing: ${queueInfoProcessed.queueLength}`);
                ui.write(`   Total Withdrawn After Processing: ${formatAmount(basicStatsProcessed.totalWithdrawn)} TON`);

                // Получаем финальные балансы
                const contractBalanceFinal = await mixton.getBalance();
                const recipientBalanceFinal = await getBalance(recipient);
                const senderBalanceFinal = await getBalance(senderAddress);

                ui.write(`   Contract Balance Final: ${formatAmount(contractBalanceFinal)} TON`);
                ui.write(`   Recipient Balance Final: ${formatAmount(recipientBalanceFinal)} TON`);
                ui.write(`   Sender Balance Final: ${formatAmount(senderBalanceFinal)} TON`);

                ui.write(`   Recipient Balance Change: ${formatAmount(recipientBalanceFinal - recipientBalanceBefore)} TON`);
                ui.write(`   Contract Balance Change: ${formatAmount(contractBalanceFinal - contractBalanceBefore)} TON`);

            } catch (error) {
                ui.write(`   ❌ Error processing queue: ${error instanceof Error ? error.message : String(error)}`);
            }
        } else {
            ui.write(`   ❌ Queue is empty after withdrawal. This indicates a problem.`);
        }

    } catch (error) {
        ui.write(`   ❌ Error sending withdrawal: ${error instanceof Error ? error.message : String(error)}`);
    }

    // Шаг 6: Финальная проверка состояния
    ui.write(`\n📋 Step 6: Final state check`);
    const finalQueueInfo = await mixton.getQueueInfo();
    const finalBasicStats = await mixton.getBasicStats();
    
    ui.write(`   Final Queue Length: ${finalQueueInfo.queueLength}`);
    ui.write(`   Final Total Withdrawn: ${formatAmount(finalBasicStats.totalWithdrawn)} TON`);
    
    // Проверяем все депозиты
    for (let i = 0; i <= 4; i++) {
        const depositInfo = await mixton.getDepositInfo(BigInt(i));
        if (depositInfo && depositInfo.depositTime !== -1) {
            ui.write(`   Deposit #${i}: Status=${depositInfo.status === 0 ? 'Pending' : depositInfo.status === 1 ? 'Processed' : 'Failed'}`);
        } else {
            ui.write(`   Deposit #${i}: Not found`);
        }
    }
}