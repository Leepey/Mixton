import { Mixton } from '../wrappers/Mixton';
import { Address } from '@ton/core';
import { NetworkProvider } from '@ton/blueprint';
import { config } from 'dotenv';

// Загружаем переменные окружения
config();

export async function run(provider: NetworkProvider) {
    const ui = provider.ui();

    ui.write(`🔍 Network Diagnosis`);

    try {
        // Получаем адрес контракта из .env
        const contractAddress = process.env.CONTRACT_ADDRESS;
        if (!contractAddress) {
            throw new Error('CONTRACT_ADDRESS not found in .env file');
        }

        // Создаем экземпляр контракта с адресом из .env
        const mixton = provider.open(Mixton.createFromAddress(Address.parse(contractAddress)));

        ui.write(`📍 Contract address: ${contractAddress}`);
        ui.write(`👤 Your address: ${provider.sender().address!.toString()}`);

        // Проверяем состояние контракта
        ui.write(`\n📊 Checking contract state...`);
        const contractState = await provider.provider(mixton.address).getState();
        ui.write(`   Contract state: ${contractState.state.type}`);
        ui.write(`   Contract balance: ${(Number(contractState.balance) / 1000000000).toFixed(9)} TON`);

        if (contractState.state.type === 'active') {
            ui.write(`✅ Contract is active`);
            
            // Пытаемся получить базовую информацию
            ui.write(`\n📋 Testing contract methods...`);
            
            try {
                const admin = await mixton.getAdmin();
                ui.write(`✅ getAdmin() - Success: ${admin.toString()}`);
            } catch (error) {
                ui.write(`❌ getAdmin() - Failed: ${error instanceof Error ? error.message : String(error)}`);
            }

            try {
                const basicStats = await mixton.getBasicStats();
                ui.write(`✅ getBasicStats() - Success: ${basicStats.totalDeposits} deposits, ${basicStats.totalWithdrawn} withdrawn`);
            } catch (error) {
                ui.write(`❌ getBasicStats() - Failed: ${error instanceof Error ? error.message : String(error)}`);
            }

            try {
                const lastDepositId = await mixton.getLastDepositId();
                ui.write(`✅ getLastDepositId() - Success: ${lastDepositId}`);
            } catch (error) {
                ui.write(`❌ getLastDepositId() - Failed: ${error instanceof Error ? error.message : String(error)}`);
            }

            try {
                const queueInfo = await mixton.getQueueInfo();
                ui.write(`✅ getQueueInfo() - Success: ${queueInfo.queueLength} items in queue`);
            } catch (error) {
                ui.write(`❌ getQueueInfo() - Failed: ${error instanceof Error ? error.message : String(error)}`);
            }

        } else {
            ui.write(`❌ Contract is not active`);
        }

        // Проверяем баланс отправителя
        ui.write(`\n💰 Checking sender balance...`);
        const senderState = await provider.provider(provider.sender().address!).getState();
        ui.write(`   Sender balance: ${(Number(senderState.balance) / 1000000000).toFixed(9)} TON`);

        if (Number(senderState.balance) < 1000000000) {
            ui.write(`⚠️  Low sender balance! You need at least 1 TON for transactions.`);
        }

        ui.write(`\n✅ Network diagnosis completed!`);

    } catch (error) {
        ui.write(`❌ Error during diagnosis: ${error instanceof Error ? error.message : String(error)}`);
        ui.write(`\n💡 Possible solutions:`);
        ui.write(`1. Check your internet connection`);
        ui.write(`2. Verify you're using the correct network (testnet/mainnet)`);
        ui.write(`3. Try again later - the network might be temporarily unavailable`);
        ui.write(`4. Check if the contract address is correct`);
    }
}