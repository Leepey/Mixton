// scripts/checkAllMethods.ts
import { Address, toNano } from '@ton/core';
import { Mixton } from '../wrappers/Mixton';
import { NetworkProvider } from '@ton/blueprint';

// Вспомогательная функция для форматирования даты
const formatDate = (timestamp: number): string => {
    if (timestamp === -1) return 'N/A';
    return new Date(timestamp * 1000).toLocaleString();
};

// Вспомогательная функция для форматирования адреса
const formatAddress = (address: Address | null | undefined): string => {
    if (!address) return 'N/A';
    return address.toString();
};

export async function run(provider: NetworkProvider) {
    const ui = provider.ui();

    // Используем адрес контракта из .env или из конфигурации, если он задан
    let contractAddress: Address;
    const contractAddressFromEnv = process.env.CONTRACT_ADDRESS;

    if (contractAddressFromEnv) {
        contractAddress = Address.parse(contractAddressFromEnv);
        ui.write(`Using contract address from .env: ${contractAddress.toString()}\n`);
    } else {
        // Если адрес не задан, попробуем получить его из последнего деплоя (это требует дополнительной логики, которую мы здесь не реализуем)
        // Для простоты потребуем, чтобы адрес был в .env
        throw new Error('Contract address not found. Please deploy the contract first or set CONTRACT_ADDRESS in your .env file.');
    }

    const mixton = provider.open(Mixton.createFromAddress(contractAddress));
    ui.write(`🔍 Checking all methods for contract: ${mixton.address.toString()}\n`);

    // --- Get-методы ---
    ui.write('📊 Testing GET methods:\n');

    try {
        const admin = await mixton.getAdmin();
        ui.write(`✅ getAdmin(): ${formatAddress(admin)}\n`);
    } catch (e) {
        ui.write(`❌ getAdmin(): Error - ${e instanceof Error ? e.message : String(e)}\n`);
    }

    try {
        const params = await mixton.getMixerParams();
        ui.write(`✅ getMixerParams(): MinFee=${params.minFeeRate/100}%, MaxFee=${params.maxFeeRate/100}%, MinDelay=${params.minDelay}s, MaxDelay=${params.maxDelay}s\n`);
    } catch (e) {
        ui.write(`❌ getMixerParams(): Error - ${e instanceof Error ? e.message : String(e)}\n`);
    }

    try {
        const currentFeeRate = await mixton.getCurrentFeeRate();
        ui.write(`✅ getCurrentFeeRate(): ${currentFeeRate/100}%\n`);
    } catch (e) {
        ui.write(`❌ getCurrentFeeRate(): Error - ${e instanceof Error ? e.message : String(e)}\n`);
    }

    try {
        const limits = await mixton.getLimits();
        ui.write(`✅ getLimits(): MinDep=${Mixton.formatAmount(limits.minDeposit)} TON, MaxDep=${Mixton.formatAmount(limits.maxDeposit)} TON, MinWith=${Mixton.formatAmount(limits.minWithdraw)} TON\n`);
    } catch (e) {
        ui.write(`❌ getLimits(): Error - ${e instanceof Error ? e.message : String(e)}\n`);
    }

    try {
        const stats = await mixton.getBasicStats();
        ui.write(`✅ getBasicStats(): TotalDeposits=${stats.totalDeposits}, TotalWithdrawn=${Mixton.formatAmount(stats.totalWithdrawn)} TON\n`);
    } catch (e) {
        ui.write(`❌ getBasicStats(): Error - ${e instanceof Error ? e.message : String(e)}\n`);
    }

    try {
        const lastDepositId = await mixton.getLastDepositId();
        ui.write(`✅ getLastDepositId(): ${lastDepositId.toString()}\n`);
    } catch (e) {
        ui.write(`❌ getLastDepositId(): Error - ${e instanceof Error ? e.message : String(e)}\n`);
    }
    
    try {
        const queueInfo = await mixton.getQueueInfo();
        ui.write(`✅ getQueueInfo(): Length=${queueInfo.queueLength}, Amount=${Mixton.formatAmount(queueInfo.totalAmount)} TON\n`);
    } catch (e) {
        ui.write(`❌ getQueueInfo(): Error - ${e instanceof Error ? e.message : String(e)}\n`);
    }

    try {
        const queueStatusNumber = await mixton.getQueueStatus();
        let statusText = 'Unknown';
        if (queueStatusNumber === 0) statusText = 'Empty';
        else if (queueStatusNumber === 1) statusText = 'Waiting';
        else if (queueStatusNumber === 2) statusText = 'Ready';
        ui.write(`✅ getQueueStatus(): ${statusText} (${queueStatusNumber})\n`);
    } catch (e) {
        ui.write(`❌ getQueueStatus(): Error - ${e instanceof Error ? e.message : String(e)}\n`);
    }

    try {
        const minNextTime = await mixton.getMinNextTime();
        ui.write(`✅ getMinNextTime(): ${minNextTime}s (${formatDate(minNextTime)})\n`);
    } catch (e) {
        ui.write(`❌ getMinNextTime(): Error - ${e instanceof Error ? e.message : String(e)}\n`);
    }
    
    try {
        const queueDetails = await mixton.getQueueDetails();
        ui.write(`✅ getQueueDetails(): Length=${queueDetails.queueLength}, Amount=${Mixton.formatAmount(queueDetails.totalAmount)} TON, NextTime=${queueDetails.nextTime}s (${formatDate(queueDetails.nextTime)})\n`);
    } catch (e) {
        ui.write(`❌ getQueueDetails(): Error - ${e instanceof Error ? e.message : String(e)}\n`);
    }

    try {
        const signersInfo = await mixton.getSigners();
        ui.write(`✅ getSigners(): Count=${signersInfo.count}, Required=${signersInfo.required}\n`);
    } catch (e) {
        ui.write(`❌ getSigners(): Error - ${e instanceof Error ? e.message : String(e)}\n`);
    }

    try {
        const oracleData = await mixton.getOracleData();
        ui.write(`✅ getOracleData(): Data=${oracleData.data}, LastUpdate=${formatDate(oracleData.lastUpdate)}\n`);
    } catch (e) {
        ui.write(`❌ getOracleData(): Error - ${e instanceof Error ? e.message : String(e)}\n`);
    }

    try {
        const history = await mixton.getTransactionHistory();
        ui.write(`✅ getTransactionHistory(): Found ${history.length} records.\n`);
        // Можно вывести несколько последних записей для примера
        history.slice(-3).forEach((record, index) => {
            const typeText = record.txType === 0 ? 'Deposit' : record.txType === 1 ? 'Withdrawal' : 'Fee';
            ui.write(`   Record ${history.length - history.slice(-3).length + index + 1}: Type=${typeText}, To/From=${formatAddress(record.address)}, Amount=${Mixton.formatAmount(record.amount)} TON, Status=${record.status === 0 ? 'Pending' : record.status === 1 ? 'Completed' : 'Error'}, Time=${formatDate(record.timestamp)}\n`);
        });
    } catch (e) {
        ui.write(`❌ getTransactionHistory(): Error - ${e instanceof Error ? e.message : String(e)}\n`);
    }
    
    // --- Get-методы с параметрами ---
    ui.write('\n📊 Testing GET methods with parameters:\n');

    try {
        const depositInfo = await mixton.getDepositInfo(BigInt(1)); // Проверим первый депозит
        if (depositInfo) {
            ui.write(`✅ getDepositInfo(1): Time=${formatDate(depositInfo.depositTime)}, Delay=${depositInfo.delay}s, Status=${depositInfo.status === 0 ? 'Pending' : 'Processed'}\n`);
        } else {
            ui.write(`✅ getDepositInfo(1): Deposit not found or null returned.\n`);
        }
    } catch (e) {
        ui.write(`❌ getDepositInfo(1): Error - ${e instanceof Error ? e.message : String(e)}\n`);
    }

    try {
        const isBlacklisted = await mixton.isAddressBlacklisted(Address.parse('EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c')); // Несуществующий адрес
        ui.write(`✅ isAddressBlacklisted(EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c): ${isBlacklisted}\n`);
    } catch (e) {
        ui.write(`❌ isAddressBlacklisted(...): Error - ${e instanceof Error ? e.message : String(e)}\n`);
    }
    
    try {
        const isAdmin = await mixton.isAdmin(provider.sender().address!);
        ui.write(`✅ isAdmin(${provider.sender().address?.toString()}): ${isAdmin}\n`);
    } catch (e) {
        ui.write(`❌ isAdmin(...): Error - ${e instanceof Error ? e.message : String(e)}\n`);
    }

    // --- Статические утилитарные методы ---
    ui.write('\n🔧 Testing static utility methods:\n');

    ui.write(`✅ formatDelay(3600): ${Mixton.formatDelay(3600)}\n`);
    ui.write(`✅ formatDelay(1800): ${Mixton.formatDelay(1800)}\n`);
    ui.write(`✅ formatFeeRate(250): ${Mixton.formatFeeRate(250)}\n`);
    ui.write(`✅ formatAmount(toNano('1.5')): ${Mixton.formatAmount(toNano('1.5'))} TON\n`);
    
    const testAmount = toNano('10');
    const testFeeRate = 200; // 2%
    const fee = mixton.calculateFee(testAmount, testFeeRate);
    const netAmount = mixton.calculateNetAmount(testAmount, testFeeRate);
    ui.write(`✅ calculateFee(${Mixton.formatAmount(testAmount)} TON, ${testFeeRate}): ${Mixton.formatAmount(fee)} TON\n`);
    ui.write(`✅ calculateNetAmount(${Mixton.formatAmount(testAmount)} TON, ${testFeeRate}): ${Mixton.formatAmount(netAmount)} TON\n`);

    // --- Health Check ---
    ui.write('\n🏥 Running health check...\n');
    try {
        const health = await mixton.healthCheck(provider.provider(mixton.address));
        ui.write(`Health Status: ${health.healthy ? '✅ HEALTHY' : '❌ UNHEALTHY'}\n`);
        if (health.issues.length > 0) {
            health.issues.forEach(issue => ui.write(` - Issue: ${issue}\n`));
        }
    } catch (e) {
        ui.write(`❌ healthCheck(): Error - ${e instanceof Error ? e.message : String(e)}\n`);
    }

    // --- Информация о send-методах (без вызова) ---
    ui.write('\n📤 Information about SEND methods (not called in this script):\n');
    ui.write('✅ sendDeposit(sender, value)\n');
    ui.write('✅ sendWithdraw(sender, recipient, amount, depositId, feeRate, delay, value)\n');
    ui.write('✅ sendMultiWithdraw(sender, request, value)\n');
    ui.write('✅ sendEmergencyWithdraw(sender, amount, value)\n');
    ui.write('✅ sendAddToBlacklist(sender, address, value)\n');
    ui.write('✅ sendRemoveFromBlacklist(sender, address, value)\n');
    ui.write('✅ sendProcessQueue(sender, value)\n');
    ui.write('✅ sendSetFeeRate(sender, feeRate, value)\n');
    ui.write('✅ sendAddSigner(sender, signer, value)\n');
    ui.write('✅ sendRemoveSigner(sender, signer, value)\n');
    ui.write('✅ sendUpdateOracle(sender, oracleData, value)\n');
    
    ui.write('\n🎉 All available methods checked.\n');
}