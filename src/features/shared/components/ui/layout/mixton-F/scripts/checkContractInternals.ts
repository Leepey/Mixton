// scripts/checkContractInternals.ts
import { Mixton } from '../wrappers/Mixton';
import { toNano, Address } from '@ton/core';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const ui = provider.ui();

    const mixton = provider.open(
        Mixton.createFromAddress(
            Address.parse('EQDWwgurseY38CKqLIYt6ZbkOR8BAkkP4jmS6r6iB22rf3xK')
        )
    );

    ui.write(`🔍 Checking Contract Internals for: ${mixton.address.toString()}`);

    // Проверяем все депозиты
    ui.write(`\n=== All Deposits ===`);
    for (let i = 0; i <= 5; i++) {
        try {
            const depositInfo = await mixton.getDepositInfo(BigInt(i));
            if (depositInfo.depositTime !== -1) {
                const statusText = depositInfo.status === 0 ? 'Pending' : 
                                  depositInfo.status === 1 ? 'Processed' : 'Unknown';
                ui.write(`Deposit #${i}: ${statusText}, Time: ${new Date(depositInfo.depositTime * 1000).toISOString()}`);
            }
        } catch (error) {
            ui.write(`Deposit #${i}: Error - ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    // Проверяем все get-методы
    ui.write(`\n=== All Get Methods ===`);
    
    try {
        const admin = await mixton.getAdmin();
        ui.write(`Admin: ${admin.toString()}`);
    } catch (error) {
        ui.write(`Admin: Error - ${error instanceof Error ? error.message : String(error)}`);
    }

    try {
        const limits = await mixton.getLimits();
        ui.write(`Limits: ${limits.minDeposit / 1000000000} - ${limits.maxDeposit / 1000000000} TON`);
    } catch (error) {
        ui.write(`Limits: Error - ${error instanceof Error ? error.message : String(error)}`);
    }

    try {
        const feeRate = await mixton.getCurrentFeeRate();
        ui.write(`Current Fee Rate: ${feeRate / 100}%`);
    } catch (error) {
        ui.write(`Current Fee Rate: Error - ${error instanceof Error ? error.message : String(error)}`);
    }

    try {
        const params = await mixton.getMixerParams();
        ui.write(`Mixer Params: Fee ${params[0]}-${params[1]}%, Delay ${params[2]}-${params[3]}s`);
    } catch (error) {
        ui.write(`Mixer Params: Error - ${error instanceof Error ? error.message : String(error)}`);
    }

    try {
        const signers = await mixton.getSigners();
        ui.write(`Signers: ${signers.count} (required: ${signers.required})`);
    } catch (error) {
        ui.write(`Signers: Error - ${error instanceof Error ? error.message : String(error)}`);
    }

    try {
        const oracle = await mixton.getOracleData();
        ui.write(`Oracle: ${oracle.data}, Updated: ${new Date(oracle.lastUpdate * 1000).toISOString()}`);
    } catch (error) {
        ui.write(`Oracle: Error - ${error instanceof Error ? error.message : String(error)}`);
    }

    try {
        const performance = await mixton.getPerformanceStats();
        ui.write(`Performance: Last Processed ${new Date(performance[0] * 1000).toISOString()}, Failed: ${performance[1]}`);
    } catch (error) {
        ui.write(`Performance: Error - ${error instanceof Error ? error.message : String(error)}`);
    }

    // Проверяем очередь
    ui.write(`\n=== Queue Details ===`);
    try {
        const queueDetails = await mixton.getQueueDetails();
        ui.write(`Queue Length: ${queueDetails[0]}`);
        ui.write(`Queue Amount: ${queueDetails[1]} TON`);
        ui.write(`Next Time: ${queueDetails[2] === -1 ? 'N/A' : new Date(queueDetails[2] * 1000).toISOString()}`);
    } catch (error) {
        ui.write(`Queue Details: Error - ${error instanceof Error ? error.message : String(error)}`);
    }

    // Проверяем статус очереди
    try {
        const queueStatus = await mixton.getQueueStatus();
        const statusText = queueStatus === 0 ? 'Empty' : 
                           queueStatus === 1 ? 'Waiting' : 
                           queueStatus === 2 ? 'Ready' : 'Unknown';
        ui.write(`Queue Status: ${statusText}`);
    } catch (error) {
        ui.write(`Queue Status: Error - ${error instanceof Error ? error.message : String(error)}`);
    }
}