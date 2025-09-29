// scripts/debugMultiWithdraw.ts
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

    ui.write(`🔍 Debug Multi-Withdrawal for: ${mixton.address.toString()}\n`);

    // Получаем текущее состояние контракта
    const admin = await mixton.getAdmin();
    const basicStats = await mixton.getBasicStats();
    const queueInfo = await mixton.getQueueInfo();
    const queueDetails = await mixton.getQueueDetails();
    const lastDepositId = await mixton.getLastDepositId();

    ui.write(`📊 Current State:`);
    ui.write(`   Admin: ${admin.toString()}`);
    ui.write(`   Total Deposits: ${basicStats.totalDeposits}`);
    ui.write(`   Total Withdrawn: ${formatAmount(basicStats.totalWithdrawn)} TON`);
    ui.write(`   Queue Length: ${queueInfo.queueLength}`);
    ui.write(`   Queue Amount: ${formatAmount(queueInfo.totalAmount)} TON`);
    ui.write(`   Queue Details: Length=${queueDetails.queueLength}, Amount=${formatAmount(queueDetails.totalAmount)} TON, NextTime=${queueDetails.nextTime}`);
    ui.write(`   Last Deposit ID: #${lastDepositId}`);

    if (lastDepositId < 0) {
        ui.write(`❌ No deposits found. Please make a deposit first.`);
        return;
    }

    // Получаем информацию о последнем депозите
    const depositInfo = await mixton.getDepositInfo(lastDepositId);
    
    // Проверяем, что депозит существует и используем утверждение типа
    if (!depositInfo || depositInfo.depositTime === -1) {
        ui.write(`❌ Deposit #${lastDepositId} not found.`);
        return;
    }
    
    // Теперь TypeScript знает, что depositInfo не null
    const deposit = depositInfo!;
    
    ui.write(`\n📝 Last Deposit Info:`);
    ui.write(`   Deposit #${lastDepositId}:`);
    ui.write(`   Time: ${new Date(deposit.depositTime * 1000).toISOString()}`);
    ui.write(`   Delay: ${deposit.delay} seconds`);
    ui.write(`   Status: ${deposit.status === 0 ? 'Pending' : deposit.status === 1 ? 'Processed' : 'Failed'}`);

    // Проверяем статус депозита
    if (deposit.status !== 0) {
        ui.write(`❌ Deposit #${lastDepositId} is not in Pending status. Cannot create withdrawal.`);
        return;
    }

    // Создаем запрос на множественный вывод
    const totalAmount = toNano('1');
    const parts = 2;
    const feeRate = 200;
    const recipient1 = Address.parse('0QDi6a6j5TUfF5dZcDvDZaYrG7YzxHAF7omZubrNJgJdxQGL');
    const recipient2 = Address.parse('0QCD--pPXB30jh3MBWNCKXtykqAF80o1-UGoHQpW0jRNomd4');

    const multiWithdrawalRequest = {
        depositId: lastDepositId,
        withdrawals: [
            { recipient: recipient1, amount: totalAmount / BigInt(parts), feeRate, delay: 30 },
            { recipient: recipient2, amount: totalAmount / BigInt(parts), feeRate, delay: 60 }
        ]
    };

    ui.write(`\n📝 Multi-Withdrawal Request:`);
    ui.write(`   Deposit ID: #${lastDepositId}`);
    ui.write(`   Total Amount: ${formatAmount(totalAmount)} TON`);
    ui.write(`   Parts: ${parts}`);
    ui.write(`   Fee Rate: ${feeRate / 100}%`);
    ui.write(`   Recipient 1: ${recipient1.toString()}`);
    ui.write(`   Recipient 2: ${recipient2.toString()}`);

    // Получаем балансы получателей до операции
    const getRecipientBalance = async (address: Address) => {
        try {
            const state = await provider.provider(address).getState();
            return state.balance;
        } catch (e) {
            return 0n;
        }
    };

    const balance1Before = await getRecipientBalance(recipient1);
    const balance2Before = await getRecipientBalance(recipient2);

    ui.write(`\n💳 Recipient Balances Before:`);
    ui.write(`   Recipient 1: ${formatAmount(balance1Before)} TON`);
    ui.write(`   Recipient 2: ${formatAmount(balance2Before)} TON`);

    // Отправляем запрос на множественный вывод
    ui.write(`\n💸 Sending multi-withdrawal request...`);
    try {
        const result = await mixton.sendMultiWithdraw(
            provider.sender(),
            multiWithdrawalRequest,
            toNano('0.1')
        );
        ui.write(`✅ Multi-withdrawal request sent successfully!`);

        // Проверяем транзакции - исправляем доступ к транзакциям
        const transactions = result as any;
        if (transactions && transactions.transactions && Array.isArray(transactions.transactions)) {
            const tx = transactions.transactions.find((t: any) => 
                t.inMessage && 
                t.inMessage.info && 
                t.inMessage.info.src && 
                t.inMessage.info.dest && 
                t.inMessage.info.dest.toString() === mixton.address.toString()
            );

            if (tx) {
                ui.write(`\n📋 Transaction Details:`);
                ui.write(`   Success: ${tx.description?.computePhase?.success === true}`);
                ui.write(`   Exit Code: ${tx.description?.computePhase?.exitCode}`);
                ui.write(`   Gas Used: ${tx.totalFees ? formatAmount(tx.totalFees) : 'N/A'} TON`);
                
                if (tx.description?.computePhase?.success !== true) {
                    ui.write(`❌ Transaction failed with exit code: ${tx.description?.computePhase?.exitCode}`);
                }
            }
        }

    } catch (error) {
        ui.write(`❌ Error sending multi-withdrawal: ${error instanceof Error ? error.message : String(error)}`);
        return;
    }

    // Проверяем состояние после операции
    ui.write(`\n📊 State After Multi-Withdrawal:`);
    const queueInfoAfter = await mixton.getQueueInfo();
    const queueDetailsAfter = await mixton.getQueueDetails();
    const basicStatsAfter = await mixton.getBasicStats();

    ui.write(`   Queue Length: ${queueInfoAfter.queueLength}`);
    ui.write(`   Queue Amount: ${formatAmount(queueInfoAfter.totalAmount)} TON`);
    ui.write(`   Queue Details: Length=${queueDetailsAfter.queueLength}, Amount=${formatAmount(queueDetailsAfter.totalAmount)} TON, NextTime=${queueDetailsAfter.nextTime}`);
    ui.write(`   Total Withdrawn: ${formatAmount(basicStatsAfter.totalWithdrawn)} TON`);

    // Проверяем статус депозита после операции
    const depositInfoAfter = await mixton.getDepositInfo(lastDepositId);
    
    // Проверяем, что депозит существует после операции и используем утверждение типа
    if (!depositInfoAfter || depositInfoAfter.depositTime === -1) {
        ui.write(`❌ Deposit #${lastDepositId} not found after operation.`);
    } else {
        // Теперь TypeScript знает, что depositInfoAfter не null
        const depositAfter = depositInfoAfter!;
        ui.write(`\n📝 Deposit Status After:`);
        ui.write(`   Status: ${depositAfter.status === 0 ? 'Pending' : depositAfter.status === 1 ? 'Processed' : 'Failed'}`);
    }

    // Получаем балансы получателей после операции
    const balance1After = await getRecipientBalance(recipient1);
    const balance2After = await getRecipientBalance(recipient2);

    ui.write(`\n💳 Recipient Balances After:`);
    ui.write(`   Recipient 1: ${formatAmount(balance1After)} TON`);
    ui.write(`   Recipient 2: ${formatAmount(balance2After)} TON`);

    // Проверяем историю транзакций
    const history = await mixton.getTransactionHistory();
    ui.write(`\n📋 Transaction History Records: ${history.length}`);

    // Если очередь не пуста, пробуем обработать ее
    if (queueInfoAfter.queueLength > 0) {
        ui.write(`\n⏳ Queue is not empty. Processing...`);
        
        // Увеличиваем время для обработки
        ui.write(`   Waiting for queue to mature...`);
        
        try {
            const processResult = await mixton.sendProcessQueue(provider.sender(), toNano('0.05'));
            ui.write(`✅ Queue processing sent.`);

            // Проверяем состояние после обработки
            const queueInfoProcessed = await mixton.getQueueInfo();
            const basicStatsProcessed = await mixton.getBasicStats();

            ui.write(`\n📊 State After Processing:`);
            ui.write(`   Queue Length: ${queueInfoProcessed.queueLength}`);
            ui.write(`   Queue Amount: ${formatAmount(queueInfoProcessed.totalAmount)} TON`);
            ui.write(`   Total Withdrawn: ${formatAmount(basicStatsProcessed.totalWithdrawn)} TON`);

            // Получаем финальные балансы
            const balance1Final = await getRecipientBalance(recipient1);
            const balance2Final = await getRecipientBalance(recipient2);

            ui.write(`\n💳 Final Recipient Balances:`);
            ui.write(`   Recipient 1: ${formatAmount(balance1Final)} TON (change: ${formatAmount(balance1Final - balance1Before)})`);
            ui.write(`   Recipient 2: ${formatAmount(balance2Final)} TON (change: ${formatAmount(balance2Final - balance2Before)})`);

        } catch (error) {
            ui.write(`❌ Error processing queue: ${error instanceof Error ? error.message : String(error)}`);
        }
    } else {
        ui.write(`\n❌ Queue is empty after multi-withdrawal. This indicates a problem.`);
    }
}