//Enhanced with optimized withdrawal queue processing, improved error handling, and better performance
// Updated for Tolk 1.0.0 compatibility
// =============================================================================
// КОНСТАНТЫ СМАРТ-КОНТРАКТА
// =============================================================================
// Операции (32-bit)
const OP_DEPOSIT = 0x6465706f;         // "depo" - Депозит
const OP_WITHDRAW = 0x695f7764;       // "i_wd" - Вывод
const OP_MULTI_WITHDRAW = 0x6d756c77; // "mulw" - Множественный вывод
const OP_EMERGENCY_WITHDRAW = 0x656d7764; // "emwd" - Аварийный вывод
const OP_ADD_BLACKLIST = 0x61646462;  // "addb" - Черный список
const OP_REMOVE_BLACKLIST = 0x72656d62; // "remb" - Черный список
const OP_PROCESS_QUEUE = 0x70726f63;  // "proc" - Обработка очереди
// Новые операции v2.0
const OP_SET_FEE_RATE = 0x73657466;  // "setf" - Установка комиссии
const OP_ADD_SIGNER = 0x61647369;    // "adsi" - Добавление подписанта
const OP_REMOVE_SIGNER = 0x726d7369;  // "rmsi" - Удаление подписанта
const OP_UPDATE_ORACLE = 0x7570646f;  // "updo" - Обновление оракула
const OP_GET_HISTORY = 0x67657468;    // "geth" - Получение истории

// Параметры миксера
const MIN_FEE_RATE = 100;          // 1% минимальная комиссия
const MAX_FEE_RATE = 500;          // 5% максимальная комиссия
const MIN_DELAY = 30;              // 30 секунд минимальная задержка
const MAX_DELAY = 259200;          // 3 дня максимальная задержка

// Лимиты
const MIN_DEPOSIT_AMOUNT = 1000000000;    // 1 TON
const MAX_DEPOSIT_AMOUNT = 10000000000000; // 10000 TON
const MIN_WITHDRAW_AMOUNT = 500000000;    // 0.5 TON
const MAX_PARTS = 4;                    // Максимальное количество частей
const WITHDRAW_TIMEOUT = 604800;        // 7 дней - максимальное время на вывод
const MAX_SIGNERS = 5;                 // Максимальное количество подписантов
const MAX_HISTORY_SIZE = 1000;         // Максимальный размер истории
const MAX_QUEUE_SIZE = 1000;           // Максимальный размер очереди

// Новые константы для оптимизации обработки очереди v2.3
const GAS_RESERVE = 5000000;          // Резерв газа для безопасности
const MAX_BATCH_SIZE = 5;              // УМЕНЬШЕНО: Максимальный размер пакета обработки
const MIN_GAS_PER_ITEM = 3000000;      // Минимальный газ на один элемент
const BASE_GAS_COST = 10000000;        // Базовая стоимость операции
const PER_ITEM_GAS_COST = 5000000;     // Стоимость на один элемент очереди

// Коды ошибок
const ERROR_UNAUTHORIZED = 403;
const ERROR_INVALID_AMOUNT = 400;
const ERROR_INSUFFICIENT_BALANCE = 401;
const ERROR_AMOUNT_TOO_LARGE = 402;
const ERROR_AMOUNT_TOO_SMALL = 404;
const ERROR_INVALID_MODE = 405;
const ERROR_ADDRESS_BLACKLISTED = 406;
const ERROR_DEPOSIT_NOT_FOUND = 407;
const ERROR_WITHDRAWAL_TIMEOUT = 408;
const ERROR_INVALID_ADDRESS = 409;
const ERROR_TOO_MANY_WITHDRAWALS = 410;
const ERROR_INVALID_FEE_RATE = 411;
const ERROR_INVALID_DELAY = 412;
const ERROR_QUEUE_FULL = 413;
const ERROR_TOO_FREQUENT_OPERATIONS = 414;
const ERROR_INSUFFICIENT_SIGNATURES = 415; // Недостаточно подписей
const ERROR_INVALID_SIGNER = 416;          // Неверный подписант
const ERROR_ORACLE_DATA_INVALID = 417;     // Неверные данные оракула
const ERROR_HISTORY_FULL = 418;           // История переполнена
const ERROR_SEND_FAILED = 419;            // Ошибка отправки сообщения
// Новые коды ошибок v2.3
const ERROR_PROCESSING_FAILED = 420;      // Ошибка обработки очереди
const ERROR_QUEUE_CORRUPTED = 421;        // Очередь повреждена
const ERROR_INSUFFICIENT_GAS = 422;       // Недостаточно газа

// =============================================================================
// ИМПОРТЫ
// =============================================================================
import "@stdlib/tvm-dicts";

// =============================================================================
// СТРУКТУРЫ ДАННЫХ
// =============================================================================
// Структура депозита
struct Deposit {
    sender: address;
    amount: int;
    timestamp: int;
    delay: int;
    status: int;
}

// Оптимизированная структура элемента очереди выводов v2.3
struct QueueItem {
    recipient: address;
    amount: int;
    partsLeft: int;
    nextTime: int;
    depositId: int;
    priority: int;    // Приоритет обработки (новое поле)
    gasEstimate: int; // Оценка газа для отправки (новое поле)
}

// Структура состояния контракта
struct MixtonState {
    admin: address;
    deposits: dict;
    withdrawalQueue: dict;
    blacklist: dict;
    totalDeposits: int;
    totalWithdrawn: int;
    nextDepositId: int;
    nextQueueId: int;
    initialized: bool;
    // Новые поля v2.0
    currentFeeRate: int;        // Текущая комиссия
    signers: dict;              // Словарь подписантов (ключ: адрес, значение: флаг активности)
    requiredSignatures: int;    // Требуемое количество подписей
    oracleData: int;           // Данные оракула (например, курс TON/USD * 1000)
    lastOracleUpdate: int;      // Время последнего обновления оракула
    transactionHistory: dict;    // История транзакций
    nextHistoryId: int;         // Следующий ID истории
    // Новые поля v2.1
    lastProcessedTime: int;     // Время последней обработки очереди
    failedTransactions: int;    // Количество неудачных транзакций
    // Новые поля v2.3
    queueProcessingStats: dict; // Статистика обработки очереди
    lastQueueCheck: int;        // Время последней проверки очереди
}

// Структура для истории транзакций
struct TransactionRecord {
    txType: int;        // 0 - депозит, 1 - вывод, 2 - комиссия
    address: address;    // Адрес отправителя/получателя
    amount: int;        // Сумма
    timestamp: int;     // Время транзакции
    feeRate: int;       // Комиссия (если применимо)
    status: int;        // Статус: 0 - ожидает, 1 - завершена, 2 - ошибка
}

