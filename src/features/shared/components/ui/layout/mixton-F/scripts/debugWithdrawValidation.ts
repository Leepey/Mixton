// scripts/debugWithdrawValidation.ts
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

    ui.write(`🔍 Debug Withdraw Validation for: ${mixton.address.toString()}\n`);

    // Получаем параметры контракта
    const mixerParams = await mixton.getMixerParams();
    const limits = await mixton.getLimits();
    const currentFeeRate = await mixton.getCurrentFeeRate();

    ui.write(`📋 Contract Parameters:`);
    ui.write(`   Min Fee Rate: ${mixerParams.minFeeRate / 100}%`);
    ui.write(`   Max Fee Rate: ${mixerParams.maxFeeRate / 100}%`);
    ui.write(`   Current Fee Rate: ${currentFeeRate / 100}%`);
    ui.write(`   Min Delay: ${mixerParams.minDelay} seconds`);
    ui.write(`   Max Delay: ${mixerParams.maxDelay} seconds`);
    ui.write(`   Min Deposit: ${formatAmount(limits.minDeposit)} TON`);
    ui.write(`   Max Deposit: ${formatAmount(limits.maxDeposit)} TON`);
    ui.write(`   Min Withdraw: ${formatAmount(limits.minWithdraw)} TON`);

    // Проверяем депозит
    const depositId = 1n;
    const depositInfo = await mixton.getDepositInfo(depositId);

    ui.write(`\n💰 Deposit #${depositId} Info:`);
    if (depositInfo) {
        ui.write(`   Status: ${depositInfo.status === 0 ? 'Pending' : depositInfo.status === 1 ? 'Processed' : 'Failed'}`);
        ui.write(`   Time: ${new Date(depositInfo.depositTime * 1000).toISOString()}`);
        ui.write(`   Delay: ${depositInfo.delay} seconds`);
        
        const currentTime = Math.floor(Date.now() / 1000);
        const depositAge = currentTime - depositInfo.depositTime;
        const timeout = 604800; // 7 дней
        ui.write(`   Age: ${depositAge} seconds`);
        ui.write(`   Timeout: ${timeout} seconds`);
        ui.write(`   Is Expired: ${depositAge > timeout}`);
    } else {
        ui.write(`   Deposit not found!`);
        return;
    }

    // Проверяем параметры вывода
    const recipient = Address.parse('0QDi6a6j5TUfF5dZcDvDZaYrG7YzxHAF7omZubrNJgJdxQGL');
    const amount = toNano('0.3');
    const feeRate = 200; // 2%
    const delay = 30;

    ui.write(`\n📝 Withdrawal Parameters:`);
    ui.write(`   Recipient: ${recipient.toString()}`);
    ui.write(`   Amount: ${formatAmount(amount)} TON`);
    ui.write(`   Fee Rate: ${feeRate / 100}%`);
    ui.write(`   Delay: ${delay} seconds`);

    // Проверяем каждую валидацию
    ui.write(`\n🔍 Validation Checks:`);

    // 1. Проверка суммы
    ui.write(`   1. Amount Validation:`);
    ui.write(`      Amount > 0: ${amount > 0n ? ✅ : ❌}`);
    ui.write(`      Amount >= Min Withdraw (${formatAmount(limits.minWithdraw)}): ${amount >= limits.minWithdraw ? ✅ : ❌}`);
    ui.write(`      Amount Validation: ${amount > 0n && amount >= limits.minWithdraw ? ✅ : ❌}`);

    // 2. Проверка комиссии
    ui.write(`   2. Fee Rate Validation:`);
    ui.write(`      Fee Rate >= Min (${mixerParams.minFeeRate}): ${feeRate >= mixerParams.minFeeRate ? ✅ : ❌}`);
    ui.write(`      Fee Rate <= Max (${mixerParams.maxFeeRate}): ${feeRate <= mixerParams.maxFeeRate ? ✅ : ❌}`);
    ui.write(`      Fee Rate Validation: ${feeRate >= mixerParams.minFeeRate && feeRate <= mixerParams.maxFeeRate ? ✅ : ❌}`);

    // 3. Проверка задержки
    ui.write(`   3. Delay Validation:`);
    ui.write(`      Delay >= Min (${mixerParams.minDelay}): ${delay >= mixerParams.minDelay ? ✅ : ❌}`);
    ui.write(`      Delay <= Max (${mixerParams.maxDelay}): ${delay <= mixerParams.maxDelay ? ✅ : ❌}`);
    ui.write(`      Delay Validation: ${delay >= mixerParams.minDelay && delay <= mixerParams.maxDelay ? ✅ : ❌}`);

    // 4. Проверка депозита
    ui.write(`   4. Deposit Validation:`);
    ui.write(`      Deposit Exists: ${depositInfo !== null ? ✅ : ❌}`);
    ui.write(`      Deposit Status Pending: ${depositInfo?.status === 0 ? ✅ : ❌}`);
    const currentTime = Math.floor(Date.now() / 1000);
    const depositAge = currentTime - depositInfo!.depositTime;
    const timeout = 604800; // 7 дней
    ui.write(`      Deposit Not Expired: ${depositAge <= timeout ? ✅ : ❌}`);
    ui.write(`      Deposit Validation: ${depositInfo !== null && depositInfo?.status === 0 && depositAge <= timeout ? ✅ : ❌}`);

    // 5. Расчет комиссии и чистой суммы
    ui.write(`   5. Fee Calculation:`);
    const actualFeeRate = currentFeeRate; // Используем текущую комиссию из контракта
    const fee = (amount * BigInt(actualFeeRate)) / 10000n;
    const netAmount = amount - fee;
    ui.write(`      Actual Fee Rate: ${actualFeeRate / 100}%`);
    ui.write(`      Fee Amount: ${formatAmount(fee)} TON`);
    ui.write(`      Net Amount: ${formatAmount(netAmount)} TON`);
    ui.write(`      Fee Calculation: ${fee > 0n && netAmount > 0n ? ✅ : ❌}`);

    // 6. Проверка баланса контракта
    ui.write(`   6. Balance Validation:`);
    const contractBalance = await mixton.getBalance();
    const gasEstimate = 25000000; // ~0.025 TON
    const availableBalance = contractBalance + toNano('0.05') - gasEstimate; // + value - gas
    ui.write(`      Contract Balance: ${formatAmount(contractBalance)} TON`);
    ui.write(`      Gas Estimate: ${formatAmount(BigInt(gasEstimate))} TON`);
    ui.write(`      Available Balance: ${formatAmount(availableBalance)} TON`);
    ui.write(`      Amount <= Available: ${amount <= availableBalance ? ✅ : ❌}`);
    ui.write(`      Net Amount <= Available: ${netAmount <= availableBalance ? ✅ : ❌}`);
    ui.write(`      Balance Validation: ${amount <= availableBalance && netAmount <= availableBalance ? ✅ : ❌}`);

    // Итоговая валидация
    const allValidations = [
        amount > 0n && amount >= limits.minWithdraw,
        feeRate >= mixerParams.minFeeRate && feeRate <= mixerParams.maxFeeRate,
        delay >= mixerParams.minDelay && delay <= mixerParams.maxDelay,
        depositInfo !== null && depositInfo?.status === 0 && depositAge <= timeout,
        fee > 0n && netAmount > 0n,
        amount <= availableBalance && netAmount <= availableBalance
    ];

    const allValid = allValidations.every(v => v);

    ui.write(`\n🎯 Overall Validation: ${allValid ? ✅ : ❌}`);
    
    if (!allValid) {
        ui.write(`\n❌ Failed Validations:`);
        if (!allValidations[0]) ui.write(`   - Amount validation failed`);
        if (!allValidations[1]) ui.write(`   - Fee rate validation failed`);
        if (!allValidations[2]) ui.write(`   - Delay validation failed`);
        if (!allValidations[3]) ui.write(`   - Deposit validation failed`);
        if (!allValidations[4]) ui.write(`   - Fee calculation failed`);
        if (!allValidations[5]) ui.write(`   - Balance validation failed`);
    } else {
        ui.write(`\n✅ All validations passed! The issue must be elsewhere in the function.`);
        
        // Пробуем создать вывод с минимальными параметрами
        ui.write(`\n📝 Testing with minimal parameters...`);
        
        try {
            const minimalAmount = limits.minWithdraw;
            const minimalFeeRate = mixerParams.minFeeRate;
            const minimalDelay = mixerParams.minDelay;
            
            ui.write(`   Minimal Amount: ${formatAmount(minimalAmount)} TON`);
            ui.write(`   Minimal Fee Rate: ${minimalFeeRate / 100}%`);
            ui.write(`   Minimal Delay: ${minimalDelay} seconds`);
            
            const result = await mixton.sendWithdraw(
                provider.sender(),
                recipient,
                minimalAmount,
                depositId,
                minimalFeeRate,
                minimalDelay,
                toNano('0.05')
            );
            
            ui.write(`   ✅ Minimal withdrawal sent successfully!`);
            
            // Ждем и проверяем результат
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            const queueInfoAfter = await mixton.getQueueInfo();
            const depositInfoAfter = await mixton.getDepositInfo(depositId);
            
            ui.write(`   Queue Length After: ${queueInfoAfter.queueLength}`);
            ui.write(`   Deposit Status After: ${depositInfoAfter?.status === 0 ? 'Pending' : depositInfoAfter?.status === 1 ? 'Processed' : 'Failed'}`);
            
            if (queueInfoAfter.queueLength > 0) {
                ui.write(`   ✅ SUCCESS: Queue item created with minimal parameters!`);
                ui.write(`   The issue might be with the specific parameters used in the original test.`);
            } else {
                ui.write(`   ❌ ISSUE: Even minimal parameters don't work.`);
                ui.write(`   The problem is likely in the contract logic itself.`);
            }
            
        } catch (error) {
            ui.write(`   ❌ Error sending minimal withdrawal: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}