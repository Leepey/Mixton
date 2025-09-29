// scripts/emergencyWithdraw.ts
import { toNano, Address } from '@ton/core';
import { Mixton } from '../wrappers/Mixton';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    let amountToWithdraw: bigint;
    if (args.length > 0) {
        try {
            amountToWithdraw = toNano(args[0]);
        } catch (error) {
            ui.write(`❌ Invalid amount format: ${args[0]}. Please use a number (e.g., 5.5).\n`);
            return;
        }
    } else {
        const amountString = await ui.input('Enter amount to withdraw (TON): ');
        try {
            amountToWithdraw = toNano(amountString);
        } catch (error) {
            ui.write(`❌ Invalid amount format: ${amountString}. Please use a number (e.g., 5.5).\n`);
            return;
        }
    }

    if (amountToWithdraw <= 0n) {
        ui.write('❌ Amount must be greater than 0.\n');
        return;
    }

    const contractAddressFromEnv = process.env.CONTRACT_ADDRESS;
    if (!contractAddressFromEnv) {
        throw new Error('Contract address not found. Please set CONTRACT_ADDRESS in your .env file or deploy the contract first.');
    }
    const contractAddress = Address.parse(contractAddressFromEnv);
    const mixton = provider.open(Mixton.createFromAddress(contractAddress));

    ui.write(`🚨 Emergency Withdrawal Script\n`);
    ui.write(`📍 Contract: ${mixton.address.toString()}\n`);
    ui.write(`👤 Sender (Admin): ${provider.sender().address?.toString()}\n`);
    ui.write(`💸 Amount to Withdraw: ${Mixton.formatAmount(amountToWithdraw)} TON\n`);

    try {
        const contractState = await provider.provider(mixton.address).getState();
        const contractBalance = contractState.balance;
        ui.write(`💰 Current Contract Balance: ${Mixton.formatAmount(contractBalance)} TON\n`);

        if (contractBalance < amountToWithdraw) {
            ui.write(`❌ Insufficient contract balance. Cannot withdraw ${Mixton.formatAmount(amountToWithdraw)} TON.\n`);
            ui.write(`   Available: ${Mixton.formatAmount(contractBalance)} TON\n`);
            return;
        }
    } catch (error) {
        ui.write(`⚠️  Could not fetch contract balance. Proceeding anyway...\n`);
    }
    
    // ИСПРАВЛЕНО: Добавлена функция display для ui.choose
    const confirm = await ui.choose('Confirm emergency withdrawal?', ['Yes', 'No'], (v: string) => v);
    if (confirm === 'No') {
        ui.write('❌ Operation cancelled by user.\n');
        return;
    }

    ui.write('💸 Sending emergency withdrawal request...\n');

    try {
        const result = await mixton.sendEmergencyWithdraw(
            provider.sender(),
            amountToWithdraw,
            toNano('0.05') // Комиссия за транзакцию
        );

        ui.write('✅ Emergency withdrawal transaction sent successfully!\n');
        
        // Ожидаем завершения транзакции
        await provider.waitForDeploy(mixton.address, 10); // Ожидание 10 секунд
        
        const finalContractState = await provider.provider(mixton.address).getState();
        const finalContractBalance = finalContractState.balance;
        const adminBalance = (await provider.provider(provider.sender().address!).getState()).balance;

        ui.write(`\n📊 Withdrawal Summary:\n`);
        ui.write(`   Final Contract Balance: ${Mixton.formatAmount(finalContractBalance)} TON\n`);
        ui.write(`   Your New Balance: ${Mixton.formatAmount(adminBalance)} TON\n`);
        ui.write(`🎉 Emergency withdrawal completed successfully!\n`);

    } catch (error) {
        ui.write(`\n❌ Error during emergency withdrawal: ${error instanceof Error ? error.message : String(error)}\n`);
    }
}