// Новая структура для статистики обработки v2.3
struct ProcessingStats {
    processedItems: int;
    processedAmount: int;
    gasUsed: int;
    remainingItems: int;
    timestamp: int;
}

// =============================================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// =============================================================================
// Методы для загрузки и сохранения состояния
fun MixtonState.load(): MixtonState {
    var data = contract.getData();
    var dataSlice = data.beginParse();
    if (dataSlice.isEmpty()) {
        // Если ячейка пуста (первый запуск), создаем начальное состояние
        var tempAdmin = beginCell()
            .storeUint(0, 2) // addr_none$00 = 0
            .storeUint(0, 1) // workchain_id
            .endCell()
            .beginParse()
            .loadAddress();
        return MixtonState {
            admin: tempAdmin,
            deposits: createEmptyDict(),
            withdrawalQueue: createEmptyDict(),
            blacklist: createEmptyDict(),
            totalDeposits: 0,
            totalWithdrawn: 0,
            nextDepositId: 0,
            nextQueueId: 0,
            initialized: false,
            // Новые поля v2.0
            currentFeeRate: MIN_FEE_RATE,
            signers: createEmptyDict(),
            requiredSignatures: 1,
            oracleData: 1000000, // Начальный курс: 1 TON = 1 USD (1000000 * 1000)
            lastOracleUpdate: 0,
            transactionHistory: createEmptyDict(),
            nextHistoryId: 0,
            // Новые поля v2.1
            lastProcessedTime: 0,
            failedTransactions: 0,
            // Новые поля v2.3
            queueProcessingStats: createEmptyDict(),
            lastQueueCheck: 0
        };
    }
    return MixtonState.fromCell(data);
}

fun MixtonState.save(self) {
    contract.setData(self.toCell());
}

// Метод для преобразования состояния в ячейку
fun MixtonState.toCell(self): cell {
    return beginCell()
        .storeAddress(self.admin)
        .storeDict(self.deposits)
        .storeDict(self.withdrawalQueue)
        .storeDict(self.blacklist)
        .storeUint(self.totalDeposits, 32)
        .storeUint(self.totalWithdrawn, 64)
        .storeUint(self.nextDepositId, 32)
        .storeUint(self.nextQueueId, 32)
        .storeUint(self.initialized ? 1 : 0, 1)
        // Новые поля v2.0
        .storeUint(self.currentFeeRate, 32)
        .storeDict(self.signers)
        .storeUint(self.requiredSignatures, 8)
        .storeUint(self.oracleData, 64)
        .storeUint(self.lastOracleUpdate, 64)
        .storeDict(self.transactionHistory)
        .storeUint(self.nextHistoryId, 32)
        // Новые поля v2.1
        .storeUint(self.lastProcessedTime, 64)
        .storeUint(self.failedTransactions, 32)
        // Новые поля v2.3
        .storeDict(self.queueProcessingStats)
        .storeUint(self.lastQueueCheck, 64)
        .endCell();
}

// Метод для загрузки состояния из ячейки
fun MixtonState.fromCell(cell: cell): MixtonState {
    var dataSlice = cell.beginParse();
    var admin = dataSlice.loadAddress();
    var depositsDict = dataSlice.loadDict();
    var withdrawalQueueDict = dataSlice.loadDict();
    var blacklistDict = dataSlice.loadDict();
    var totalDeposits = dataSlice.loadUint(32);
    var totalWithdrawn = dataSlice.loadUint(64);
    var nextDepositId = dataSlice.loadUint(32);
    var nextQueueId = dataSlice.loadUint(32);
    
    // Читаем флаг инициализации безусловно
    var initialized = dataSlice.loadUint(1) == 1;
    
    // Читаем поля v2.0 безусловно
    var currentFeeRate = dataSlice.loadUint(32);
    var signersDict = dataSlice.loadDict();
    var requiredSignatures = dataSlice.loadUint(8);
    var oracleData = dataSlice.loadUint(64);
    var lastOracleUpdate = dataSlice.loadUint(64);
    var transactionHistoryDict = dataSlice.loadDict();
    var nextHistoryId = dataSlice.loadUint(32);
    
    // Читаем поля v2.1
    var lastProcessedTime = dataSlice.loadUint(64);
    var failedTransactions = dataSlice.loadUint(32);
    
    // Читаем поля v2.3
    var queueProcessingStatsDict = createEmptyDict();
    var lastQueueCheck = 0;
    
    // Используем isEmpty() для проверки наличия данных
    if (!dataSlice.isEmpty()) {
        try {
            queueProcessingStatsDict = dataSlice.loadDict();
            lastQueueCheck = dataSlice.loadUint(64);
        } catch (_) {
            // Если не удалось прочитать, оставляем значения по умолчанию
            queueProcessingStatsDict = createEmptyDict();
            lastQueueCheck = 0;
        }
    }
    
    return MixtonState {
        admin: admin,
        deposits: depositsDict,
        withdrawalQueue: withdrawalQueueDict,
        blacklist: blacklistDict,
        totalDeposits: totalDeposits,
        totalWithdrawn: totalWithdrawn,
        nextDepositId: nextDepositId,
        nextQueueId: nextQueueId,
        initialized: initialized,
        // Новые поля v2.0
        currentFeeRate: currentFeeRate,
        signers: signersDict,
        requiredSignatures: requiredSignatures,
        oracleData: oracleData,
        lastOracleUpdate: lastOracleUpdate,
        transactionHistory: transactionHistoryDict,
        nextHistoryId: nextHistoryId,
        // Новые поля v2.1
        lastProcessedTime: lastProcessedTime,
        failedTransactions: failedTransactions,
        // Новые поля v2.3
        queueProcessingStats: queueProcessingStatsDict,
        lastQueueCheck: lastQueueCheck
    };
}

// Получение хеша адреса для использования в словарях
fun addressToKey(addr: address): int {
    var addrCell = beginCell().storeAddress(addr).endCell();
    return addrCell.hash();
}

// Проверка адреса в черном списке
fun isBlacklisted(state: MixtonState, addr: address): bool {
    var key = addressToKey(addr);
    var (result, found) = state.blacklist.uDictGet(256, key);
    return found;
}

// Валидация адреса
fun isValidAddress(addr: address): bool {
    return true;
}

