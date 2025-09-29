// scripts/checkTime.ts
import { Mixton } from '../wrappers/Mixton';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const mixton = provider.open(Mixton.createFromAddress(provider.sender().address!));
    
    const queueDetails = await mixton.getQueueDetails();
    console.log(`Queue length: ${queueDetails.queueLength}`);
    
    if (queueDetails.nextTime > 0) {
        console.log(`Next processing time: ${new Date(queueDetails.nextTime * 1000).toLocaleString()}`);
        
        const currentTime = Math.floor(Date.now() / 1000);
        const timeUntilProcessing = queueDetails.nextTime - currentTime;
        
        if (timeUntilProcessing > 0) {
            const hours = Math.floor(timeUntilProcessing / 3600);
            const minutes = Math.floor((timeUntilProcessing % 3600) / 60);
            const seconds = timeUntilProcessing % 60;
            
            console.log(`Time until next processing: ${hours}h ${minutes}m ${seconds}s`);
        } else {
            console.log(`Processing time has passed!`);
        }
    } else {
        console.log(`No pending withdrawals in queue`);
    }
    
    console.log(`Current time: ${new Date().toLocaleString()}`);
}