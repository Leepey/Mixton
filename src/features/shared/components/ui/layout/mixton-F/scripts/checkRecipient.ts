import { Address } from '@ton/core';
import { NetworkProvider } from '@ton/blueprint';
import { config } from 'dotenv';

// Загружаем переменные окружения
config();

export async function run(provider: NetworkProvider) {
    const ui = provider.ui();

    // Запрашиваем адрес получателя
    const recipientAddress = await ui.input('Recipient address to check:');

    try {
        // Получаем состояние адреса
        const state = await provider.provider(Address.parse(recipientAddress)).getState();
        const balance = state.balance;

        ui.write(`💰 Recipient Balance Check:`);
        ui.write(`   Address: ${recipientAddress}`);
        ui.write(`   Balance: ${(Number(balance) / 1000000000).toFixed(9)} TON`);
        ui.write(`   State: ${state.state.type}`);

        if (state.state.type === 'active') {
            ui.write(`✅ Recipient account is active and has funds!`);
        } else {
            ui.write(`⚠️  Recipient account state: ${state.state.type}`);
        }

    } catch (error) {
        ui.write(`❌ Error checking recipient: ${error instanceof Error ? error.message : String(error)}`);
    }
}