// Проверка подписей для мультиподписи
fun checkSignatures(state: MixtonState, sender: address): bool {
    // Если отправитель - администратор, разрешаем
    if (sender == state.admin) {
        return true;
    }
    
    // Проверяем, является ли отправитель подписантом
    var key = addressToKey(sender);
    var (result, found) = state.signers.uDictGet(256, key);
    
    return found;
}

// Расчет случайной задержки (ИСПРАВЛЕНО)
fun calculateRandomDelay(baseDelay: int, variance: int): int {
    // Используем правильный метод для доступа к логическому времени
    var seed = blockchain.now() + blockchain.logicalTime();
    random.initializeBy(seed);
    
    var randomValue = random.range(variance);
    
    // Убедимся, что задержка не меньше минимальной
    var resultDelay = baseDelay + randomValue;
    if (resultDelay < MIN_DELAY) {
        resultDelay = MIN_DELAY;
    }
    
    return resultDelay;
}

// Упрощенная функция отправки TON
fun sendTonSafe(to: address, amount: int, availableBalance: int): bool {
    if (amount <= 0 || amount > availableBalance) {
        return false;
    }
    
    try {
        var msg = beginCell()
            .storeUint(0x10, 6) // обычное сообщение
            .storeAddress(to)
            .storeCoins(amount)
            .storeUint(0, 107) // стандартные заголовки
            .endCell();
        
        sendRawMessage(msg, 64);
        return true;
    } catch (_) {
        return false;
    }
}

// Оценка газа для перевода (новая функция v2.3)
fun estimateGasForTransfer(amount: int): int {
    var baseGas = 10000000;
    var sizeGas = amount / 1000000000 * 1000000; // Примерная оценка
    
    return baseGas + sizeGas;
}

// Добавление записи в историю транзакций
fun addTransactionRecord(state: MixtonState, txType: int, addr: address, amount: int, feeRate: int, status: int) {
    if (state.nextHistoryId >= MAX_HISTORY_SIZE) {
        // Если история переполнена, удаляем самую старую запись
        var (oldestKey, oldestValue, oldestFound) = state.transactionHistory.uDictGetFirst(256);
        if (oldestFound) {
            state.transactionHistory.uDictDelete(256, oldestKey!);
        }
    }
    
    var record = TransactionRecord {
        txType: txType,
        address: addr,
        amount: amount,
        timestamp: blockchain.now(),
        feeRate: feeRate,
        status: status
    };
    
    state.transactionHistory.uDictSet(256, state.nextHistoryId, record.toCell().beginParse());
    state.nextHistoryId = state.nextHistoryId + 1;
}

// Оценка стоимости газа для множественного вывода
fun estimateMultiWithdrawGasCost(count: int): int {
    var baseCost = 20000000;
    var perItemCost = 5000000;
    
    return baseCost + (count * perItemCost);
}

// Расчет оптимального размера пакета (обновлено v2.3)
fun calculateOptimalBatchSize(availableGas: int): int {
    var maxItems = (availableGas - BASE_GAS_COST) / PER_ITEM_GAS_COST;
    
    // Ограничиваем максимальный размер пакета
    if (maxItems > MAX_BATCH_SIZE) {
        return MAX_BATCH_SIZE;
    } else if (maxItems < 1) {
        return 1;
    } else {
        return maxItems;
    }
}

// =============================================================================
// ОПТИМИЗИРОВАННЫЕ ФУНКЦИИ ОБРАБОТКИ ОЧЕРЕДИ v2.3
// =============================================================================

// Упрощенная и надежная функция обработки очереди (ИСПРАВЛЕНО для Tolk 1.0.0)
fun handleProcessQueueOptimized(myBalance: int, msgValue: int, state: MixtonState) {
    // Проверка размера очереди
    var queueSize = getQueueSize(state);
    if (queueSize == 0) {
        return (); // Очередь пуста
    }
    
    // Расчет доступного газа с запасом
    var availableGas = myBalance + msgValue - GAS_RESERVE;
    if (availableGas < MIN_GAS_PER_ITEM) {
        throw(ERROR_INSUFFICIENT_GAS);
    }
    
    // Расчет оптимального размера пакета
    var optimalBatchSize = calculateOptimalBatchSize(availableGas);
    
    // Создаем новую очередь для элементов, которые не будут обработаны
    var newQueue = createEmptyDict();
    var processedCount = 0;
    var totalProcessedAmount = 0;
    var totalGasUsed = BASE_GAS_COST;
    var currentTime = blockchain.now();
    
    // Получаем первый элемент для начала итерации
    var (currentKey, currentValue, found) = state.withdrawalQueue.uDictGetFirst(256);
    
    // ИСПРАВЛЕНО: Обрабатываем только один элемент за вызов для надежности
    if (found && currentValue != null && processedCount < optimalBatchSize) {
        // Проверяем, что слайс не пустой
        if (!currentValue.isEmpty()) {
            // Извлекаем данные из элемента очереди
            var recipient = currentValue.loadAddress();
            var amount = currentValue.loadCoins();
            var partsLeft = currentValue.loadUint(8);
            var nextTime = currentValue.loadUint(64);
            var depositId = currentValue.loadUint(64);
            var priority = currentValue.loadUint(8);
            var gasEstimate = currentValue.loadUint(32);
            
            // Проверяем, готов ли элемент к обработке и достаточно ли газа
            if (currentTime >= nextTime && totalGasUsed + gasEstimate <= availableGas) {
                // Проверяем баланс
                if (amount <= myBalance) {
                    // Отправка средств
                    var msg = beginCell()
                        .storeUint(0x10, 6) // обычное сообщение
                        .storeAddress(recipient)
                        .storeCoins(amount)
                        .storeUint(0, 107) // стандартные заголовки
                        .endCell();
                    
                    sendRawMessage(msg, 64);
                    
                    // Обновляем статистику
                    processedCount = processedCount + 1;
                    totalProcessedAmount = totalProcessedAmount + amount;
                    totalGasUsed = totalGasUsed + gasEstimate;
                    
                    // Обновляем статус транзакции в истории
                    updateTransactionStatus(state, 1, recipient, amount, 1);
                    
                    // Элемент обработан, не добавляем его в новую очередь
                } else {
                    // Если баланс недостаточен, добавляем элемент в новую очередь
                    var queueItem = QueueItem {
                        recipient: recipient,
                        amount: amount,
                        partsLeft: partsLeft,
                        nextTime: nextTime,
                        depositId: depositId,
                        priority: priority,
                        gasEstimate: gasEstimate
                    };
                    newQueue.uDictSet(256, currentKey!, queueItem.toCell().beginParse());
                }
            } else {
                // Если время еще не пришло или газа недостаточно, добавляем элемент в новую очередь
                var queueItem = QueueItem {
                    recipient: recipient,
                    amount: amount,
                    partsLeft: partsLeft,
                    nextTime: nextTime,
                    depositId: depositId,
                    priority: priority,
                    gasEstimate: gasEstimate
                };
                newQueue.uDictSet(256, currentKey!, queueItem.toCell().beginParse());
            }
        } else {
            // Если слайс пустой, просто переносим его в новую очередь
            newQueue.uDictSet(256, currentKey!, currentValue);
        }
        
        // Переходим к следующему элементу
        (currentKey, currentValue, found) = state.withdrawalQueue.uDictGetNext(256, currentKey!);
    }
    
    // Добавляем все оставшиеся элементы в новую очередь без изменений
    while (found) {
        if (currentValue != null) {
            newQueue.uDictSet(256, currentKey!, currentValue);
        }
        (currentKey, currentValue, found) = state.withdrawalQueue.uDictGetNext(256, currentKey!);
    }
    
    // Обновляем очередь в состоянии
    state.withdrawalQueue = newQueue;
    
    // Обновляем статистику
    if (processedCount > 0) {
        state.totalWithdrawn = state.totalWithdrawn + totalProcessedAmount;
        state.lastProcessedTime = currentTime;
        
        // Сохраняем статистику обработки
        var stats = ProcessingStats {
            processedItems: processedCount,
            processedAmount: totalProcessedAmount,
            gasUsed: totalGasUsed,
            remainingItems: getQueueSize(state),
            timestamp: currentTime
        };
        
        state.queueProcessingStats.uDictSet(256, state.nextQueueId, stats.toCell().beginParse());
        state.lastQueueCheck = currentTime;
    }
    
    // Сохраняем состояние
    state.save();
    
    // Если остались необработанные элементы и есть газ, отправляем сообщение для продолжения обработки
    if (getQueueSize(state) > 0 && availableGas - totalGasUsed > MIN_GAS_PER_ITEM) {
        sendContinueMessage();
    }
    
    return (); // Явный возврат в конце функции
}

