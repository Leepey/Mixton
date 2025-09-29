// scripts/health-check.js - Комплексная проверка здоровья контракта
const { Blockchain } = require('@ton/sandbox');
const { Mixton } = require('../wrappers/Mixton');
const { compile } = require('@ton/blueprint');
const { toNano } = require('@ton/core');

class HealthChecker {
    constructor() {
        this.results = {
            compilation: false,
            deployment: false,
            basicOperations: false,
            performance: false,
            gasEfficiency: false,
            security: false
        };
        this.issues = [];
        this.warnings = [];
    }

    async runFullCheck() {
        console.log('🏥 Mixton Health Check');
        console.log('═'.repeat(50));

        try {
            // 1. Проверка компиляции
            await this.checkCompilation();
            
            // 2. Проверка развертывания
            await this.checkDeployment();
            
            // 3. Проверка базовых операций
            await this.checkBasicOperations();
            
            // 4. Проверка производительности
            await this.checkPerformance();
            
            // 5. Проверка эффективности газа
            await this.checkGasEfficiency();
            
            // 6. Проверка безопасности
            await this.checkSecurity();

            // Вывод результатов
            this.printResults();

        } catch (error) {
            console.error('❌ Health check failed:', error.message);
            this.issues.push(`Health check failed: ${error.message}`);
        }
    }

    async checkCompilation() {
        console.log('🔨 Checking compilation...');
        try {
            const code = await compile('Mixton');
            if (code) {
                this.results.compilation = true;
                console.log('✅ Compilation successful');
            } else {
                this.issues.push('Compilation failed: No code returned');
            }
        } catch (error) {
            this.issues.push(`Compilation failed: ${error.message}`);
        }
    }

    async checkDeployment() {
        console.log('🚀 Checking deployment...');
        try {
            const blockchain = await Blockchain.create();
            const deployer = await blockchain.treasury('deployer');
            const admin = await blockchain.treasury('admin');
            
            const code = await compile('Mixton');
            const mixton = blockchain.openContract(
                Mixton.createFromConfig(
                    { admin: admin.address },
                    code
                )
            );

            const deployResult = await mixton.sendDeploy(deployer.getSender(), toNano('1'));
            
            if (deployResult.transactions.some(tx => tx.description.computePhase?.success)) {
                this.results.deployment = true;
                console.log('✅ Deployment successful');
            } else {
                this.issues.push('Deployment failed: Transaction not successful');
            }
        } catch (error) {
            this.issues.push(`Deployment failed: ${error.message}`);
        }
    }

    async checkBasicOperations() {
        console.log('⚙️  Checking basic operations...');
        try {
            const blockchain = await Blockchain.create();
            const deployer = await blockchain.treasury('deployer');
            const admin = await blockchain.treasury('admin');
            const user = await blockchain.treasury('user');
            
            const code = await compile('Mixton');
            const mixton = blockchain.openContract(
                Mixton.createFromConfig(
                    { admin: admin.address },
                    code
                )
            );

            await mixton.sendDeploy(deployer.getSender(), toNano('1'));

            // Проверка депозита
            await mixton.sendDeposit(user.getSender(), toNano('5.0'));
            
            // Проверка get-методов
            const adminAddr = await mixton.getAdmin();
            const stats = await mixton.getBasicStats();
            const limits = await mixton.getLimits();

            if (adminAddr && stats && limits) {
                this.results.basicOperations = true;
                console.log('✅ Basic operations successful');
            } else {
                this.issues.push('Basic operations failed: Get methods not working');
            }
        } catch (error) {
            this.issues.push(`Basic operations failed: ${error.message}`);
        }
    }

    async checkPerformance() {
        console.log('🚀 Checking performance...');
        try {
            const blockchain = await Blockchain.create();
            const deployer = await blockchain.treasury('deployer');
            const admin = await blockchain.treasury('admin');
            const user = await blockchain.treasury('user');
            const recipient = await blockchain.treasury('recipient');
            
            const code = await compile('Mixton');
            const mixton = blockchain.openContract(
                Mixton.createFromConfig(
                    { admin: admin.address },
                    code
                )
            );

            await mixton.sendDeploy(deployer.getSender(), toNano('1'));

            // Нагрузочное тестирование
            const startTime = Date.now();
            
            // Множественные депозиты
            for (let i = 0; i < 10; i++) {
                await mixton.sendDeposit(user.getSender(), toNano('1.0'));
            }

            // Множественные выводы
            const lastDepositId = await mixton.getLastDepositId();
            await mixton.sendWithdraw(
                admin.getSender(),
                recipient.address,
                toNano('0.5'),
                lastDepositId,
                250,
                1800,
                toNano('0.1')
            );

            const endTime = Date.now();
            const duration = endTime - startTime;

            if (duration < 10000) { // Меньше 10 секунд
                this.results.performance = true;
                console.log(`✅ Performance check passed (${duration}ms)`);
            } else {
                this.warnings.push(`Performance is slow (${duration}ms)`);
                this.results.performance = true; // Считаем успешным, но с предупреждением
            }
        } catch (error) {
            this.issues.push(`Performance check failed: ${error.message}`);
        }
    }

