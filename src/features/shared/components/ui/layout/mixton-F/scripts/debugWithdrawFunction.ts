// scripts/debugWithdrawFunction.ts
import { Address, toNano, beginCell } from '@ton/core';
import { Mixton } from '../wrappers/Mixton';
import { NetworkProvider } from '@ton/blueprint';
import { Blockchain } from '@ton/sandbox';

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

    ui.write(`🔍 Debug Withdraw Function for: ${mixton.address.toString()}\n`);

    // Получаем текущее состояние
    const basicStatsBefore = await mixton.getBasicStats();
    const queueInfoBefore = await mixton.getQueueInfo();
    const lastDepositId = await mixton.getLastDepositId();

    ui.write(`📊 State Before Withdrawal:`);
    ui.write(`   Total Deposits: ${basicStatsBefore.totalDeposits}`);
    ui.write(`   Total Withdrawn: ${formatAmount(basicStatsBefore.totalWithdrawn)} TON`);
    ui.write(`   Queue Length: ${queueInfoBefore.queueLength}`);
    ui.write(`   Last Deposit ID: #${lastDepositId}`);

    // Проверяем депозит #0
    const depositInfoBefore = await mixton.getDepositInfo(0n);
    if (depositInfoBefore) {
        ui.write(`   Deposit #0 Status: ${depositInfoBefore.status === 0 ? 'Pending' : depositInfoBefore.status === 1 ? 'Processed' : 'Failed'}`);
    } else {
        ui.write(`   Deposit #0: Not found`);
    }

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

    // Создаем сообщение для вывода вручную, чтобы проверить его структуру
    ui.write(`\n📝 Creating withdrawal message manually...`);
    
    const recipient = Address.parse('0QDi6a6j5TUfF5dZcDvDZaYrG7YzxHAF7omZubrNJgJdxQGL');
    const amount = toNano('0.5');
    const depositId = 0n;
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

    try {
        // Отправляем сообщение через стандартный метод sendWithdraw
        ui.write(`\n💸 Sending withdrawal message...`);
        
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

        // Получаем транзакции через провайдер
        const providerContract = provider.provider(mixton.address);
        const currentState = await providerContract.getState();
        
        ui.write(`\n📋 Transaction Analysis:`);
        // ИСПРАВЛЕНО: правильная проверка состояния контракта
        ui.write(`   Contract State: ${currentState.state.type === 'active' ? 'Active' : 'Inactive'}`);
        ui.write(`   Contract Balance: ${formatAmount(currentState.balance)} TON`);

        // Проверяем состояние после операции
        ui.write(`\n📊 State After Withdrawal:`);
        const basicStatsAfter = await mixton.getBasicStats();
        const queueInfoAfter = await mixton.getQueueInfo();
        const depositInfoAfter = await mixton.getDepositInfo(0n);

        ui.write(`   Total Deposits: ${basicStatsAfter.totalDeposits}`);
        ui.write(`   Total Withdrawn: ${formatAmount(basicStatsAfter.totalWithdrawn)} TON`);
        ui.write(`   Queue Length: ${queueInfoAfter.queueLength}`);
        ui.write(`   Queue Amount: ${formatAmount(queueInfoAfter.totalAmount)} TON`);
        
        if (depositInfoAfter) {
            ui.write(`   Deposit #0 Status: ${depositInfoAfter.status === 0 ? 'Pending' : depositInfoAfter.status === 1 ? 'Processed' : 'Failed'}`);
        } else {
            ui.write(`   Deposit #0: Not found`);
        }

        // Проверяем балансы после операции
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

        // Проверяем историю транзакций
        const history = await mixton.getTransactionHistory();
        ui.write(`\n📋 Transaction History Records: ${history.length}`);

        // Дополнительная отладочная информация
        ui.write(`\n🔍 Additional Debug Info:`);
        ui.write(`   Message sent to: ${mixton.address.toString()}`);
        ui.write(`   Message OP code: 0x695f7764 (withdraw)`);
        ui.write(`   Expected behavior: Create queue item and update deposit status`);

        // Проверяем, изменилось ли что-то
        const stateChanged = basicStatsAfter.totalWithdrawn !== basicStatsBefore.totalWithdrawn ||
                           queueInfoAfter.queueLength !== queueInfoBefore.queueLength ||
                           (depositInfoAfter && depositInfoBefore && depositInfoAfter.status !== depositInfoBefore.status);
        
        const balancesChanged = contractBalanceAfter !== contractBalanceBefore ||
                              recipientBalanceAfter !== recipientBalanceBefore ||
                              adminBalanceAfter !== adminBalanceBefore;

        ui.write(`\n📈 Changes Detected:`);
        ui.write(`   State Changed: ${stateChanged}`);
        ui.write(`   Balances Changed: ${balancesChanged}`);

        if (!stateChanged && !balancesChanged) {
            ui.write(`   ⚠️  No changes detected - this indicates the withdrawal function is not working properly`);
        }

    } catch (error) {
        ui.write(`❌ Error sending withdrawal message: ${error instanceof Error ? error.message : String(error)}`);
        
        // Дополнительная информация об ошибке
        if (error instanceof Error) {
            ui.write(`\n🔍 Error Details:`);
            ui.write(`   Error Name: ${error.name}`);
            ui.write(`   Error Message: ${error.message}`);
            if (error.stack) {
                ui.write(`   Stack Trace: ${error.stack.split('\n')[1]}`); // Первая строка стека
            }
        }
    }
}