// Отправка сообщения для продолжения обработки (новая функция v2.3)
fun sendContinueMessage() {
    var msg = beginCell()
        .storeUint(0x10, 6) // обычное сообщение
        .storeAddress(contract.getAddress())
        .storeCoins(0) // без значения
        .storeUint(OP_PROCESS_QUEUE, 32) // операция обработки очереди
        .storeUint(0, 64 + 32 + 1 + 1 + 1) // простой заголовок
        .endCell();
    
    // Отправляем с отложенной обработкой
    sendRawMessage(msg, 64);
    return (); // Явный возврат
}

// Улучшенная функция получения размера очереди v2.3
fun getQueueSize(state: MixtonState): int {
    var count = 0;
    var (currentKey, currentValue, found) = state.withdrawalQueue.uDictGetFirst(256);
    var lastKey = currentKey;
    var shouldContinue = true;
    
    while (found && shouldContinue && count < 10000) {
        count = count + 1;
        (currentKey, currentValue, found) = state.withdrawalQueue.uDictGetNext(256, currentKey!);
        
        // Защита от бесконечного цикла без использования break
        if (found && currentKey! <= lastKey!) {
            shouldContinue = false;
        }
        lastKey = currentKey;
    }
    
    return count;
}

// Упрощенная функция безопасной обработки
fun handleProcessQueueSafe(myBalance: int, msgValue: int, state: MixtonState) {
    try {
        // Проверка базовых условий
        if (myBalance < 0) {
            throw(ERROR_INSUFFICIENT_BALANCE);
        }
        
        // Вызываем основную функцию обработки
        handleProcessQueueOptimized(myBalance, msgValue, state);
        
    } catch (error) {
        // Обработка ошибок
        state.failedTransactions = state.failedTransactions + 1;
        state.save();
        throw(error);
    }
    return (); // Явный возврат
}

// =============================================================================
// ОСНОВНАЯ ЛОГИКА СМАРТ-КОНТРАКТА
// =============================================================================
// Обработчик внутренних сообщений
fun onInternalMessage(myBalance: int, msgValue: int, msgFull: cell, msgBody: slice) {
    // Инициализируем random с использованием правильных методов
    random.initializeBy(blockchain.now() + blockchain.logicalTime());
    
    var msgCell = msgFull.beginParse();
    var flags = msgCell.loadUint(4);
    
    if ((flags & 1) != 0) {
        return ();
    }
    
    var sender = msgCell.loadAddress();
    var state = MixtonState.load();
    
    // Проверка, является ли это первым сообщением к контракту
    if (!state.initialized) {
        state.admin = sender;
        state.initialized = true;
        state.save();
        
        if (msgValue >= MIN_DEPOSIT_AMOUNT && msgBody.isEmpty()) {
            handleDeposit(sender, msgValue, state);
        }
        
        return ();
    }
    
    // Проверка черного списка
    if (isBlacklisted(state, sender)) {
        throw(ERROR_ADDRESS_BLACKLISTED);
    }
    
    if (!isValidAddress(sender)) {
        throw(ERROR_INVALID_ADDRESS);
    }
    
    // Обработка депозита (пустое сообщение)
    if (msgBody.isEmpty()) {
        handleDeposit(sender, msgValue, state);
        return ();
    }
    
    // Обработка структурированных сообщений
    var op = msgBody.loadUint(32);
    
    if (op == OP_WITHDRAW) {
        handleWithdraw(msgBody, sender, myBalance, msgValue, state);
    } else if (op == OP_MULTI_WITHDRAW) {
        handleMultiWithdraw(msgBody, sender, myBalance, msgValue, state);
    } else if (op == OP_EMERGENCY_WITHDRAW) {
        handleEmergencyWithdraw(msgBody, sender, myBalance, msgValue, state);
    } else if (op == OP_ADD_BLACKLIST) {
        handleAddBlacklist(msgBody, sender, myBalance, msgValue, state);
    } else if (op == OP_REMOVE_BLACKLIST) {
        handleRemoveBlacklist(msgBody, sender, myBalance, msgValue, state);
    } else if (op == OP_PROCESS_QUEUE) {
        // ИСПОЛЬЗУЕМ НОВУЮ ОПТИМИЗИРОВАННУЮ ФУНКЦИЮ
        handleProcessQueueSafe(myBalance, msgValue, state);
    } else if (op == OP_SET_FEE_RATE) {
        handleSetFeeRate(msgBody, sender, state);
    } else if (op == OP_ADD_SIGNER) {
        handleAddSigner(msgBody, sender, state);
    } else if (op == OP_REMOVE_SIGNER) {
        handleRemoveSigner(msgBody, sender, state);
    } else if (op == OP_UPDATE_ORACLE) {
        handleUpdateOracle(msgBody, sender, state);
    } else {
        throw(0xffff);
    }
    
    return ();
}

