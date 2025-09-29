// tests/security.test.ts
import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano, Address } from '@ton/core';
import { Mixton } from '../wrappers/Mixton';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

// Константы для кодов ошибок
const ERROR_UNAUTHORIZED = 403;
const ERROR_INVALID_FEE_RATE = 411;

describe('Mixton Security Tests', () => {
    let code: Cell;
    let blockchain: Blockchain;
    let admin: SandboxContract<TreasuryContract>;
    let user: SandboxContract<TreasuryContract>;
    let mixton: SandboxContract<Mixton>;

    beforeAll(async () => {
        code = await compile('Mixton');
    }, 30000);

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        blockchain.now = Math.floor(Date.now() / 1000);
        admin = await blockchain.treasury('admin');
        user = await blockchain.treasury('user');

        mixton = blockchain.openContract(
            Mixton.createFromConfig(
                {
                    admin: admin.address,
                },
                code
            )
        );

        // Инициализация контракта
        await mixton.sendInternal(admin.getSender(), {
            value: toNano('0.05'),
            body: Cell.EMPTY,
        });
    }, 10000);

    it('should prevent unauthorized access', async () => {
        // Попытка выполнения действия, требующего прав администратора, от обычного пользователя
        const result = await mixton.sendSetFeeRate(
            user.getSender(),
            300, // 3%
            toNano('0.05')
        );
        
        // Проверка, что транзакция завершилась с ошибкой
        expect(result.transactions).toHaveTransaction({
            from: user.address,
            to: mixton.address,
            success: false,
            exitCode: ERROR_UNAUTHORIZED
        });
    }, 10000);

    it('should validate input parameters', async () => {
        // Попытка установить неверную комиссию
        const result = await mixton.sendSetFeeRate(
            admin.getSender(),
            50, // Слишком низкая комиссия (менее MIN_FEE_RATE)
            toNano('0.05')
        );
        
        // Проверка, что транзакция завершилась с ошибкой
        expect(result.transactions).toHaveTransaction({
            from: admin.address,
            to: mixton.address,
            success: false,
            exitCode: ERROR_INVALID_FEE_RATE
        });
    }, 10000);

    it('should handle bounced messages correctly', async () => {
        // Создание недействительного адреса для тестирования отскока
        const invalidAddress = Address.parse('EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c');
        
        await mixton.sendDeposit(user.getSender(), toNano('5.0'));
        const lastDepositId = await mixton.getLastDepositId();
        
        // Попытка вывода на недействительный адрес
        const withdrawResult = await mixton.sendWithdraw(
            admin.getSender(),
            invalidAddress,
            toNano('2.0'),
            lastDepositId,
            250,
            30,
            toNano('0.1')
        );
        
        // Проверка, что транзакция прошла успешно
        expect(withdrawResult.transactions).toHaveTransaction({
            from: admin.address,
            to: mixton.address,
            success: true,
        });
        
        // Проверка, что средства были добавлены в очередь
        const queueInfo = await mixton.getQueueInfo();
        expect(queueInfo.queueLength).toBe(1);
    }, 15000);
});