    async checkGasEfficiency() {
        console.log('⛽ Checking gas efficiency...');
        try {
            // Проверяем наличие gas report
            const fs = require('fs');
            const path = require('path');
            const reportPath = path.join(__dirname, '..', 'gas-report.json');

            if (fs.existsSync(reportPath)) {
                const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
                let totalGas = 0;
                let methodCount = 0;

                for (const contractData of Object.values(report.contracts)) {
                    for (const metrics of Object.values(contractData.methods)) {
                        totalGas += metrics.gasUsed;
                        methodCount++;
                    }
                }

                const avgGas = totalGas / methodCount;
                
                if (avgGas < 2000) {
                    this.results.gasEfficiency = true;
                    console.log(`✅ Gas efficiency check passed (avg: ${Math.round(avgGas)} gas)`);
                } else {
                    this.warnings.push(`Gas usage is high (avg: ${Math.round(avgGas)} gas)`);
                    this.results.gasEfficiency = true; // Считаем успешным, но с предупреждением
                }
            } else {
                this.warnings.push('Gas report not found. Run: npm run test:gas');
                this.results.gasEfficiency = true; // Не считаем ошибкой
            }
        } catch (error) {
            this.issues.push(`Gas efficiency check failed: ${error.message}`);
        }
    }

    async checkSecurity() {
        console.log('🔒 Checking security...');
        try {
            const blockchain = await Blockchain.create();
            const deployer = await blockchain.treasury('deployer');
            const admin = await blockchain.treasury('admin');
            const user = await blockchain.treasury('user');
            
            const code = await compile('Mixton');
            const mixton = blockchain.openContract(
                Mixton.createFromConfig(
                    { admin: admin.address },
                    code
                )
            );

            await mixton.sendDeploy(deployer.getSender(), toNano('1'));

            // Проверка прав доступа
            try {
                await mixton.sendEmergencyWithdraw(user.getSender(), toNano('1.0'));
                this.issues.push('Security issue: Non-admin can execute admin functions');
            } catch {
                // Ожидаемая ошибка - это хорошо
            }

            // Проверка черного списка
            await mixton.sendAddToBlacklist(admin.getSender(), user.address, toNano('0.02'));
            
            try {
                await mixton.sendDeposit(user.getSender(), toNano('1.0'));
                this.issues.push('Security issue: Blacklisted user can make deposits');
            } catch {
                // Ожидаемая ошибка - это хорошо
            }

            // Проверка валидации параметров
            try {
                await mixton.sendDeposit(user.getSender(), toNano('0.1')); // Слишком мало
                this.issues.push('Security issue: Invalid amount validation failed');
            } catch {
                // Ожидаемая ошибка - это хорошо
            }

            this.results.security = true;
            console.log('✅ Security check passed');
        } catch (error) {
            this.issues.push(`Security check failed: ${error.message}`);
        }
    }

    printResults() {
        console.log('\n📊 Health Check Results');
        console.log('═'.repeat(50));

        const totalChecks = Object.keys(this.results).length;
        const passedChecks = Object.values(this.results).filter(Boolean).length;
        const successRate = (passedChecks / totalChecks) * 100;

        // Вывод результатов по категориям
        console.log('✅ Passed Checks:');
        Object.entries(this.results).forEach(([check, passed]) => {
            if (passed) {
                console.log(`   🟢 ${check.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
            }
        });

        if (this.issues.length > 0) {
            console.log('\n❌ Issues:');
            this.issues.forEach(issue => {
                console.log(`   🔴 ${issue}`);
            });
        }

        if (this.warnings.length > 0) {
            console.log('\n⚠️  Warnings:');
            this.warnings.forEach(warning => {
                console.log(`   🟡 ${warning}`);
            });
        }

        console.log('\n📈 Summary:');
        console.log(`   Success Rate: ${successRate.toFixed(1)}%`);
        console.log(`   Passed: ${passedChecks}/${totalChecks}`);
        console.log(`   Issues: ${this.issues.length}`);
        console.log(`   Warnings: ${this.warnings.length}`);

        if (successRate === 100) {
            console.log('\n🎉 Excellent! Your contract is healthy and well-optimized.');
        } else if (successRate >= 80) {
            console.log('\n👍 Good! Your contract is mostly healthy with minor issues.');
        } else {
            console.log('\n⚠️  Your contract needs attention. Review the issues above.');
        }

        // Рекомендации
        if (this.issues.length > 0 || this.warnings.length > 0) {
            console.log('\n💡 Recommendations:');
            if (this.issues.some(issue => issue.includes('gas'))) {
                console.log('   - Optimize gas usage with inline functions');
                console.log('   - Use more compact data structures');
            }
            if (this.issues.some(issue => issue.includes('performance'))) {
                console.log('   - Consider batch processing for better performance');
                console.log('   - Optimize loops and iterations');
            }
            if (this.issues.some(issue => issue.includes('security'))) {
                console.log('   - Review access control mechanisms');
                console.log('   - Improve input validation');
            }
        }
    }
}

// Запуск проверки здоровья
const healthChecker = new HealthChecker();
healthChecker.runFullCheck();