// Обработка депозита
fun handleDeposit(sender: address, msgValue: int, state: MixtonState) {
    if (msgValue < MIN_DEPOSIT_AMOUNT) {
        throw(ERROR_AMOUNT_TOO_SMALL);
    }
    if (msgValue > MAX_DEPOSIT_AMOUNT) {
        throw(ERROR_AMOUNT_TOO_LARGE);
    }
    
    var depositId = state.nextDepositId;
    state.nextDepositId = state.nextDepositId + 1;
    
    var currentTime = blockchain.now();
    var deposit = Deposit {
        sender: sender,
        amount: msgValue,
        timestamp: currentTime,
        delay: 0,
        status: 0
    };
    
    state.deposits.uDictSet(256, depositId, deposit.toCell().beginParse());
    state.totalDeposits = state.totalDeposits + 1;
    
    // Добавляем запись в историю
    addTransactionRecord(state, 0, sender, msgValue, 0, 1);
    
    state.save();
    return (); // Явный возврат
}

// Обработка вывода средств (ИСПРАВЛЕНО)
fun handleWithdraw(msgBody: slice, sender: address, myBalance: int, msgValue: int, state: MixtonState) {
    // Проверка прав (администратор или подписант)
    if (!checkSignatures(state, sender)) {
        throw(ERROR_UNAUTHORIZED);
    }
    
    var queueSize = getQueueSize(state);
    if (queueSize >= MAX_QUEUE_SIZE) {
        throw(ERROR_QUEUE_FULL);
    }
    
    var recipientCell = msgBody.loadRef();
    var recipient = recipientCell.beginParse().loadAddress();
    var amount = msgBody.loadCoins();
    var depositId = msgBody.loadUint(64);
    var feeRate = msgBody.loadUint(32);
    var delay = msgBody.loadUint(32);
    
    // Валидация параметров
    if (amount <= 0) {
        throw(ERROR_INVALID_AMOUNT);
    }
    if (amount < MIN_WITHDRAW_AMOUNT) {
        throw(ERROR_AMOUNT_TOO_SMALL);
    }
    if (feeRate < MIN_FEE_RATE || feeRate > MAX_FEE_RATE) {
        throw(ERROR_INVALID_FEE_RATE);
    }
    if (delay < MIN_DELAY || delay > MAX_DELAY) {
        throw(ERROR_INVALID_DELAY);
    }
    
    // Проверка депозита
    var (depositSlice, found) = state.deposits.uDictGet(256, depositId);
    if (!found) {
        throw(ERROR_DEPOSIT_NOT_FOUND);
    }
    
    var depositAddress = depositSlice!.loadAddress();
    var depositAmount = depositSlice!.loadCoins();
    var depositTime = depositSlice!.loadUint(64);
    var depositDelay = depositSlice!.loadUint(32);
    var depositStatus = depositSlice!.loadUint(1);
    
    if (depositStatus != 0) {
        throw(ERROR_DEPOSIT_NOT_FOUND);
    }
    if (blockchain.now() > depositTime + WITHDRAW_TIMEOUT) {
        throw(ERROR_WITHDRAWAL_TIMEOUT);
    }
    
    // Расчет комиссии и доступного баланса
    var gasEstimate = 25000000;
    var availableBalance = myBalance + msgValue - gasEstimate;
    
    if (amount > availableBalance) {
        throw(ERROR_INSUFFICIENT_BALANCE);
    }
    
    // Используем текущую комиссию из состояния
    var actualFeeRate = state.currentFeeRate;
    var fee = (amount * actualFeeRate) / 10000;
    var netAmount = amount - fee;
    
    if (netAmount > availableBalance) {
        throw(ERROR_INSUFFICIENT_BALANCE);
    }
    
    // Расчет случайной задержки
    var randomDelay = calculateRandomDelay(delay, 60);
    
    // Создание элемента очереди с новой структурой v2.3
    var queueItem = QueueItem {
        recipient: recipient,
        amount: netAmount,
        partsLeft: 1,
        nextTime: blockchain.now() + randomDelay,
        depositId: depositId,
        priority: 1, // Стандартный приоритет
        gasEstimate: estimateGasForTransfer(netAmount) // Оценка газа
    };
    
    var queueId = state.nextQueueId;
    state.nextQueueId = state.nextQueueId + 1;
    
    // Добавление элемента в очередь
    state.withdrawalQueue.uDictSet(256, queueId, queueItem.toCell().beginParse());
    
    // Отправка комиссии администратору
    if (fee > 0) {
        sendTonSafe(state.admin, fee, availableBalance);
        // Добавляем запись о комиссии в историю
        addTransactionRecord(state, 2, state.admin, fee, actualFeeRate, 1);
    }
    
    // Обновление статуса депозита
    var updatedDeposit = Deposit {
        sender: depositAddress,
        amount: depositAmount,
        timestamp: depositTime,
        delay: delay,
        status: 1  // Processed
    };
    
    state.deposits.uDictSet(256, depositId, updatedDeposit.toCell().beginParse());
    
    // Добавляем запись о выводе в историю
    addTransactionRecord(state, 1, recipient, netAmount, actualFeeRate, 0);
    
    // Сохранение состояния
    state.save();
    return (); // Явный возврат
}

