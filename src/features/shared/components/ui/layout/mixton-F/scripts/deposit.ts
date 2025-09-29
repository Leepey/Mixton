import { Mixton } from '../wrappers/Mixton';
import { toNano, Address, beginCell } from '@ton/core';
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

    ui.write(`💰 Deposit Script`);
    ui.write(`📍 Contract: ${contractAddress}`);
    
    // Проверяем, есть ли отправитель
    if (provider.sender() && provider.sender().address) {
        ui.write(`👤 Sender: ${provider.sender().address!.toString()}`);
    } else {
        ui.write(`👤 Sender: Not available (using deep link mode)`);
    }

    // Пропускаем проверку состояния контракта из-за проблем с сетью
    ui.write(`⚠️  Skipping contract state check due to network issues`);

    // Запрашиваем сумму депозита
    const amountStr = await ui.input('Enter deposit amount (TON):');
    const amount = toNano(amountStr);

    // Проверяем минимальную сумму
    if (amount < toNano('1')) {
        ui.write(`❌ Minimum deposit amount is 1 TON`);
        return;
    }

    ui.write(`\n📝 Deposit Summary:`);
    ui.write(`   Amount: ${amountStr} TON`);
    ui.write(`   To: ${contractAddress}`);

    const proceed = await ui.choose('Proceed with deposit?', ['Yes', 'No'], (choice) => choice);
    if (proceed === 'No') {
        ui.write(`❌ Deposit cancelled`);
        return;
    }

    ui.write(`💸 Attempting to send deposit...`);

    // Проверяем, есть ли отправитель для автоматической отправки
    if (provider.sender() && provider.sender().address) {
        try {
            // Метод 1: Использование sendDeposit
            await mixton.sendDeposit(provider.sender(), amount);
            ui.write(`✅ Deposit sent successfully!`);

            // Ждем и проверяем результат
            ui.write(`⏳ Waiting for transaction to be processed...`);
            await new Promise(resolve => setTimeout(resolve, 15000));

            try {
                const basicStats = await mixton.getBasicStats();
                ui.write(`📊 Updated stats:`);
                ui.write(`   Total Deposits: ${basicStats.totalDeposits}`);
                ui.write(`   Total Withdrawn: ${(Number(basicStats.totalWithdrawn) / 1000000000).toFixed(9)} TON`);
            } catch (statsError) {
                ui.write(`⚠️  Could not fetch updated stats, but deposit was likely sent`);
                ui.write(`💡 Check transaction in explorer: https://testnet.tonscan.org/address/${contractAddress}`);
            }

        } catch (error) {
            ui.write(`❌ Contract method failed: ${error instanceof Error ? error.message : String(error)}`);

            ui.write(`\n💡 MANUAL DEPOSIT METHOD:`);
            ui.write(`Due to network issues, please send manually:`);

            ui.write(`\n📱 Steps:`);
            ui.write(`1. Open your TON wallet app`);
            ui.write(`2. Select "Send" or "Transfer"`);
            ui.write(`3. Recipient: ${contractAddress}`);
            ui.write(`4. Amount: ${amountStr} TON`);
            ui.write(`5. Confirm and send`);

            ui.write(`\n🌐 Alternative: Web Explorer`);
            ui.write(`1. Visit https://testnet.tonscan.org`);
            ui.write(`2. Find your address: ${provider.sender().address!.toString()}`);
            ui.write(`3. Use "Send TON" function`);
            ui.write(`4. Send to: ${contractAddress}`);
            ui.write(`5. Amount: ${amountStr} TON`);

            ui.write(`\n💡 Next Steps:`);
            const nextAction = await ui.choose('What would you like to do?', 
                ['Check network status', 'Try alternative method', 'Exit'], 
                (choice) => choice);
            
            if (nextAction === 'Check network status') {
                ui.write(`💡 Run: npx blueprint run networkDiagnosis`);
            } else if (nextAction === 'Try alternative method') {
                ui.write(`\n🔄 Trying alternative deposit method...`);
                
                try {
                    // Метод 2: Прямая отправка сообщения
                    await mixton.sendInternal(provider.sender(), {
                        value: amount,
                        body: beginCell().endCell(),
                        bounce: false
                    });
                    
                    ui.write(`✅ Alternative deposit method sent successfully!`);
                    
                    // Ждем и проверяем результат
                    ui.write(`⏳ Waiting for transaction to be processed...`);
                    await new Promise(resolve => setTimeout(resolve, 15000));
                    
                    try {
                        const basicStats = await mixton.getBasicStats();
                        ui.write(`📊 Updated stats:`);
                        ui.write(`   Total Deposits: ${basicStats.totalDeposits}`);
                        ui.write(`   Total Withdrawn: ${(Number(basicStats.totalWithdrawn) / 1000000000).toFixed(9)} TON`);
                    } catch (statsError) {
                        ui.write(`⚠️  Could not fetch updated stats, but deposit was likely sent`);
                        ui.write(`💡 Check transaction in explorer: https://testnet.tonscan.org/address/${contractAddress}`);
                    }
                    
                } catch (altError) {
                    ui.write(`❌ Alternative method also failed: ${altError instanceof Error ? altError.message : String(altError)}`);
                    ui.write(`💡 Please use manual deposit method described above`);
                }
            }
        }
    } else {
        // Режим без отправителя (например, при использовании deep link)
        ui.write(`💡 MANUAL DEPOSIT METHOD (Deep Link Mode):`);
        ui.write(`Since you're using deep link mode, please send manually:`);

        ui.write(`\n📱 Steps:`);
        ui.write(`1. Open your TON wallet app`);
        ui.write(`2. Select "Send" or "Transfer"`);
        ui.write(`3. Recipient: ${contractAddress}`);
        ui.write(`4. Amount: ${amountStr} TON`);
        ui.write(`5. Confirm and send`);

        ui.write(`\n🌐 Alternative: Web Explorer`);
        ui.write(`1. Visit https://testnet.tonscan.org`);
        ui.write(`2. Use "Send TON" function`);
        ui.write(`3. Send to: ${contractAddress}`);
        ui.write(`4. Amount: ${amountStr} TON`);

        ui.write(`\n💡 After sending, you can check the transaction:`);
        ui.write(`   Explorer: https://testnet.tonscan.org/address/${contractAddress}`);
    }
}