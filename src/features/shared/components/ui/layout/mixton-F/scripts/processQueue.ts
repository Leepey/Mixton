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

    ui.write(`🔄 Processing withdrawal queue...`);

    try {
        // Получаем текущее состояние очереди
        const queueInfo = await mixton.getQueueInfo();
        const queueStatus = await mixton.getQueueStatus();
        const minNextTime = await mixton.getMinNextTime();

        ui.write(`📊 Current queue status:`);
        ui.write(`   Queue length: ${queueInfo.queueLength}`);
        ui.write(`   Total amount in queue: ${queueInfo.totalAmount.toString()} nanoTON`);
        ui.write(`   Queue status: ${queueStatus} (0=empty, 1=waiting, 2=ready)`);
        ui.write(`   Next processing time: ${minNextTime > 0 ? new Date(minNextTime * 1000).toLocaleString() : 'N/A'}`);

        if (queueInfo.queueLength === 0) {
            ui.write(`✅ Queue is empty. Nothing to process.`);
            return;
        }

        // Получаем ID следующего элемента для обработки
        const nextQueueItemId = await mixton.getNextQueueItemId();
        
        if (nextQueueItemId >= BigInt(0)) {
            ui.write(`🎯 Processing queue item ID: ${nextQueueItemId}`);
            
            await mixton.sendProcessQueue(
                provider.sender(),
                nextQueueItemId,
                toNano('0.15') // комиссия за транзакцию
            );

            ui.write(`✅ Queue processing started!`);

            // Ждем обработки и показываем результат
            await new Promise(resolve => setTimeout(resolve, 10000));

            // Показываем обновленное состояние
            const newQueueInfo = await mixton.getQueueInfo();
            const newQueueStatus = await mixton.getQueueStatus();
            const basicStats = await mixton.getBasicStats();

            ui.write(`📊 Updated queue status:`);
            ui.write(`   Queue length: ${newQueueInfo.queueLength}`);
            ui.write(`   Total amount in queue: ${newQueueInfo.totalAmount.toString()} nanoTON`);
            ui.write(`   Queue status: ${newQueueStatus}`);
            ui.write(`   Total withdrawn: ${basicStats.totalWithdrawn.toString()} nanoTON`);
            ui.write(`   Items processed: ${queueInfo.queueLength - newQueueInfo.queueLength}`);

        } else {
            ui.write(`⏰ No items ready for processing at the moment.`);
            ui.write(`   Next processing time: ${minNextTime > 0 ? new Date(minNextTime * 1000).toLocaleString() : 'N/A'}`);
        }

    } catch (error) {
        ui.write(`❌ Error processing queue: ${error instanceof Error ? error.message : String(error)}`);
    }
}