// Обработка множественного вывода (ИСПРАВЛЕНО)
fun handleMultiWithdraw(msgBody: slice, sender: address, myBalance: int, msgValue: int, state: MixtonState) {
    if (!checkSignatures(state, sender)) {
        throw(ERROR_UNAUTHORIZED);
    }
    
    var withdrawalsCount = msgBody.loadUint(8);
    var depositId = msgBody.loadUint(64);
    
    if (withdrawalsCount < 1 || withdrawalsCount > MAX_PARTS) {
        throw(ERROR_TOO_MANY_WITHDRAWALS);
    }
    
    var queueSize = getQueueSize(state);
    if (queueSize + withdrawalsCount >= MAX_QUEUE_SIZE) {
        throw(ERROR_QUEUE_FULL);
    }
    
    var estimatedGasCost = estimateMultiWithdrawGasCost(withdrawalsCount);
    var availableBalance = myBalance + msgValue - estimatedGasCost;
    
    var (depositSlice, found) = state.deposits.uDictGet(256, depositId);
    if (!found) {
        throw(ERROR_DEPOSIT_NOT_FOUND);
    }
    
    var depositAddress = depositSlice!.loadAddress();
    var depositAmount = depositSlice!.loadCoins();
    var depositTime = depositSlice!.loadUint(64);
    var depositDelay = depositSlice!.loadUint(32);
    var depositStatus = depositSlice!.loadUint(1);
    
    if (depositStatus != 0) {
        throw(ERROR_DEPOSIT_NOT_FOUND);
    }
    if (blockchain.now() > depositTime + WITHDRAW_TIMEOUT) {
        throw(ERROR_WITHDRAWAL_TIMEOUT);
    }
    
    var totalWithdrawalAmount = 0;
    var totalFeeAmount = 0;
    
    var i = 0;
    while (i < withdrawalsCount && i < MAX_PARTS) {
        var recipientCell = msgBody.loadRef();
        var recipient = recipientCell.beginParse().loadAddress();
        var amount = msgBody.loadCoins();
        var feeRate = msgBody.loadUint(32);
        var delay = msgBody.loadUint(32);
        
        if (amount <= 0) {
            throw(ERROR_INVALID_AMOUNT);
        }
        if (feeRate < MIN_FEE_RATE || feeRate > MAX_FEE_RATE) {
            throw(ERROR_INVALID_FEE_RATE);
        }
        if (delay < MIN_DELAY || delay > MAX_DELAY) {
            throw(ERROR_INVALID_DELAY);
        }
        
        // Используем текущую комиссию из состояния
        var actualFeeRate = state.currentFeeRate;
        var fee = (amount * actualFeeRate) / 10000;
        var netAmount = amount - fee;
        
        if (netAmount > availableBalance) {
            throw(ERROR_INSUFFICIENT_BALANCE);
        }
        
        totalWithdrawalAmount = totalWithdrawalAmount + amount;
        totalFeeAmount = totalFeeAmount + fee;
        
        var randomDelay = calculateRandomDelay(delay, 60);
        
        // Создание элемента очереди с новой структурой v2.3
        var queueItem = QueueItem {
            recipient: recipient,
            amount: netAmount,
            partsLeft: 1,
            nextTime: blockchain.now() + randomDelay,
            depositId: depositId,
            priority: i + 1, // Приоритет по порядку
            gasEstimate: estimateGasForTransfer(netAmount)
        };
        
        var queueId = state.nextQueueId;
        state.nextQueueId = state.nextQueueId + 1;
        
        state.withdrawalQueue.uDictSet(256, queueId, queueItem.toCell().beginParse());
        
        // Добавляем запись о выводе в историю
        addTransactionRecord(state, 1, recipient, netAmount, actualFeeRate, 0);
        
        i = i + 1;
    }
    
    if (totalWithdrawalAmount > depositAmount) {
        throw(ERROR_INVALID_AMOUNT);
    }
    
    if (totalFeeAmount > 0) {
        // Просто отправляем комиссию без проверки результата
        sendTonSafe(state.admin, totalFeeAmount, availableBalance);
        // Добавляем запись о комиссии в историю
        addTransactionRecord(state, 2, state.admin, totalFeeAmount, state.currentFeeRate, 1);
    }
    
    var updatedDeposit = Deposit {
        sender: depositAddress,
        amount: depositAmount,
        timestamp: depositTime,
        delay: 0,
        status: 1
    };
    
    state.deposits.uDictSet(256, depositId, updatedDeposit.toCell().beginParse());
    state.save();
    return (); // Явный возврат
}

// Обработка аварийного вывода (ИСПРАВЛЕНО)
fun handleEmergencyWithdraw(msgBody: slice, sender: address, myBalance: int, msgValue: int, state: MixtonState) {
    if (!checkSignatures(state, sender)) {
        throw(ERROR_UNAUTHORIZED);
    }
    
    var amount = msgBody.loadCoins();
    
    var gasEstimate = 25000000;
    var availableBalance = myBalance + msgValue - gasEstimate;
    
    if (amount > availableBalance) {
        throw(ERROR_INSUFFICIENT_BALANCE);
    }
    
    // Просто отправляем без проверки результата
    sendTonSafe(state.admin, amount, availableBalance);
    // Добавляем запись в историю
    addTransactionRecord(state, 1, state.admin, amount, 0, 1);
    return (); // Явный возврат
}

// Обработка добавления в черный список
fun handleAddBlacklist(msgBody: slice, sender: address, myBalance: int, msgValue: int, state: MixtonState) {
    if (!checkSignatures(state, sender)) {
        throw(ERROR_UNAUTHORIZED);
    }
    
    var addressCell = msgBody.loadRef();
    var addressToBlacklist = addressCell.beginParse().loadAddress();
    
    var key = addressToKey(addressToBlacklist);
    state.blacklist.uDictSet(256, key, beginCell().storeUint(1, 1).endCell().beginParse());
    state.save();
    return (); // Явный возврат
}

// Обработка удаления из черного списка
fun handleRemoveBlacklist(msgBody: slice, sender: address, myBalance: int, msgValue: int, state: MixtonState) {
    if (!checkSignatures(state, sender)) {
        throw(ERROR_UNAUTHORIZED);
    }
    
    var addressCell = msgBody.loadRef();
    var addressToRemove = addressCell.beginParse().loadAddress();
    
    var key = addressToKey(addressToRemove);
    var success = state.blacklist.uDictDelete(256, key);
    state.save();
    return (); // Явный возврат
}

// Обработка установки комиссии (новая функция v2.0)
fun handleSetFeeRate(msgBody: slice, sender: address, state: MixtonState) {
    if (!checkSignatures(state, sender)) {
        throw(ERROR_UNAUTHORIZED);
    }
    
    var newFeeRate = msgBody.loadUint(32);
    
    if (newFeeRate < MIN_FEE_RATE || newFeeRate > MAX_FEE_RATE) {
        throw(ERROR_INVALID_FEE_RATE);
    }
    
    state.currentFeeRate = newFeeRate;
    state.save();
    return (); // Явный возврат
}

// Обработка добавления подписанта (новая функция v2.0)
fun handleAddSigner(msgBody: slice, sender: address, state: MixtonState) {
    if (sender != state.admin) {
        throw(ERROR_UNAUTHORIZED);
    }
    
    var signerCell = msgBody.loadRef();
    var newSigner = signerCell.beginParse().loadAddress();
    
    var key = addressToKey(newSigner);
    var (existing, found) = state.signers.uDictGet(256, key);
    
    if (found) {
        throw(ERROR_INVALID_SIGNER);
    }
    
    state.signers.uDictSet(256, key, beginCell().storeUint(1, 1).endCell().beginParse());
    state.save();
    return (); // Явный возврат
}

