// scripts/testSingleWithdraw.ts
import { Mixton } from '../wrappers/Mixton';
import { toNano, beginCell, Address } from '@ton/core';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const ui = provider.ui();

    const mixton = provider.open(
        Mixton.createFromAddress(
            Address.parse('EQDWwgurseY38CKqLIYt6ZbkOR8BAkkP4jmS6r6iB22rf3xK')
        )
    );

    ui.write(`🧪 Testing Single Withdraw Function for: ${mixton.address.toString()}`);

    // Получаем начальное состояние
    const initialStats = await mixton.getBasicStats();
    ui.write(`\nInitial State:`);
    ui.write(`Total Deposits: ${initialStats.totalDeposits}`);
    ui.write(`Total Withdrawn: ${initialStats.totalWithdrawn} TON`);

    // Проверяем депозит #2 (он в статусе Pending)
    try {
        const depositInfo = await mixton.getDepositInfo(2n);
        ui.write(`\nDeposit #2 Info:`);
        ui.write(`Time: ${new Date(depositInfo.depositTime * 1000).toISOString()}`);
        ui.write(`Delay: ${depositInfo.delay}`);
        ui.write(`Status: ${depositInfo.status}`);
        
        if (depositInfo.status !== 0) {
            ui.write(`❌ Deposit #2 is not in Pending status!`);
            return;
        }
    } catch (error) {
        ui.write(`❌ Error getting deposit info: ${error instanceof Error ? error.message : String(error)}`);
        return;
    }

    // Создаем вывод с минимальными параметрами
    ui.write(`\nCreating simple withdrawal...`);
    
    try {
        const recipient = Address.parse('EQDi6a6j5TUfF5dZcDvDZaYrG7YzxHAF7omZubrNJgJdxefE');
        const amount = toNano('0.1'); // Минимальная сумма
        const feeRate = 100; // Минимальная комиссия 1%
        const delay = 30; // Минимальная задержка
        
        ui.write(`Withdrawal Parameters:`);
        ui.write(`Recipient: ${recipient.toString().substring(0, 20)}...`);
        ui.write(`Amount: ${amount} TON`);
        ui.write(`Fee Rate: ${feeRate / 100}%`);
        ui.write(`Delay: ${delay} seconds`);
        
        // Отправляем команду вывода
        await mixton.sendWithdraw(
            provider.sender(),
            recipient,
            amount,
            2n, // depositId #2
            feeRate,
            delay,
            toNano('0.05')
        );
        
        ui.write(`✅ Withdrawal command sent!`);
        
        // Ждем обработки
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Проверяем состояние после создания вывода
        const queueInfo = await mixton.getQueueInfo();
        ui.write(`\nAfter Withdrawal Creation:`);
        ui.write(`Queue Length: ${queueInfo.queueLength}`);
        ui.write(`Queue Amount: ${queueInfo.totalAmount} TON`);
        
        if (queueInfo.queueLength > 0) {
            ui.write(`✅ SUCCESS: Queue item was created!`);
            
            // Проверяем статус депозита
            const depositInfoAfter = await mixton.getDepositInfo(2n);
            ui.write(`Deposit #2 Status After: ${depositInfoAfter.status}`);
            
            // Ждем задержку и обрабатываем очередь
            ui.write(`\nWaiting ${delay + 5} seconds before processing...`);
            await new Promise(resolve => setTimeout(resolve, (delay + 5) * 1000));
            
            // Обрабатываем очередь
            ui.write(`Processing queue...`);
            await mixton.sendProcessQueue(provider.sender(), toNano('0.05'));
            
            // Ждем обработки
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            // Проверяем результат
            const queueInfoAfterProcess = await mixton.getQueueInfo();
            const statsAfter = await mixton.getBasicStats();
            
            ui.write(`\nAfter Processing:`);
            ui.write(`Queue Length: ${queueInfoAfterProcess.queueLength}`);
            ui.write(`Total Withdrawn: ${statsAfter.totalWithdrawn} TON`);
            ui.write(`Withdrawn Change: ${statsAfter.totalWithdrawn - initialStats.totalWithdrawn} TON`);
            
            if (statsAfter.totalWithdrawn > initialStats.totalWithdrawn) {
                ui.write(`🎉 SUCCESS: Withdrawal was processed!`);
            } else {
                ui.write(`❌ FAILURE: Withdrawal was not processed`);
            }
        } else {
            ui.write(`❌ FAILURE: Queue item was not created`);
        }
        
    } catch (error) {
        ui.write(`❌ Error during withdrawal test: ${error instanceof Error ? error.message : String(error)}`);
    }
}