// scripts/debugWithdrawFunctionDetailed.ts
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

    ui.write(`🔍 Detailed Debug of Withdraw Function for: ${mixton.address.toString()}\n`);

    // Проверяем текущее состояние
    const basicStatsBefore = await mixton.getBasicStats();
    const queueInfoBefore = await mixton.getQueueInfo();
    const depositInfoBefore = await mixton.getDepositInfo(1n); // Используем депозит #1

    ui.write(`📊 State Before Withdrawal:`);
    ui.write(`   Total Deposits: ${basicStatsBefore.totalDeposits}`);
    ui.write(`   Total Withdrawn: ${formatAmount(basicStatsBefore.totalWithdrawn)} TON`);
    ui.write(`   Queue Length: ${queueInfoBefore.queueLength}`);
    ui.write(`   Queue Amount: ${formatAmount(queueInfoBefore.totalAmount)} TON`);
    ui.write(`   Deposit #1 Status: ${depositInfoBefore?.status === 0 ? 'Pending' : depositInfoBefore?.status === 1 ? 'Processed' : 'Not found'}`);

    // Получаем балансы
    const getBalance = async (address: Address) => {
        try {
            const state = await provider.provider(address).getState();
            return state.balance;
        } catch (e) {
            return 0n;
        }
    };

    const contractBalanceBefore = await mixton.getBalance();
    const recipientBalanceBefore = await getBalance(Address.parse('0QDi6a6j5TUfF5dZcDvDZaYrG7YzxHAF7omZubrNJgJdxQGL'));
    const adminBalanceBefore = await getBalance(await mixton.getAdmin());

    ui.write(`\n💰 Balances Before:`);
    ui.write(`   Contract: ${formatAmount(contractBalanceBefore)} TON`);
    ui.write(`   Recipient: ${formatAmount(recipientBalanceBefore)} TON`);
    ui.write(`   Admin: ${formatAmount(adminBalanceBefore)} TON`);

    // Создаем сообщение для вывода вручную
    ui.write(`\n📝 Creating withdrawal message manually...`);
    
    const recipient = Address.parse('0QDi6a6j5TUfF5dZcDvDZaYrG7YzxHAF7omZubrNJgJdxQGL');
    const amount = toNano('0.3');
    const depositId = 1n;
    const feeRate = 200;
    const delay = 30;

    ui.write(`   Recipient: ${recipient.toString()}`);
    ui.write(`   Amount: ${formatAmount(amount)} TON`);
    ui.write(`   Deposit ID: #${depositId}`);
    ui.write(`   Fee Rate: ${feeRate / 100}%`);
    ui.write(`   Delay: ${delay} seconds`);

    // Формируем сообщение для вывода
    const messageBody = beginCell()
        .storeUint(0x695f7764, 32) // OP_WITHDRAW
        .storeRef(beginCell().storeAddress(recipient).endCell())
        .storeCoins(amount)
        .storeUint(depositId, 64)
        .storeUint(feeRate, 32)
        .storeUint(delay, 32)
        .endCell();

    ui.write(`   Message Body Hash: ${messageBody.hash().toString('hex')}`);
    ui.write(`   Message Body Bits: ${messageBody.bits.length}`);

    try {
        // Отправляем сообщение через стандартный метод sendWithdraw
        ui.write(`\n💸 Sending withdrawal message using sendWithdraw...`);
        
        const result = await mixton.sendWithdraw(
            provider.sender(),
            recipient,
            amount,
            depositId,
            feeRate,
            delay,
            toNano('0.05')
        );

        ui.write(`   ✅ Message sent successfully!`);

        // Ждем немного для обработки транзакции
        ui.write(`\n⏳ Waiting for transaction to settle...`);
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Проверяем состояние после операции
        ui.write(`\n📊 State After Withdrawal:`);
        const basicStatsAfter = await mixton.getBasicStats();
        const queueInfoAfter = await mixton.getQueueInfo();
        const depositInfoAfter = await mixton.getDepositInfo(1n);

        ui.write(`   Total Deposits: ${basicStatsAfter.totalDeposits}`);
        ui.write(`   Total Withdrawn: ${formatAmount(basicStatsAfter.totalWithdrawn)} TON`);
        ui.write(`   Queue Length: ${queueInfoAfter.queueLength}`);
        ui.write(`   Queue Amount: ${formatAmount(queueInfoAfter.totalAmount)} TON`);
        ui.write(`   Deposit #1 Status: ${depositInfoAfter?.status === 0 ? 'Pending' : depositInfoAfter?.status === 1 ? 'Processed' : 'Not found'}`);

        // Получаем балансы после операции
        const contractBalanceAfter = await mixton.getBalance();
        const recipientBalanceAfter = await getBalance(recipient);
        const adminBalanceAfter = await getBalance(await mixton.getAdmin());

        ui.write(`\n💰 Balances After:`);
        ui.write(`   Contract: ${formatAmount(contractBalanceAfter)} TON`);
        ui.write(`   Recipient: ${formatAmount(recipientBalanceAfter)} TON`);
        ui.write(`   Admin: ${formatAmount(adminBalanceAfter)} TON`);

        ui.write(`\n💸 Balance Changes:`);
        ui.write(`   Contract: ${formatAmount(contractBalanceAfter - contractBalanceBefore)} TON`);
        ui.write(`   Recipient: ${formatAmount(recipientBalanceAfter - recipientBalanceBefore)} TON`);
        ui.write(`   Admin: ${formatAmount(adminBalanceAfter - adminBalanceBefore)} TON`);

        // Проверяем детали очереди
        const queueDetailsAfter = await mixton.getQueueDetails();
        ui.write(`\n📋 Queue Details After:`);
        ui.write(`   Length: ${queueDetailsAfter.queueLength}`);
        ui.write(`   Amount: ${formatAmount(queueDetailsAfter.totalAmount)} TON`);
        ui.write(`   Next Time: ${queueDetailsAfter.nextTime}`);

        // Анализ результатов
        ui.write(`\n🔍 Analysis:`);
        
        const queueLengthChanged = queueInfoBefore.queueLength !== queueInfoAfter.queueLength;
        const totalWithdrawnChanged = basicStatsBefore.totalWithdrawn !== basicStatsAfter.totalWithdrawn;
        const contractBalanceChanged = contractBalanceBefore !== contractBalanceAfter;
        const depositStatusChanged = depositInfoBefore?.status !== depositInfoAfter?.status;

        ui.write(`   Queue Length Changed: ${queueLengthChanged}`);
        ui.write(`   Total Withdrawn Changed: ${totalWithdrawnChanged}`);
        ui.write(`   Contract Balance Changed: ${contractBalanceChanged}`);
        ui.write(`   Deposit Status Changed: ${depositStatusChanged}`);

        if (!queueLengthChanged && !totalWithdrawnChanged && !contractBalanceChanged && !depositStatusChanged) {
            ui.write(`   ⚠️  NO CHANGES DETECTED!`);
            ui.write(`   This indicates that the withdraw function is not working properly.`);
            ui.write(`   The function may be failing silently or not executing at all.`);
            
            // Предположения о проблеме
            ui.write(`\n💡 Possible Issues:`);
            ui.write(`   1. Function is not being called due to wrong OP code`);
            ui.write(`   2. Function is failing validation but not throwing exception`);
            ui.write(`   3. Function is executing but not saving state changes`);
            ui.write(`   4. Function is creating queue items but they're being immediately removed`);
            ui.write(`   5. Admin authorization check is failing`);
            
            // Проверяем права администратора
            const isAdmin = await mixton.isAdmin(provider.sender().address);
            ui.write(`\n👤 Admin Check:`);
            ui.write(`   Sender is Admin: ${isAdmin}`);
            if (!isAdmin) {
                ui.write(`   ❌ SENDER IS NOT ADMIN! This is likely the issue.`);
                ui.write(`   The withdraw function requires admin privileges.`);
            }
            
        } else {
            ui.write(`   ✅ Some changes detected - function may be working partially`);
        }

        // Проверяем историю транзакций
        const history = await mixton.getTransactionHistory();
        ui.write(`\n📋 Transaction History Records: ${history.length}`);

        // Если очередь пуста, но должна была создана, пробуем обработать
        if (queueInfoAfter.queueLength === 0 && !queueLengthChanged) {
            ui.write(`\n🔄 Queue is empty but should have items. Trying to process anyway...`);
            
            try {
                await mixton.sendProcessQueue(provider.sender(), toNano('0.05'));
                ui.write(`   ✅ Queue processing sent!`);
                
                // Ждем и проверяем снова
                await new Promise(resolve => setTimeout(resolve, 5000));
                
                const finalQueueInfo = await mixton.getQueueInfo();
                const finalBasicStats = await mixton.getBasicStats();
                
                ui.write(`   Final Queue Length: ${finalQueueInfo.queueLength}`);
                ui.write(`   Final Total Withdrawn: ${formatAmount(finalBasicStats.totalWithdrawn)} TON`);
                
                if (finalQueueInfo.queueLength === 0) {
                    ui.write(`   ❌ Queue is still empty - confirming the issue`);
                }
            } catch (error) {
                ui.write(`   ❌ Error processing queue: ${error instanceof Error ? error.message : String(error)}`);
            }
        }

        // Дополнительная отладка - проверяем параметры контракта
        ui.write(`\n⚙️ Contract Parameters:`);
        const mixerParams = await mixton.getMixerParams();
        const currentFeeRate = await mixton.getCurrentFeeRate();
        
        ui.write(`   Min Fee Rate: ${mixerParams.minFeeRate / 100}%`);
        ui.write(`   Max Fee Rate: ${mixerParams.maxFeeRate / 100}%`);
        ui.write(`   Current Fee Rate: ${currentFeeRate / 100}%`);
        ui.write(`   Min Delay: ${mixerParams.minDelay} seconds`);
        ui.write(`   Max Delay: ${mixerParams.maxDelay} seconds`);

        // Проверяем, соответствуют ли параметры
        if (feeRate < mixerParams.minFeeRate || feeRate > mixerParams.maxFeeRate) {
            ui.write(`   ❌ Fee rate ${feeRate / 100}% is outside allowed range [${mixerParams.minFeeRate / 100}%, ${mixerParams.maxFeeRate / 100}%]`);
        }
        
        if (delay < mixerParams.minDelay || delay > mixerParams.maxDelay) {
            ui.write(`   ❌ Delay ${delay} seconds is outside allowed range [${mixerParams.minDelay}, ${mixerParams.maxDelay}]`);
        }

        // Проверяем баланс депозита
        ui.write(`\n💰 Deposit Balance Check:`);
        if (depositInfoBefore) {
            const depositAmount = depositInfoBefore.depositTime; // Временное значение, так как мы не можем получить сумму депозита напрямую
            ui.write(`   Deposit #1 exists and is in ${depositInfoBefore.status === 0 ? 'Pending' : 'Processed'} status`);
            
            if (depositInfoBefore.status === 0) {
                ui.write(`   ✅ Deposit is available for withdrawal`);
            } else {
                ui.write(`   ❌ Deposit is not available for withdrawal (status: ${depositInfoBefore.status})`);
            }
        } else {
            ui.write(`   ❌ Deposit #1 not found`);
        }

    } catch (error) {
        ui.write(`❌ Error sending withdrawal message: ${error instanceof Error ? error.message : String(error)}`);
    }
}