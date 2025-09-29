// scripts/stepByStepProcessing.ts
import { Address, toNano } from '@ton/core';
import { Mixton } from '../wrappers/Mixton';
import { NetworkProvider } from '@ton/blueprint';

// Вспомогательная функция для задержки
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function run(provider: NetworkProvider) {
    const ui = provider.ui();

    const contractAddressFromEnv = process.env.CONTRACT_ADDRESS;
    if (!contractAddressFromEnv) {
        throw new Error('Contract address not found. Please set CONTRACT_ADDRESS in your .env file.');
    }
    const contractAddress = Address.parse(contractAddressFromEnv);
    const mixton = provider.open(Mixton.createFromAddress(contractAddress));

    ui.write(`🚀 Step-by-Step Queue Processing Demo for: ${mixton.address.toString()}\n`);

    const recipient1 = Address.parse('0QCD--pPXB30jh3MBWNCKXtykqAF80o1-UGoHQpW0jRNomd4');
    const recipient2 = Address.parse('0QDi6a6j5TUfF5dZcDvDZaYrG7YzxHAF7omZubrNJgJdxQGL');
    const recipient3 = provider.sender().address!;

    const totalAmount = toNano('3');
    const parts = 3;
    const feeRate = 200;
    const delays = [30, 60, 90]; // Задержки в секундах

    ui.write(`📝 Creating multi-withdrawal:\n`);
    ui.write(`   Total Amount: ${Mixton.formatAmount(totalAmount)} TON\n`);
    ui.write(`   Parts: ${parts}\n`);
    ui.write(`   Fee Rate: ${feeRate / 100}%\n`);
    ui.write(`   Delays: ${delays.join('s, ')}s\n`);
    ui.write(`   Recipients:\n`);
    ui.write(`   Part 1: ${recipient1.toString().slice(0, 10)}...\n`);
    ui.write(`   Part 2: ${recipient2.toString().slice(0, 10)}...\n`);
    ui.write(`   Part 3: ${recipient3.toString().slice(0, 10)}...\n`);

    const lastDepositId = await mixton.getLastDepositId();
    if (lastDepositId < 0) {
        ui.write(`❌ No deposits found. Please make a deposit first.\n`);
        return;
    }

    const multiWithdrawalRequest = {
        depositId: lastDepositId,
        withdrawals: [
            { recipient: recipient1, amount: totalAmount / BigInt(parts), feeRate, delay: delays[0] },
            { recipient: recipient2, amount: totalAmount / BigInt(parts), feeRate, delay: delays[1] },
            { recipient: recipient3, amount: totalAmount / BigInt(parts), feeRate, delay: delays[2] }
        ]
    };

    const getRecipientBalances = async () => {
        const balances = [];
        for (const recipient of [recipient1, recipient2, recipient3]) {
            try {
                const state = await provider.provider(recipient).getState();
                balances.push(Mixton.formatAmount(state.balance));
            } catch (e) {
                balances.push('N/A');
            }
        }
        return balances;
    };

    const initialBalances = await getRecipientBalances();
    ui.write(`\n💳 Initial Recipient Balances:\n`);
    initialBalances.forEach((bal, i) => ui.write(`   Recipient ${i + 1}: ${bal} TON\n`));

    ui.write(`\n💸 Sending multi-withdrawal request using deposit #${lastDepositId}...\n`);
    try {
        await mixton.sendMultiWithdraw(provider.sender(), multiWithdrawalRequest, toNano('0.15'));
        ui.write(`✅ Multi-withdrawal request sent successfully!\n`);
    } catch (error) {
        ui.write(`❌ Error sending multi-withdrawal: ${error instanceof Error ? error.message : String(error)}\n`);
        return;
    }

    // Функция для отображения текущего состояния
    const showState = async (step: number) => {
        ui.write(`\n--- Step ${step} ---\n`);
        // ИСПОЛЬЗУЕМ getQueueDetails
        const queueDetails = await mixton.getQueueDetails();
        const stats = await mixton.getBasicStats();
        const balances = await getRecipientBalances();

        ui.write(`⏳ Queue Length: ${queueDetails.queueLength}\n`);
        ui.write(`💰 Queue Amount: ${Mixton.formatAmount(queueDetails.totalAmount)} TON\n`);
        ui.write(`📈 Total Withdrawn: ${Mixton.formatAmount(stats.totalWithdrawn)} TON\n`);
        balances.forEach((bal, i) => ui.write(`   Recipient ${i + 1}: ${bal} TON\n`));
    };

    await showState(0);

    for (let i = 0; i < delays.length; i++) {
        const waitTime = delays[i];
        ui.write(`\n⏳ Waiting ${waitTime} seconds for part ${i + 1} to mature...\n`);
        await delay(waitTime * 1000);

        ui.write(`\n⚙️ Processing queue (Step ${i + 1})...\n`);
        try {
            await mixton.sendProcessQueue(provider.sender(), toNano('0.05'));
            ui.write(`✅ Queue processing sent.\n`);
        } catch (error) {
            ui.write(`❌ Error processing queue: ${error instanceof Error ? error.message : String(error)}\n`);
        }

        ui.write(`⏳ Waiting for transaction to settle...\n`);
        await delay(5000); // Ждем 5 секунд для обработки транзакции

        await showState(i + 1);
    }

    ui.write(`\n🎉 Demo completed! Check recipient balances to see the results.\n`);
}