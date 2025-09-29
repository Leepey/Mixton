// scripts/checkQueueDetails.ts
import { Mixton, QueueDetails } from '../wrappers/Mixton';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const mixton = provider.open(Mixton.createFromAddress(provider.sender().address!));
    
    console.log("=== Queue Details ===");
    const queueDetails: QueueDetails = await mixton.getQueueDetails();
    console.log(`Length: ${queueDetails.queueLength}`);
    console.log(`Total Amount: ${Number(queueDetails.totalAmount) / 1000000000} TON`);
    console.log(`Next Time: ${queueDetails.nextTime > 0 ? new Date(queueDetails.nextTime * 1000).toLocaleString() : 'N/A'}`);
    
    console.log("\n=== Queue Status ===");
    const queueStatus = await mixton.getQueueStatus();
    console.log(`Status: ${queueStatus.status} (0=Empty, 1=Waiting, 2=Ready)`);
    
    console.log("\n=== Min Next Time ===");
    const minNextTime = await mixton.getMinNextTime();
    console.log(`Min Next Time: ${minNextTime > 0 ? new Date(minNextTime * 1000).toLocaleString() : 'N/A'}`);
    
    console.log("\n=== Current Time ===");
    console.log(`Current Time: ${new Date().toLocaleString()}`);
    
    if (queueDetails.nextTime > 0) {
        const currentTime = Math.floor(Date.now() / 1000);
        const timeUntilProcessing = queueDetails.nextTime - currentTime;
        
        if (timeUntilProcessing > 0) {
            const hours = Math.floor(timeUntilProcessing / 3600);
            const minutes = Math.floor((timeUntilProcessing % 3600) / 60);
            const seconds = timeUntilProcessing % 60;
            
            console.log(`\n=== Time Until Processing ===`);
            console.log(`${hours}h ${minutes}m ${seconds}s`);
        } else {
            console.log(`\n=== Ready for Processing! ===`);
        }
    }
}