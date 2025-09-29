// scripts/deployMixton.ts
import { toNano, Address, Cell } from '@ton/core';
import { Mixton } from '../wrappers/Mixton';
import { compile, NetworkProvider } from '@ton/blueprint';
import * as fs from 'fs';
import * as path from 'path';

export async function run(provider: NetworkProvider) {
    console.log('🚀 Starting Mixton contract deployment script...');

    // Blueprint автоматически настраивает provider.sender() на основе .env файла
    const sender = provider.sender();
    if (!sender || !sender.address) {
        throw new Error('❌ Sender not configured. Please ensure your wallet is set up in the .env file (WALLET_MNEMONIC and WALLET_VERSION).');
    }
    const senderAddress = sender.address;
    console.log(`👤 Deploying from wallet: ${senderAddress.toString()}`);

    // Компилируем контракт
    console.log('\n🔨 Compiling Mixton contract...');
    let code: Cell;
    try {
        code = await compile('Mixton');
        console.log('✅ Contract compiled successfully');
    } catch (error) {
        console.error('❌ Error compiling contract:', error);
        throw error;
    }

    // Создаем конфигурацию контракта с адресом администратора
    const mixton = provider.open(
        Mixton.createFromConfig(
            {
                admin: senderAddress,
            },
            code
        )
    );

    console.log(`📍 Target contract address: ${mixton.address.toString()}`);

    // Получаем провайдер для проверки состояния контракта
    const contractProvider = provider.provider(mixton.address);

    // Проверяем состояние контракта до деплоя
    try {
        const contractState = await contractProvider.getState();
        if (contractState.state.type === 'active') {
            console.log('ℹ️  Contract is already deployed and active.');
            // Можно добавить логику для обновления или повторного использования
        } else {
            console.log(`Contract state before deployment: ${contractState.state.type}`);
        }
    } catch (error) {
        // Ожидаемо, если контракт еще не задеплоен
        console.log('ℹ️  Contract not found on-chain, proceeding with deployment.');
    }

    // Проверяем баланс отправителя
    console.log('\n💰 Checking sender balance...');
    try {
        const senderProvider = provider.provider(senderAddress);
        const senderState = await senderProvider.getState();
        const senderBalance = senderState.balance;
        console.log(`Sender balance: ${Mixton.formatAmount(senderBalance)} TON`);

        const deployCost = toNano('0.5'); // Стоимость деплоя + начальный баланс
        if (senderBalance < deployCost) {
            throw new Error(`❌ Insufficient balance for deployment. Required: at least ${Mixton.formatAmount(deployCost)} TON, Available: ${Mixton.formatAmount(senderBalance)} TON`);
        }
        console.log('✅ Sender balance is sufficient for deployment.');
    } catch (error) {
        console.error('❌ Error checking sender balance:', error);
        throw new Error('Failed to check sender balance. Ensure the wallet is funded and the network is accessible.');
    }

    // Отправляем транзакцию деплоя, если контракт еще не активен
    if ((await contractProvider.getState()).state.type !== 'active') {
        console.log('\n📤 Sending deployment transaction...');
        try {
            const deployResult = await mixton.sendDeploy(sender, toNano('0.5'));
            console.log('✅ Deployment transaction sent successfully');
        } catch (error) {
            console.error('❌ Error sending deployment transaction:', error);
            throw error;
        }

        // Ожидаем завершения деплоя
        console.log('⏳ Waiting for deployment to complete (this may take a minute)...');
        try {
            await provider.waitForDeploy(mixton.address, 30); // Таймаут 30 секунд
            console.log('✅ Mixton contract deployed successfully!');
        } catch (error) {
            console.error('❌ Error waiting for deployment confirmation:', error);
            throw error;
        }
    } else {
        console.log('⏭️  Contract is already active. Skipping deployment transaction.');
    }

    // Получаем и выводим информацию о контракте
    console.log('\n📊 Retrieving contract information...');
    try {
        const contractAdmin = await mixton.getAdmin();
        console.log(`Admin address: ${contractAdmin.toString()}`);
        console.log(`Expected admin: ${senderAddress.toString()}`);
        if (contractAdmin.toString() !== senderAddress.toString()) {
            console.warn('⚠️  Warning: Admin address does not match the sender address!');
        } else {
            console.log('✅ Admin address matches sender address.');
        }

        const params = await mixton.getMixerParams();
        console.log('\n⚙️ Mixer Parameters:');
        console.log(`  Min fee rate: ${(params.minFeeRate / 100).toFixed(2)}%`);
        console.log(`  Max fee rate: ${(params.maxFeeRate / 100).toFixed(2)}%`);
        console.log(`  Min delay: ${params.minDelay} seconds (${Mixton.formatDelay(params.minDelay)})`);
        console.log(`  Max delay: ${params.maxDelay} seconds (${Mixton.formatDelay(params.maxDelay)})`);

        const limits = await mixton.getLimits();
        console.log('\n📋 Contract Limits:');
        console.log(`  Min deposit: ${Mixton.formatAmount(limits.minDeposit)} TON`);
        console.log(`  Max deposit: ${Mixton.formatAmount(limits.maxDeposit)} TON`);
        console.log(`  Min withdraw: ${Mixton.formatAmount(limits.minWithdraw)} TON`);

        const stats = await mixton.getBasicStats();
        console.log('\n📈 Initial Statistics:');
        console.log(`  Total deposits: ${stats.totalDeposits}`);
        console.log(`  Total withdrawn: ${Mixton.formatAmount(stats.totalWithdrawn)} TON`);

        const health = await mixton.healthCheck(contractProvider);
        console.log('\n🏥 Health Check:');
        console.log(`Status: ${health.healthy ? '✅ HEALTHY' : '❌ UNHEALTHY'}`);
        if (health.issues.length > 0) {
            console.log(`Issues: ${health.issues.join(', ')}`);
        }

        const queueStatusNumber = await mixton.getQueueStatus();
        console.log('\n⏳ Queue Status:');
        let statusText = 'Unknown';
        if (queueStatusNumber === 0) statusText = 'Empty';
        else if (queueStatusNumber === 1) statusText = 'Waiting';
        else if (queueStatusNumber === 2) statusText = 'Ready';
        console.log(`Status: ${statusText}`);

        const contractStateAfterDeploy = await contractProvider.getState();
        console.log(`\n💰 Contract Balance: ${Mixton.formatAmount(contractStateAfterDeploy.balance)} TON`);

        console.log('\n✅ Deployment process completed successfully!');

        const explorerLink = provider.network() === 'testnet'
            ? `https://testnet.tonscan.org/address/${mixton.address.toString()}`
            : `https://tonscan.org/address/${mixton.address.toString()}`;
        console.log(`🔗 Contract Explorer Link: ${explorerLink}`);

        // Сохранение адреса контракта в .env файл
        console.log('\n💾 Saving contract address to .env file...');
        const envPath = path.resolve(__dirname, '..', '.env');
        let envContent = '';

        if (fs.existsSync(envPath)) {
            envContent = fs.readFileSync(envPath, 'utf8');
        } else {
            console.log('.env file not found. Creating a new one.');
        }

        const contractAddressLine = `CONTRACT_ADDRESS=${mixton.address.toString()}`;
        const contractAddressRegex = /^CONTRACT_ADDRESS=.*$/m;

        if (contractAddressRegex.test(envContent)) {
            envContent = envContent.replace(contractAddressRegex, contractAddressLine);
        } else {
            if (envContent.length > 0 && !envContent.endsWith('\n')) {
                envContent += '\n';
            }
            envContent += `${contractAddressLine}\n`;
        }

        fs.writeFileSync(envPath, envContent);
        console.log('✅ Contract address saved to .env file');

    } catch (error) {
        console.error('❌ Error reading contract information after deployment:', error);
        throw error;
    }
}