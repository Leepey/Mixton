import { Mixton } from '../wrappers/Mixton';
import { toNano, Address } from '@ton/core';
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

    ui.write(`🔄 Monitoring Mixton Queue`);
    ui.write(`📍 Contract address: ${contractAddress}`);

    try {
        // Получаем текущее состояние очереди
        const queueInfo = await mixton.getQueueInfo();
        const queueStatus = await mixton.getQueueStatus();
        const minNextTime = await mixton.getMinNextTime();

        ui.write(`\n📊 Current Queue Status:`);
        ui.write(`   Queue Length: ${queueInfo.queueLength}`);
        ui.write(`   Total Amount: ${(Number(queueInfo.totalAmount) / 1000000000).toFixed(9)} TON`);
        ui.write(`   Status: ${queueStatus} (0=empty, 1=waiting, 2=ready)`);

        if (queueInfo.queueLength === 0) {
            ui.write(`✅ Queue is empty. Nothing to process.`);
            return;
        }

        if (minNextTime > 0) {
            const nextTime = new Date(minNextTime * 1000);
            const currentTime = new Date();
            const timeUntilNext = Math.max(0, Math.floor((nextTime.getTime() - currentTime.getTime()) / 1000));
            
            ui.write(`\n⏰ Next Processing Time: ${nextTime.toLocaleString()}`);
            ui.write(`   Time until next: ${timeUntilNext} seconds`);
            
            if (timeUntilNext <= 0) {
                ui.write(`\n🎯 Time to process! Queue is ready.`);
                
                // Получаем ID следующего элемента для обработки
                const nextQueueItemId = await mixton.getNextQueueItemId();
                
                if (nextQueueItemId >= BigInt(0)) {
                    ui.write(`   Processing queue item ID: ${nextQueueItemId}`);
                    
                    await mixton.sendProcessQueue(
                        provider.sender(),
                        nextQueueItemId,
                        toNano('0.15')
                    );

                    ui.write(`✅ Queue processing started!`);

                    // Ждем обработки и показываем результат
                    await new Promise(resolve => setTimeout(resolve, 10000));

                    // Показываем обновленное состояние
                    const newQueueInfo = await mixton.getQueueInfo();
                    const newQueueStatus = await mixton.getQueueStatus();
                    const basicStats = await mixton.getBasicStats();

                    ui.write(`\n📊 Updated Queue Status:`);
                    ui.write(`   Queue Length: ${newQueueInfo.queueLength}`);
                    ui.write(`   Total Amount: ${(Number(newQueueInfo.totalAmount) / 1000000000).toFixed(9)} TON`);
                    ui.write(`   Status: ${newQueueStatus}`);
                    ui.write(`   Total Withdrawn: ${(Number(basicStats.totalWithdrawn) / 1000000000).toFixed(9)} TON`);
                    ui.write(`   Items Processed: ${queueInfo.queueLength - newQueueInfo.queueLength}`);
                } else {
                    ui.write(`⚠️  No items ready for processing.`);
                }
            } else {
                ui.write(`\n⏳ Queue is not ready yet. Please wait ${timeUntilNext} seconds.`);
                
                // Предлагаем подождать и проверить снова
                const choices = [
                    { name: 'Yes, wait and check again' },
                    { name: 'No, exit' }
                ];
                
                const shouldWait = await ui.choose('Wait and check again?', choices, (choice) => choice.name);
                
                if (shouldWait.name === 'Yes, wait and check again') {
                    ui.write(`⏳ Waiting for ${Math.min(timeUntilNext, 60)} seconds...`);
                    await new Promise(resolve => setTimeout(resolve, Math.min(timeUntilNext, 60) * 1000));
                    
                    // Рекурсивно вызываем снова
                    await run(provider);
                }
            }
        } else {
            ui.write(`\n❓ No next processing time found.`);
        }

    } catch (error) {
        ui.write(`❌ Error monitoring queue: ${error instanceof Error ? error.message : String(error)}`);
    }
}