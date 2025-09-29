// scripts/detailedCheck.ts
import { NetworkProvider } from '@ton/blueprint';
import { Address, fromNano } from '@ton/core';
import { Mixton } from '../wrappers/Mixton';

export async function run(provider: NetworkProvider, args: string[]) {
    if (args.length < 1) {
        console.log('Please provide recipient address');
        console.log('Usage: npx blueprint run detailedCheck <address>');
        return;
    }

    const recipientAddress = Address.parse(args[0]);
    
    // Используем правильный адрес контракта Mixton
    const mixtonAddress = Address.parse('EQAqbL21RAUjCiaR3nGgISJsExldwTMmyQJwEXtoM2aElJEC');
    const mixton = provider.open(Mixton.createFromAddress(mixtonAddress));
    
    console.log('=== Detailed Mixton Check ===');
    console.log(`Recipient: ${recipientAddress.toString()}`);
    console.log(`Contract: ${mixton.address.toString()}`);
    console.log(`Current Time: ${new Date().toLocaleString()}`);
    
    try {
        // Получаем балансы с использованием правильного метода
        const recipientState = await provider.getContractState(recipientAddress);
        const contractState = await provider.getContractState(mixton.address);
        
        console.log('\n=== Balances ===');
        console.log(`Recipient Balance: ${fromNano(recipientState.balance)} TON`);
        console.log(`Contract Balance: ${fromNano(contractState.balance)} TON`);
        
        // Получаем статистику
        const stats = await mixton.getBasicStats();
        console.log('\n=== Statistics ===');
        console.log(`Total Deposits: ${stats.totalDeposits}`);
        console.log(`Total Withdrawn: ${fromNano(stats.totalWithdrawn)} TON`); // fromNano теперь принимает bigint
        
        // Получаем информацию об очереди
        const queueDetails = await mixton.getQueueDetails();
        console.log('\n=== Queue ===');
        console.log(`Queue Length: ${queueDetails.queueLength}`);
        console.log(`Queue Amount: ${fromNano(queueDetails.totalAmount)} TON`);
        console.log(`Next Processing: ${queueDetails.nextTime > 0 ? new Date(queueDetails.nextTime * 1000).toLocaleString() : 'N/A'}`);
        
        // Получаем статус очереди
        const queueStatus = await mixton.getQueueStatus();
        console.log(`Queue Status: ${queueStatus} (0=Empty, 1=Waiting, 2=Ready)`);
        
        // Получаем параметры миксера
        const params = await mixton.getMixerParams();
        console.log('\n=== Mixer Parameters ===');
        console.log(`Min Fee Rate: ${params.minFeeRate / 100}%`);
        console.log(`Max Fee Rate: ${params.maxFeeRate / 100}%`);
        console.log(`Min Delay: ${params.minDelay} seconds`);
        console.log(`Max Delay: ${params.maxDelay} seconds`);
        
        // Анализ результатов
        console.log('\n=== Analysis ===');
        
        if (stats.totalWithdrawn > 0n) { // Сравнение с 0n (bigint)
            console.log('✅ Withdrawals detected!');
            console.log(`💰 Total withdrawn: ${fromNano(stats.totalWithdrawn)} TON`);
            
            // Рассчитываем ожидаемый баланс получателя (примерно)
            const averageFeeRate = (params.minFeeRate + params.maxFeeRate) / 2;
            const feeRateBigInt = BigInt(Math.floor(averageFeeRate)); // Преобразуем в BigInt
            const expectedNetAmount = (stats.totalWithdrawn * (10000n - feeRateBigInt)) / 10000n;
            console.log(`📊 Expected recipient balance (approx): ${fromNano(expectedNetAmount)} TON`);
        } else {
            console.log('❌ No withdrawals detected yet');
        }
        
        if (queueDetails.queueLength > 0) {
            console.log(`⏳ ${queueDetails.queueLength} withdrawals pending in queue`);
            console.log(`💵 Total pending amount: ${fromNano(queueDetails.totalAmount)} TON`);
            
            if (queueDetails.nextTime > 0) {
                const nextTime = new Date(queueDetails.nextTime * 1000);
                const now = new Date();
                const timeUntil = Math.floor((nextTime.getTime() - now.getTime()) / 1000);
                
                if (timeUntil > 0) {
                    const hours = Math.floor(timeUntil / 3600);
                    const minutes = Math.floor((timeUntil % 3600) / 60);
                    const seconds = timeUntil % 60;
                    console.log(`⏰ Next processing in: ${hours}h ${minutes}m ${seconds}s`);
                } else {
                    console.log('🟢 Ready for processing!');
                }
            }
        } else {
            console.log('✅ Queue is empty');
        }
        
        // Проверяем баланс администратора
        const adminState = await provider.getContractState(provider.sender().address!);
        console.log('\n=== Admin Balance ===');
        console.log(`Admin Balance: ${fromNano(adminState.balance)} TON`);
        
        console.log('\n=== Summary ===');
        console.log(`Contract Balance: ${fromNano(contractState.balance)} TON`);
        console.log(`Recipient Balance: ${fromNano(recipientState.balance)} TON`);
        console.log(`Admin Balance: ${fromNano(adminState.balance)} TON`);
        console.log(`Total Withdrawn: ${fromNano(stats.totalWithdrawn)} TON`);
        
        // Дополнительная информация
        console.log('\n=== Additional Info ===');
        console.log(`Contract Address: ${mixton.address.toString()}`);
        console.log(`Recipient Address: ${recipientAddress.toString()}`);
        console.log(`Admin Address: ${provider.sender().address!.toString()}`);
        
    } catch (error) {
        console.error(`Error during detailed check: ${error instanceof Error ? error.message : String(error)}`);
        
        // Пробуем выполнить базовую проверку при ошибке
        console.log('\n=== Attempting Basic Check ===');
        try {
            const stats = await mixton.getBasicStats();
            console.log(`Basic Stats - Total Withdrawn: ${fromNano(stats.totalWithdrawn)} TON`);
            console.log(`Basic Stats - Total Deposits: ${stats.totalDeposits}`);
        } catch (basicError) {
            console.error(`Basic check also failed: ${basicError instanceof Error ? basicError.message : String(basicError)}`);
        }
    }
}