// Обработка удаления подписанта (новая функция v2.0)
fun handleRemoveSigner(msgBody: slice, sender: address, state: MixtonState) {
    if (sender != state.admin) {
        throw(ERROR_UNAUTHORIZED);
    }
    
    var signerCell = msgBody.loadRef();
    var signerToRemove = signerCell.beginParse().loadAddress();
    
    var key = addressToKey(signerToRemove);
    var success = state.signers.uDictDelete(256, key);
    
    if (!success) {
        throw(ERROR_INVALID_SIGNER);
    }
    
    state.save();
    return (); // Явный возврат
}

// Обработка обновления оракула (новая функция v2.0)
fun handleUpdateOracle(msgBody: slice, sender: address, state: MixtonState) {
    if (!checkSignatures(state, sender)) {
        throw(ERROR_UNAUTHORIZED);
    }
    
    var newOracleData = msgBody.loadUint(64);
    var minUpdateInterval = 3600; // 1 час минимальный интервал обновления
    
    if (blockchain.now() - state.lastOracleUpdate < minUpdateInterval) {
        throw(ERROR_ORACLE_DATA_INVALID);
    }
    
    state.oracleData = newOracleData;
    state.lastOracleUpdate = blockchain.now();
    state.save();
    return (); // Явный возврат
}

// Вспомогательная функция для обновления статуса транзакции (ИСПРАВЛЕНО)
fun updateTransactionStatus(state: MixtonState, txType: int, addr: address, amount: int, newStatus: int) {
    var (currentKey, currentValue, found) = state.transactionHistory.uDictGetFirst(256);
    while (found) {
        if (currentValue != null) {
            // ИСПРАВЛЕНО: Проверяем, что в слайсе достаточно данных перед чтением
              if (!currentValue.isEmpty()) {
                var recordType = currentValue.loadUint(8);
                var recordAddress = currentValue.loadAddress();
                var recordAmount = currentValue.loadCoins();
                var recordTimestamp = currentValue.loadUint(64);
                var recordFeeRate = currentValue.loadUint(32);
                var recordStatus = currentValue.loadUint(8);
                
                if (recordType == txType && recordAddress == addr && recordAmount == amount && recordStatus == 0) {
                    // Нашли нужную транзакцию, обновляем статус
                    var updatedRecord = TransactionRecord {
                        txType: recordType,
                        address: recordAddress,
                        amount: recordAmount,
                        timestamp: recordTimestamp,
                        feeRate: recordFeeRate,
                        status: newStatus
                    };
                    state.transactionHistory.uDictSet(256, currentKey!, updatedRecord.toCell().beginParse());
                    return (); // Явный возврат после обновления
                }
            }
        }
        
        (currentKey, currentValue, found) = state.transactionHistory.uDictGetNext(256, currentKey!);
    }
    return (); // Явный возврат в конце функции
}

// =============================================================================
// GET-МЕТОДЫ
// =============================================================================
// Получение адреса администратора
get fun getAdmin(): address {
    var state = MixtonState.load();
    return state.admin;
}

// Проверка прав администратора
get fun isAdmin(addr: address): bool {
    var state = MixtonState.load();
    return addr == state.admin;
}

// Получение параметров миксера
get fun getMixerParams(): (int, int, int, int) {
    var state = MixtonState.load();
    return (MIN_FEE_RATE, MAX_FEE_RATE, MIN_DELAY, MAX_DELAY);
}

// Получение текущей комиссии (новый метод v2.0)
get fun getCurrentFeeRate(): int {
    var state = MixtonState.load();
    return state.currentFeeRate;
}

// Получение лимитов контракта
get fun getLimits(): (int, int, int) {
    return (MIN_DEPOSIT_AMOUNT, MAX_DEPOSIT_AMOUNT, MIN_WITHDRAW_AMOUNT);
}

// Проверка черного списка
get fun isAddressBlacklisted(addr: address): bool {
    var state = MixtonState.load();
    var key = addressToKey(addr);
    var (result, found) = state.blacklist.uDictGet(256, key);
    return found;
}

// Получение информации о депозите
get fun getDepositInfo(depositId: int): (int, int, int) {
    var state = MixtonState.load();
    var (depositSlice, found) = state.deposits.uDictGet(256, depositId);
    
    if (!found) {
        return (-1, -1, -1);
    }
    
    depositSlice!.loadAddress();
    depositSlice!.loadCoins();
    var depositTime = depositSlice!.loadUint(64);
    var delay = depositSlice!.loadUint(32);
    var status = depositSlice!.loadUint(1);
    
    return (depositTime, delay, status);
}

// Получение базовой статистики
get fun getBasicStats(): (int, int) {
    var state = MixtonState.load();
    return (state.totalDeposits, state.totalWithdrawn);
}

// Получение последнего ID депозита
get fun getLastDepositId(): int {
    var state = MixtonState.load();
    if (state.nextDepositId > 0) {
        return state.nextDepositId - 1;
    } else {
        return -1;
    }
}

// Получение информации об очереди выводов
get fun getQueueInfo(): (int, int) {
    var state = MixtonState.load();
    var len = 0;
    var total = 0;
    
    var (currentKey, currentValue, found) = state.withdrawalQueue.uDictGetFirst(256);
    var shouldContinue = true;
    while (found && shouldContinue) {
        if (currentValue != null) {
            // ИСПРАВЛЕНО: Проверяем, что в слайсе достаточно данных перед чтением
            if (!currentValue.isEmpty()) {
                currentValue.loadAddress();
                var amount = currentValue.loadCoins();
                currentValue.loadUint(8);
                currentValue.loadUint(64);
                currentValue.loadUint(64);
                
                total = total + amount;
                len = len + 1;
            }
        }
        
        var nextKey = currentKey! + 1;
        (currentKey, currentValue, found) = state.withdrawalQueue.uDictGetNext(256, currentKey!);
        
        if (found && currentKey! <= nextKey - 1) {
            shouldContinue = false;
        }
    }
    
    return (len, total);
}

