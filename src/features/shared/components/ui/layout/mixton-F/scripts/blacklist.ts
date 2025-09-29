// scripts/basicCheck.ts
import { NetworkProvider } from '@ton/blueprint';
import { Address } from '@ton/core';
import { Mixton } from '../wrappers/Mixton';
import { fromNano } from '@ton/core';

export async function run(provider: NetworkProvider, args: string[]) {
    if (args.length < 1) {
        console.log('Please provide recipient address');
        return;
    }

    const recipientAddress = Address.parse(args[0]);
    const mixton = provider.open(Mixton.createFromAddress(provider.sender().address!));
    
    console.log('=== Basic Mixton Check ===');
    
    try {
        // Получаем состояние контракта
        const contractState = await provider.getContractState(mixton.address);
        console.log(`Contract Balance: ${fromNano(contractState.balance)} TON`);
        
        // Получаем статистику
        const stats = await mixton.getBasicStats();
        console.log(`Total Withdrawn: ${fromNano(stats.totalWithdrawn)} TON`);
        
        // Получаем информацию об очереди
        const queueDetails = await mixton.getQueueDetails();
        console.log(`Queue Items: ${queueDetails.queueLength}`);
        
        console.log(`\n=== Conclusion ===`);
        if (stats.totalWithdrawn > 0n) {
            console.log('✅ Withdrawals were processed!');
        } else {
            console.log('❌ No withdrawals processed yet');
        }
        
        if (queueDetails.queueLength === 0) {
            console.log('✅ Queue is empty');
        } else {
            console.log('⏳ Queue has pending items');
        }
        
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}