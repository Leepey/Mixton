// scripts/analyze-gas.js - Анализ потребления газа
const fs = require('fs');
const path = require('path');

class GasAnalyzer {
    constructor() {
        this.reportPath = path.join(__dirname, '..', 'gas-report.json');
        this.thresholds = {
            highGas: 3000,
            highCells: 15,
            highBits: 1000,
            warningGas: 2000,
            warningCells: 10,
            warningBits: 800
        };
    }

    analyze() {
        try {
            if (!fs.existsSync(this.reportPath)) {
                console.log('❌ Gas report not found. Run: npm run test:gas');
                return;
            }

            const report = JSON.parse(fs.readFileSync(this.reportPath, 'utf8'));
            console.log('📊 Mixton Gas Analysis Report\n');
            console.log('═'.repeat(60));

            let totalGas = 0;
            let totalCells = 0;
            let totalBits = 0;
            let methodCount = 0;

            for (const [contractName, contractData] of Object.entries(report.contracts)) {
                console.log(`🔍 ${contractName}:`);
                console.log('─'.repeat(40));

                for (const [methodName, metrics] of Object.entries(contractData.methods)) {
                    methodCount++;
                    totalGas += metrics.gasUsed;
                    totalCells += metrics.cells;
                    totalBits += metrics.bits;

                    console.log(`  ${methodName}:`);
                    console.log(`    ⛽ Gas: ${metrics.gasUsed.toLocaleString()}`);
                    console.log(`    📦 Cells: ${metrics.cells}`);
                    console.log(`    🔢 Bits: ${metrics.bits}`);

                    // Анализ и рекомендации
                    this.analyzeMetrics(methodName, metrics);
                }

                console.log('─'.repeat(40));
            }

            // Общая статистика
            console.log('\n📈 Overall Statistics:');
            console.log('═'.repeat(40));
            console.log(`Total Methods: ${methodCount}`);
            console.log(`Average Gas: ${Math.round(totalGas / methodCount).toLocaleString()}`);
            console.log(`Average Cells: ${(totalCells / methodCount).toFixed(1)}`);
            console.log(`Average Bits: ${Math.round(totalBits / methodCount)}`);

            // Общие рекомендации
            this.generateGeneralRecommendations(totalGas / methodCount, totalCells / methodCount, totalBits / methodCount);

        } catch (error) {
            console.error('❌ Error analyzing gas report:', error.message);
        }
    }

    analyzeMetrics(methodName, metrics) {
        const recommendations = [];

        // Анализ газа
        if (metrics.gasUsed > this.thresholds.highGas) {
            recommendations.push('🔥 HIGH GAS: Consider refactoring or splitting logic');
        } else if (metrics.gasUsed > this.thresholds.warningGas) {
            recommendations.push('⚠️  Moderate gas usage: Review for optimization opportunities');
        }

        // Анализ ячеек
        if (metrics.cells > this.thresholds.highCells) {
            recommendations.push('📦 TOO MANY CELLS: Optimize data storage');
        } else if (metrics.cells > this.thresholds.warningCells) {
            recommendations.push('⚠️  High cell usage: Consider compact storage');
        }

        // Анализ битов
        if (metrics.bits > this.thresholds.highBits) {
            recommendations.push('🔢 TOO MANY BITS: Compress data structures');
        } else if (metrics.bits > this.thresholds.warningBits) {
            recommendations.push('⚠️  High bit usage: Optimize data encoding');
        }

        // Вывод рекомендаций
        if (recommendations.length > 0) {
            console.log('    💡 Recommendations:');
            recommendations.forEach(rec => console.log(`      ${rec}`));
        } else {
            console.log('    ✅ Optimized');
        }
    }

    generateGeneralRecommendations(avgGas, avgCells, avgBits) {
        console.log('\n🎯 General Recommendations:');
        console.log('═'.repeat(40));

        if (avgGas > 2500) {
            console.log('🔥 Overall gas usage is HIGH. Consider:');
            console.log('   - Using inline functions more aggressively');
            console.log('   - Splitting complex operations');
            console.log('   - Optimizing loops and iterations');
        }

        if (avgCells > 8) {
            console.log('📦 Cell usage is HIGH. Consider:');
            console.log('   - Using more compact data structures');
            console.log('   - Combining related data');
            console.log('   - Using dictionaries more efficiently');
        }

        if (avgBits > 600) {
            console.log('🔢 Bit usage is HIGH. Consider:');
            console.log('   - Using smaller integer types');
            console.log('   - Compressing strings and data');
            console.log('   - Using bit-level packing');
        }

        if (avgGas <= 1500 && avgCells <= 5 && avgBits <= 400) {
            console.log('✅ Excellent optimization! Your contract is well-optimized.');
        }
    }
}

// Запуск анализа
const analyzer = new GasAnalyzer();
analyzer.analyze();