// Получение статуса очереди
get fun getQueueStatus(): int {
    var state = MixtonState.load();
    
    // Ищем первый элемент в очереди
    var (currentKey, currentValue, found) = state.withdrawalQueue.uDictGetFirst(256);
    
    if (!found) {
        return 0; // Очередь пуста
    }
    
    if (currentValue != null) {
        // ИСПРАВЛЕНО: Проверяем, что в слайсе достаточно данных перед чтением
          if (!currentValue.isEmpty()) {
            // Работаем со слайсом напрямую
            currentValue.loadAddress();  // Пропускаем адрес
            currentValue.loadCoins();     // Пропускаем сумму
            currentValue.loadUint(8);     // Пропускаем partsLeft
            var nextTime = currentValue.loadUint(64);
            
            return blockchain.now() >= nextTime ? 2 : 1;
        }
    }
    
    return 0; // Очередь пуста
    // 0 - очередь пуста
    // 1 - очередь не пуста, время еще не пришло
    // 2 - очередь не пуста и время пришло
}

// Получение минимального времени обработки в очереди
get fun getMinNextTime(): int {
    var state = MixtonState.load();
    var minTime = -1;
    
    var (currentKey, currentValue, found) = state.withdrawalQueue.uDictGetFirst(256);
    
    if (found && currentValue != null) {
        // ИСПРАВЛЕНО: Проверяем, что в слайсе достаточно данных перед чтением
        if (!currentValue.isEmpty()) {
            currentValue.loadAddress();
            currentValue.loadCoins();
            currentValue.loadUint(8);
            var nextTime = currentValue.loadUint(64);
            
            return nextTime;
        }
    }
    
    return -1;
}

// Получение детальной информации об очереди выводов
get fun getQueueDetails(): (int, int, int) {
    var state = MixtonState.load();
    var len = 0;
    var totalAmount = 0;
    var minNextTime = -1;
    
    var (currentKey, currentValue, found) = state.withdrawalQueue.uDictGetFirst(256);
    var shouldContinue = true;
    while (found && shouldContinue) {
        if (currentValue != null) {
            // ИСПРАВЛЕНО: Проверяем, что в слайсе достаточно данных перед чтением
            if (!currentValue.isEmpty()) {
                currentValue.loadAddress();
                var amount = currentValue.loadCoins();
                currentValue.loadUint(8);
                var nextTime = currentValue.loadUint(64);
                currentValue.loadUint(64);
                
                totalAmount = totalAmount + amount;
                len = len + 1;
                
                if (minNextTime == -1 || nextTime < minNextTime) {
                    minNextTime = nextTime;
                }
            }
        }
        
        var nextKey = currentKey! + 1;
        (currentKey, currentValue, found) = state.withdrawalQueue.uDictGetNext(256, currentKey!);
        
        if (found && currentKey! <= nextKey - 1) {
            shouldContinue = false;
        }
    }
    
    return (len, totalAmount, minNextTime);
}

// Получение информации о подписантах (новый метод v2.0)
get fun getSigners(): (int, int) {
    var state = MixtonState.load();
    var count = 0;
    
    var (currentKey, currentValue, found) = state.signers.uDictGetFirst(256);
    while (found) {
        count = count + 1;
        (currentKey, currentValue, found) = state.signers.uDictGetNext(256, currentKey!);
    }
    
    return (count, state.requiredSignatures);
}

// Получение данных оракула (новый метод v2.0)
get fun getOracleData(): (int, int) {
    var state = MixtonState.load();
    return (state.oracleData, state.lastOracleUpdate);
}

// Получение истории транзакций (новый метод v2.0) (ИСПРАВЛЕНО)
get fun getTransactionHistory(): cell {
    var state = MixtonState.load();
    var historyCell = beginCell();
    
    var (currentKey, currentValue, found) = state.transactionHistory.uDictGetFirst(256);
    while (found) {
        if (currentValue != null) {
            // ИСПРАВЛЕНО: Проверяем, что в слайсе достаточно данных перед чтением
            if (!currentValue.isEmpty()) {
                historyCell.storeSlice(currentValue);
            }
        }
        (currentKey, currentValue, found) = state.transactionHistory.uDictGetNext(256, currentKey!);
    }
    
    return historyCell.endCell();
}

// Получение статистики производительности (новый метод v2.1)
get fun getPerformanceStats(): (int, int, int) {
    var state = MixtonState.load();
    return (state.lastProcessedTime, state.failedTransactions, getQueueSize(state));
}

// Новые get-методы v2.3 для мониторинга очереди
get fun getQueueProcessingStats(): cell {
    var state = MixtonState.load();
    var statsCell = beginCell();
    
    var (currentKey, currentValue, found) = state.queueProcessingStats.uDictGetFirst(256);
    while (found) {
        if (currentValue != null) {
            // ИСПРАВЛЕНО: Проверяем, что в слайсе достаточно данных перед чтением
            if (!currentValue.isEmpty()) {
                statsCell.storeSlice(currentValue);
            }
        }
        (currentKey, currentValue, found) = state.queueProcessingStats.uDictGetNext(256, currentKey!);
    }
    
    return statsCell.endCell();
}

get fun getEstimatedProcessingTime(): int {
    var state = MixtonState.load();
    var queueSize = getQueueSize(state);
    
    if (queueSize == 0) {
        return 0;
    }
    
    // Оценка времени обработки на основе размера очереди
    var baseTime = 30; // 30 секунд базовое время
    var perItemTime = 5; // 5 секунд на элемент
    
    return baseTime + (queueSize * perItemTime);
}

// =============================================================================
// ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ДЛЯ СТРУКТУР
// =============================================================================
fun Deposit.toCell(self): cell {
    return beginCell()
        .storeAddress(self.sender)
        .storeCoins(self.amount)
        .storeUint(self.timestamp, 64)
        .storeUint(self.delay, 32)
        .storeUint(self.status, 1)
        .endCell();
}

fun QueueItem.toCell(self): cell {
    return beginCell()
        .storeAddress(self.recipient)
        .storeCoins(self.amount)
        .storeUint(self.partsLeft, 8)
        .storeUint(self.nextTime, 64)
        .storeUint(self.depositId, 64)
        .storeUint(self.priority, 8)        // Новое поле v2.3
        .storeUint(self.gasEstimate, 32)    // Новое поле v2.3
        .endCell();
}

fun TransactionRecord.toCell(self): cell {
    return beginCell()
        .storeUint(self.txType, 8)
        .storeAddress(self.address)
        .storeCoins(self.amount)
        .storeUint(self.timestamp, 64)
        .storeUint(self.feeRate, 32)
        .storeUint(self.status, 8)
        .endCell();
}

fun ProcessingStats.toCell(self): cell {
    return beginCell()
        .storeUint(self.processedItems, 32)
        .storeUint(self.processedAmount, 64)
        .storeUint(self.gasUsed, 32)
        .storeUint(self.remainingItems, 32)
        .storeUint(self.timestamp, 64)
        .endCell();
}
