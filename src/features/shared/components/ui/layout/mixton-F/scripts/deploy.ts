// scripts/deploy.ts
import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Mixton } from '../wrappers/Mixton';
import { toNano, Address, beginCell } from '@ton/core';
import { NetworkProvider } from '@ton/blueprint';
import { compile } from '@ton/blueprint';

// Вспомогательная функция для форматирования суммы
function formatAmount(amount: bigint): string {
    return (Number(amount) / 1000000000).toFixed(9);
}

export async function run(provider: NetworkProvider) {
    const ui = provider.ui();

    const code = await compile('Mixton');
    const mixton = provider.open(
        Mixton.createFromConfig(
            {
                admin: provider.sender().address!,
            },
            code
        )
    );

    // Получаем баланс отправителя
    const senderState = await provider.provider(provider.sender().address!).getState();
    const senderBalance = senderState.balance;

    ui.write(`🚀 Deploying Mixton contract at address: ${mixton.address.toString()}`);
    ui.write(`💰 Sender address: ${provider.sender().address!.toString()}`);
    ui.write(`💰 Sender balance: ${formatAmount(senderBalance)} TON`);

    // Увеличиваем сумму для развертывания
    const deployAmount = toNano('3'); // Увеличиваем сумму для развертывания
    ui.write(`💸 Sending deployment transaction with ${formatAmount(deployAmount)} TON...`);
    
    try {
        // Используем метод sendInternal вместо sendDeploy для лучшей инициализации
        await mixton.sendInternal(provider.sender(), {
            value: deployAmount,
            body: beginCell().endCell(),
            bounce: false
        });
        
        // Ждем обработки транзакции
        ui.write(`⏳ Waiting for deployment transaction to be processed...`);
        await new Promise(resolve => setTimeout(resolve, 20000)); // Ждем 20 секунд
        
        // Проверяем состояние контракта после развертывания
        const contractState = await provider.provider(mixton.address).getState();
        const contractBalance = contractState.balance;
        
        ui.write(`🔍 Debug info:`);
        ui.write(`Contract balance: ${formatAmount(contractBalance)} TON`);
        ui.write(`Contract state: ${contractState.state.type}`);
        
        // Правильная проверка состояния контракта
        const isActive = contractState.state.type === 'active';
        const hasBalance = contractBalance > 0n;
        
        if (isActive && hasBalance) {
            ui.write(`✅ Deployment successful!`);
            
            // Проверяем, установлен ли администратор
            try {
                const admin = await mixton.getAdmin();
                ui.write(`👤 Admin address: ${admin.toString()}`);
                
                if (admin.toString() === provider.sender().address!.toString()) {
                    ui.write(`✅ Admin set correctly!`);
                } else {
                    ui.write(`⚠️  Admin mismatch! Expected: ${provider.sender().address!.toString()}`);
                    ui.write(`🔧 Trying to fix admin setting...`);
                    
                    // Отправляем еще одно сообщение для корректной установки администратора
                    await mixton.sendInternal(provider.sender(), {
                        value: toNano('0.5'),
                        body: beginCell().endCell(),
                        bounce: false
                    });
                    
                    // Ждем и проверяем снова
                    await new Promise(resolve => setTimeout(resolve, 10000));
                    
                    try {
                        const adminAfter = await mixton.getAdmin();
                        ui.write(`👤 Admin address after fix: ${adminAfter.toString()}`);
                        
                        if (adminAfter.toString() === provider.sender().address!.toString()) {
                            ui.write(`✅ Admin fixed successfully!`);
                        } else {
                            ui.write(`⚠️  Admin still not set correctly`);
                        }
                    } catch (adminError) {
                        ui.write(`⚠️  Could not get admin address after fix: ${adminError instanceof Error ? adminError.message : String(adminError)}`);
                    }
                }
            } catch (error) {
                ui.write(`⚠️  Could not get admin address: ${error instanceof Error ? error.message : String(error)}`);
                ui.write(`🔧 Sending additional initialization message...`);
                
                // Отправляем сообщение для инициализации администратора
                await mixton.sendInternal(provider.sender(), {
                    value: toNano('0.5'),
                    body: beginCell().endCell(),
                    bounce: false
                });
                
                ui.write(`✅ Initialization message sent!`);
                
                // Ждем и проверяем снова
                await new Promise(resolve => setTimeout(resolve, 10000));
                
                try {
                    const adminAfter = await mixton.getAdmin();
                    ui.write(`👤 Admin address after initialization: ${adminAfter.toString()}`);
                } catch (initError) {
                    ui.write(`⚠️  Still could not get admin address: ${initError instanceof Error ? initError.message : String(initError)}`);
                }
            }
            
            // Делаем тестовый депозит для проверки работы контракта
            ui.write(`\n💰 Making test deposit to verify contract functionality...`);
            try {
                await mixton.sendDeposit(provider.sender(), toNano('1'));
                ui.write(`✅ Test deposit sent successfully!`);
                
                // Ждем и проверяем состояние
                await new Promise(resolve => setTimeout(resolve, 5000));
                
                const basicStats = await mixton.getBasicStats();
                ui.write(`📊 Contract stats after test deposit:`);
                ui.write(`   Total Deposits: ${basicStats.totalDeposits}`);
                ui.write(`   Total Withdrawn: ${formatAmount(basicStats.totalWithdrawn)} TON`);
                
            } catch (error) {
                ui.write(`❌ Test deposit failed: ${error instanceof Error ? error.message : String(error)}`);
            }
            
        } else {
            ui.write(`❌ Deployment failed! Contract is in uninitialized state`);
            
            const senderStateAfter = await provider.provider(provider.sender().address!).getState();
            const senderBalanceAfter = senderStateAfter.balance;
            const balanceDiff = senderBalanceAfter - contractBalance;
            
            ui.write(`Sender balance after deployment attempt: ${formatAmount(senderBalanceAfter)} TON`);
            ui.write(`Balance difference: ${formatAmount(balanceDiff)} TON`);
            
            ui.write(`\n💡 Tips:`);
            ui.write(`1. Check if the transaction was actually sent to the network`);
            ui.write(`2. Verify that you have enough TON for gas fees`);
            ui.write(`3. Try deploying with a higher amount (e.g., 5 TON)`);
            ui.write(`4. Check the contract code for any initialization errors`);
            ui.write(`5. Make sure you're using the correct network (testnet/mainnet)`);
            ui.write(`6. Try to manually initialize the contract with a deposit`);
        }
    } catch (error) {
        ui.write(`❌ Error during deployment: ${error instanceof Error ? error.message : String(error)}`);
        
        // Если развертывание не удалось, пробуем альтернативный метод
        ui.write(`\n🔄 Trying alternative deployment method...`);
        
        try {
            // Отправляем сообщение напрямую для инициализации с большей суммой
            await mixton.sendInternal(provider.sender(), {
                value: toNano('5'),
                body: beginCell().endCell(),
                bounce: false
            });
            
            ui.write(`✅ Alternative initialization sent!`);
            
            // Ждем обработки
            await new Promise(resolve => setTimeout(resolve, 20000));
            
            // Проверяем состояние
            const contractState = await provider.provider(mixton.address).getState();
            const isActive = contractState.state.type === 'active';
            
            if (isActive) {
                ui.write(`✅ Contract successfully initialized with alternative method!`);
                
                try {
                    const admin = await mixton.getAdmin();
                    ui.write(`👤 Admin address: ${admin.toString()}`);
                    
                    if (admin.toString() === provider.sender().address!.toString()) {
                        ui.write(`✅ Admin set correctly!`);
                    } else {
                        ui.write(`⚠️  Admin not set correctly, trying to fix...`);
                        
                        // Отправляем еще одно сообщение для установки администратора
                        await mixton.sendInternal(provider.sender(), {
                            value: toNano('0.5'),
                            body: beginCell().endCell(),
                            bounce: false
                        });
                        
                        await new Promise(resolve => setTimeout(resolve, 10000));
                        
                        try {
                            const adminAfter = await mixton.getAdmin();
                            ui.write(`👤 Admin address after fix: ${adminAfter.toString()}`);
                        } catch (adminError) {
                            ui.write(`⚠️  Could not get admin address: ${adminError instanceof Error ? adminError.message : String(adminError)}`);
                        }
                    }
                } catch (adminError) {
                    ui.write(`⚠️  Could not get admin address: ${adminError instanceof Error ? adminError.message : String(adminError)}`);
                }
            } else {
                ui.write(`❌ Alternative method also failed`);
            }
        } catch (altError) {
            ui.write(`❌ Alternative method failed: ${altError instanceof Error ? altError.message : String(altError)}`);
        }
    }
}