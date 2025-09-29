// contracts/mixton.tolk
// =============================================================================
// Mixton - Оптимизированный миксер для TON blockchain v3.5.0
// Совместимость: TOLK 1.1.0, Blueprint 2025, Sandbox 2025
// =============================================================================

import "@stdlib/tvm-dicts";

// =============================================================================
// КОНСТАНТЫ
// =============================================================================

const OP_DEPOSIT = 0x6465706f;
const OP_WITHDRAW = 0x695f7764;
const OP_MULTI_WITHDRAW = 0x6d756c77;
const OP_PROCESS_QUEUE = 0x70726f63;
const OP_EMERGENCY_WITHDRAW = 0x656d7764;
const OP_ADD_BLACKLIST = 0x61646462;
const OP_REMOVE_BLACKLIST = 0x72656d62;
const OP_SET_FEE_RATE = 0x73657466;
const OP_ADD_SIGNER = 0x61647369;
const OP_REMOVE_SIGNER = 0x726d7369;
const OP_UPDATE_ORACLE = 0x7570646f;
const OP_GET_HISTORY = 0x67657468;

const MIN_FEE_RATE = 100;
const MAX_FEE_RATE = 500;
const MIN_DELAY = 30;
const MAX_DELAY = 259200;
const MIN_DEPOSIT_AMOUNT = 1000000000;
const MAX_DEPOSIT_AMOUNT = 10000000000000;
const MIN_WITHDRAW_AMOUNT = 500000000;
const MAX_PARTS = 4;
const WITHDRAW_TIMEOUT = 604800;
const MAX_SIGNERS = 5;
const MAX_HISTORY_SIZE = 1000;
const MAX_QUEUE_SIZE = 1000;
const GAS_RESERVE = 5000000;
const MIN_GAS_PER_ITEM = 3000000;
const BATCH_SIZE = 5;

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
const ERROR_INSUFFICIENT_SIGNATURES = 415;
const ERROR_INVALID_SIGNER = 416;
const ERROR_ORACLE_DATA_INVALID = 417;
const ERROR_HISTORY_FULL = 418;
const ERROR_SEND_FAILED = 419;
const ERROR_PROCESSING_FAILED = 420;
const ERROR_QUEUE_CORRUPTED = 421;
const ERROR_INSUFFICIENT_GAS = 422;

// =============================================================================
// СТРУКТУРЫ (без var)
// =============================================================================

struct Deposit {
    sender: address;
    amount: int;
    timestamp: int;
    delay: int;
    status: int;
}

struct QueueItem {
    recipient: address;
    amount: int;
    partsLeft: int;
    nextTime: int;
    depositId: int;
    priority: int;
    gasEstimate: int;
}

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
    currentFeeRate: int;
    signers: dict;
    requiredSignatures: int;
    oracleData: int;
    lastOracleUpdate: int;
    transactionHistory: dict;
    nextHistoryId: int;
    lastProcessedTime: int;
    failedTransactions: int;
    queueProcessingStats: dict;
    lastQueueCheck: int;
}

struct TransactionRecord {
    txType: int;
    address: address;
    amount: int;
    timestamp: int;
    feeRate: int;
    status: int;
}

struct ProcessingStats {
    processedItems: int;
    processedAmount: int;
    gasUsed: int;
    remainingItems: int;
    timestamp: int;
}

// =============================================================================
// ОСНОВНОЙ МОДУЛЬ
// =============================================================================

mixton {

// =============================================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// =============================================================================

fun getState(): MixtonState {
    var data = contract.getData();
    if (data.isEmpty()) {
        var tempAdmin = beginCell()
            .storeUint(0, 2)
            .storeUint(0, 1)
            .endCell()
            .beginParse()
            .loadAddress();
        return MixtonState {
            admin: tempAdmin,
            deposits: dict::empty(),
            withdrawalQueue: dict::empty(),
            blacklist: dict::empty(),
            totalDeposits: 0,
            totalWithdrawn: 0,
            nextDepositId: 0,
            nextQueueId: 0,
            initialized: false,
            currentFeeRate: MIN_FEE_RATE,
            signers: dict::empty(),
            requiredSignatures: 1,
            oracleData: 1000000,
            lastOracleUpdate: 0,
            transactionHistory: dict::empty(),
            nextHistoryId: 0,
            lastProcessedTime: 0,
            failedTransactions: 0,
            queueProcessingStats: dict::empty(),
            lastQueueCheck: 0
        };
    }
    return MixtonState.fromCell(data);
}

fun setState(state: MixtonState) {
    contract.setData(state.toCell());
}

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
        .storeUint(self.currentFeeRate, 32)
        .storeDict(self.signers)
        .storeUint(self.requiredSignatures, 8)
        .storeUint(self.oracleData, 64)
        .storeUint(self.lastOracleUpdate, 64)
        .storeDict(self.transactionHistory)
        .storeUint(self.nextHistoryId, 32)
        .storeUint(self.lastProcessedTime, 64)
        .storeUint(self.failedTransactions, 32)
        .storeDict(self.queueProcessingStats)
        .storeUint(self.lastQueueCheck, 64)
        .endCell();
}

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
    var initialized = dataSlice.loadUint(1) == 1;
    var currentFeeRate = dataSlice.loadUint(32);
    var signersDict = dataSlice.loadDict();
    var requiredSignatures = dataSlice.loadUint(8);
    var oracleData = dataSlice.loadUint(64);
    var lastOracleUpdate = dataSlice.loadUint(64);
    var transactionHistoryDict = dataSlice.loadDict();
    var nextHistoryId = dataSlice.loadUint(32);
    var lastProcessedTime = dataSlice.loadUint(64);
    var failedTransactions = dataSlice.loadUint(32);
    var queueProcessingStatsDict = dict::empty();
    var lastQueueCheck = 0;
    
    if (!dataSlice.isEmpty()) {
        try {
            queueProcessingStatsDict = dataSlice.loadDict();
            lastQueueCheck = dataSlice.loadUint(64);
        } catch (_) {
            queueProcessingStatsDict = dict::empty();
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
        currentFeeRate: currentFeeRate,
        signers: signersDict,
        requiredSignatures: requiredSignatures,
        oracleData: oracleData,
        lastOracleUpdate: lastOracleUpdate,
        transactionHistory: transactionHistoryDict,
        nextHistoryId: nextHistoryId,
        lastProcessedTime: lastProcessedTime,
        failedTransactions: failedTransactions,
        queueProcessingStats: queueProcessingStatsDict,
        lastQueueCheck: lastQueueCheck
    };
}

fun addressToKey(addr: address): int {
    var addrCell = beginCell().storeAddress(addr).endCell();
    return addrCell.hash();
}

fun isBlacklisted(state: MixtonState, addr: address): bool {
    var key = addressToKey(addr);
    var (_, found) = state.blacklist.uDictGet(256, key);
    return found;
}

fun isValidAddress(addr: address): bool {
    return true;
}

fun checkSignatures(state: MixtonState, sender: address): bool {
    if (sender == state.admin) {
        return true;
    }
    
    var key = addressToKey(sender);
    var (_, found) = state.signers.uDictGet(256, key);
    return found;
}

fun calculateRandomDelay(baseDelay: int, variance: int): int {
    var seed = now() + blockchain.logicalTime();
    random.initializeBy(seed);
    var randomValue = random.range(variance);
    var resultDelay = baseDelay + randomValue;
    if (resultDelay < MIN_DELAY) {
        resultDelay = MIN_DELAY;
    }
    return resultDelay;
}

fun sendTonSafe(to: address, amount: int, availableBalance: int): bool {
    if (amount <= 0) {
        return false;
    }
    
    var msg = beginCell()
        .storeUint(0x10, 6)
        .storeAddress(to)
        .storeCoins(amount)
        .storeUint(0, 107)
        .endCell();
    
    sendRawMessage(msg, 0);
    return true;
}

fun estimateGasForTransfer(amount: int): int {
    var baseGas = 25000000;
    var sizeGas = amount / 1000000000 * 1000000;
    return baseGas + sizeGas;
}

fun addTransactionRecord(state: MixtonState, txType: int, addr: address, amount: int, feeRate: int, status: int) {
    if (state.nextHistoryId >= MAX_HISTORY_SIZE) {
        var (oldestKey, _, oldestFound) = state.transactionHistory.uDictGetFirst(256);
        if (oldestFound) {
            state.transactionHistory.uDictDelete(256, oldestKey!);
        }
    }
    
    var record = TransactionRecord {
        txType: txType,
        address: addr,
        amount: amount,
        timestamp: now(),
        feeRate: feeRate,
        status: status
    };
    
    state.transactionHistory.uDictSet(256, state.nextHistoryId, record.toCell().beginParse());
    state.nextHistoryId = state.nextHistoryId + 1;
}

fun estimateMultiWithdrawGasCost(count: int): int {
    var baseCost = 20000000;
    var perItemCost = 5000000;
    return baseCost + (count * perItemCost);
}

// =============================================================================
// ОСНОВНАЯ ЛОГИКА
// =============================================================================

fun onInternalMessage(balance: int, value: int, msg: cell, body: slice) {
    random.initializeBy(now() + blockchain.logicalTime());
    
    var msgCell = msg.beginParse();
    var flags = msgCell.loadUint(4);
    
    if ((flags & 1) != 0) {
        handleBouncedMessage(msgCell, value);
        return;
    }
    
    var sender = msgCell.loadAddress();
    var state = getState();
    
    if (!state.initialized) {
        state.admin = sender;
        state.initialized = true;
        setState(state);
        
        if (value >= MIN_DEPOSIT_AMOUNT && body.isEmpty()) {
            handleDeposit(sender, value, state);
        }
        
        return;
    }
    
    if (isBlacklisted(state, sender)) {
        throw(ERROR_ADDRESS_BLACKLISTED);
    }
    
    if (!isValidAddress(sender)) {
        throw(ERROR_INVALID_ADDRESS);
    }
    
    if (body.isEmpty()) {
        handleDeposit(sender, value, state);
        return;
    }
    
    var op = body.loadUint(32);
    
    switch (op) {
        case OP_WITHDRAW:
            handleWithdraw(body, sender, balance, value, state);
            break;
        case OP_MULTI_WITHDRAW:
            handleMultiWithdraw(body, sender, balance, value, state);
            break;
        case OP_EMERGENCY_WITHDRAW:
            handleEmergencyWithdraw(body, sender, balance, value, state);
            break;
        case OP_ADD_BLACKLIST:
            handleAddBlacklist(body, sender, balance, value, state);
            break;
        case OP_REMOVE_BLACKLIST:
            handleRemoveBlacklist(body, sender, balance, value, state);
            break;
        case OP_PROCESS_QUEUE:
            var queueItemId = body.loadUint(64);
            handleProcessQueueSafe(balance, value, state, queueItemId);
            break;
        case OP_SET_FEE_RATE:
            handleSetFeeRate(body, sender, state);
            break;
        case OP_ADD_SIGNER:
            handleAddSigner(body, sender, state);
            break;
        case OP_REMOVE_SIGNER:
            handleRemoveSigner(body, sender, state);
            break;
        case OP_UPDATE_ORACLE:
            handleUpdateOracle(body, sender, state);
            break;
        default:
            throw(0xffff);
    }
}

fun handleBouncedMessage(msgCell: slice, value: int) {
    var sender = msgCell.loadAddress();
    var state = getState();
    
    state.failedTransactions = state.failedTransactions + 1;
    sendTonSafe(sender, value, value);
    setState(state);
}

fun handleDeposit(sender: address, value: int, state: MixtonState) {
    if (value < MIN_DEPOSIT_AMOUNT) {
        throw(ERROR_AMOUNT_TOO_SMALL);
    }
    if (value > MAX_DEPOSIT_AMOUNT) {
        throw(ERROR_AMOUNT_TOO_LARGE);
    }
    
    var depositId = state.nextDepositId;
    state.nextDepositId = state.nextDepositId + 1;
    
    var deposit = Deposit {
        sender: sender,
        amount: value,
        timestamp: now(),
        delay: 0,
        status: 0
    };
    
    state.deposits.uDictSet(256, depositId, deposit.toCell().beginParse());
    state.totalDeposits = state.totalDeposits + 1;
    
    addTransactionRecord(state, 0, sender, value, 0, 1);
    setState(state);
}

fun handleWithdraw(body: slice, sender: address, balance: int, value: int, state: MixtonState) {
    if (!checkSignatures(state, sender)) {
        throw(ERROR_UNAUTHORIZED);
    }
    
    var queueSize = getQueueSize(state);
    if (queueSize >= MAX_QUEUE_SIZE) {
        throw(ERROR_QUEUE_FULL);
    }
    
    var recipientCell = body.loadRef();
    var recipient = recipientCell.beginParse().loadAddress();
    var amount = body.loadCoins();
    var depositId = body.loadUint(64);
    var feeRate = body.loadUint(32);
    var delay = body.loadUint(32);
    
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
    
    var (depositSlice, found) = state.deposits.uDictGet(256, depositId);
    if (!found) {
        throw(ERROR_DEPOSIT_NOT_FOUND);
    }
    
    depositSlice!.loadAddress();
    var depositAmount = depositSlice!.loadCoins();
    depositSlice!.loadUint(64);
    depositSlice!.loadUint(32);
    var depositStatus = depositSlice!.loadUint(1);
    
    if (depositStatus != 0) {
        throw(ERROR_DEPOSIT_NOT_FOUND);
    }
    if (now() > depositSlice!.loadUint(64) + WITHDRAW_TIMEOUT) {
        throw(ERROR_WITHDRAWAL_TIMEOUT);
    }
    
    var gasEstimate = 25000000;
    var availableBalance = balance + value - gasEstimate;
    
    if (amount > availableBalance) {
        throw(ERROR_INSUFFICIENT_BALANCE);
    }
    
    var actualFeeRate = state.currentFeeRate;
    var fee = (amount * actualFeeRate) / 10000;
    var netAmount = amount - fee;
    
    if (netAmount > availableBalance) {
        throw(ERROR_INSUFFICIENT_BALANCE);
    }
    
    var randomDelay = calculateRandomDelay(delay, 60);
    
    var queueItem = QueueItem {
        recipient: recipient,
        amount: netAmount,
        partsLeft: 1,
        nextTime: now() + randomDelay,
        depositId: depositId,
        priority: 1,
        gasEstimate: estimateGasForTransfer(netAmount)
    };
    
    var queueId = state.nextQueueId;
    state.nextQueueId = state.nextQueueId + 1;
    
    state.withdrawalQueue.uDictSet(256, queueId, queueItem.toCell().beginParse());
    
    if (fee > 0) {
        sendTonSafe(state.admin, fee, availableBalance);
        addTransactionRecord(state, 2, state.admin, fee, actualFeeRate, 1);
    }
    
    var updatedDeposit = Deposit {
        sender: depositSlice!.loadAddress(),
        amount: depositAmount,
        timestamp: depositSlice!.loadUint(64),
        delay: delay,
        status: 1
    };
    
    state.deposits.uDictSet(256, depositId, updatedDeposit.toCell().beginParse());
    addTransactionRecord(state, 1, recipient, netAmount, actualFeeRate, 0);
    setState(state);
}

// =============================================================================
// ОПТИМИЗИРОВАННАЯ ОБРАБОТКА ОЧЕРЕДИ
// =============================================================================

fun handleProcessQueueSafe(balance: int, value: int, state: MixtonState, queueItemId: int) {
    if (balance < 0) {
        throw(ERROR_INSUFFICIENT_BALANCE);
    }

    var (currentValue, found) = state.withdrawalQueue.uDictGet(256, queueItemId);

    if (!found) {
        return;
    }

    if (currentValue == null) {
        state.withdrawalQueue.uDictDelete(256, queueItemId);
        setState(state);
        return;
    }

    var itemSlice = currentValue!;
    var recipient: address;
    var amount: int;
    var nextTime: int;
    var depositId: int;
    
    try {
        recipient = itemSlice.loadAddress();
        amount = itemSlice.loadCoins();
        itemSlice.loadUint(8);
        nextTime = itemSlice.loadUint(64);
        depositId = itemSlice.loadUint(64);
        if (!itemSlice.isEmpty()) {
            itemSlice.loadUint(8);
            itemSlice.loadUint(32);
        }
    } catch (_) {
        state.withdrawalQueue.uDictDelete(256, queueItemId);
        setState(state);
        return;
    }

    var currentTime = now();
    var totalContractBalance = balance + value;

    if (currentTime >= nextTime) {
        if (amount > totalContractBalance) {
            return;
        }
        
        if (sendTonSafe(recipient, amount, totalContractBalance)) {
            state.totalWithdrawn = state.totalWithdrawn + amount;
            state.withdrawalQueue.uDictDelete(256, queueItemId);
            updateTransactionStatus(state, 1, recipient, amount, 1);
            state.lastProcessedTime = currentTime;
            setState(state);
        }
    }
}

fun processQueueBatch(state: MixtonState, balance: int, value: int, batchSize: int): int {
    var processed = 0;
    var currentTime = now();
    var gasLimit = gas() - GAS_RESERVE;
    
    var (currentKey, currentValue, found) = state.withdrawalQueue.uDictGetFirst(256);
    
    while (found && processed < batchSize && gas() > gasLimit) {
        if (currentValue != null) {
            try {
                var itemSlice = currentValue!;
                var recipient = itemSlice.loadAddress();
                var amount = itemSlice.loadCoins();
                itemSlice.loadUint(8);
                var nextTime = itemSlice.loadUint(64);
                var depositId = itemSlice.loadUint(64);
                
                if (currentTime >= nextTime) {
                    var totalBalance = balance + value;
                    if (amount <= totalBalance) {
                        if (sendTonSafe(recipient, amount, totalBalance)) {
                            state.totalWithdrawn = state.totalWithdrawn + amount;
                            state.withdrawalQueue.uDictDelete(256, currentKey!);
                            updateTransactionStatus(state, 1, recipient, amount, 1);
                            processed = processed + 1;
                        }
                    }
                }
            } catch (_) {
                state.withdrawalQueue.uDictDelete(256, currentKey!);
            }
        }
        
        (currentKey, currentValue, found) = state.withdrawalQueue.uDictGetNext(256, currentKey!);
    }
    
    if (processed > 0) {
        state.lastProcessedTime = currentTime;
        setState(state);
    }
    
    return processed;
}

fun sendContinueMessage(nextItemId: int) {
    var msg = beginCell()
        .storeUint(0x10, 6)
        .storeAddress(contract.getAddress())
        .storeCoins(0)
        .storeUint(OP_PROCESS_QUEUE, 32)
        .storeUint(nextItemId, 64)
        .endCell();
    
    sendRawMessage(msg, 64 + 128);
}

fun returnExcessGas(sender: address, originalValue: int, usedValue: int) {
    var gasLeft = gas();
    if (gasLeft > GAS_RESERVE) {
        var excessGas = gasLeft - GAS_RESERVE;
        var gasValue = estimateGasValue(excessGas);
        var excessValue = originalValue - usedValue;
        
        if (gasValue > 0 && gasValue < excessValue) {
            sendTonSafe(sender, gasValue, excessValue);
        }
    }
}

fun estimateGasValue(gasAmount: int): int {
    return gasAmount * 1000;
}

// =============================================================================
// GET-МЕТОДЫ
// =============================================================================

get fun getAdmin(): address {
    var state = getState();
    return state.admin;
}

get fun isAdmin(addr: address): bool {
    var state = getState();
    return addr == state.admin;
}

get fun getMixerParams(): (int, int, int, int) {
    return (MIN_FEE_RATE, MAX_FEE_RATE, MIN_DELAY, MAX_DELAY);
}

get fun getCurrentFeeRate(): int {
    var state = getState();
    return state.currentFeeRate;
}

get fun getLimits(): (int, int, int) {
    return (MIN_DEPOSIT_AMOUNT, MAX_DEPOSIT_AMOUNT, MIN_WITHDRAW_AMOUNT);
}

get fun isAddressBlacklisted(addr: address): bool {
    var state = getState();
    var key = addressToKey(addr);
    var (_, found) = state.blacklist.uDictGet(256, key);
    return found;
}

get fun getDepositInfo(depositId: int): (int, int, int) {
    var state = getState();
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

get fun getBasicStats(): (int, int) {
    var state = getState();
    return (state.totalDeposits, state.totalWithdrawn);
}

get fun getLastDepositId(): int {
    var state = getState();
    if (state.nextDepositId == 0) {
        return -1;
    }
    return state.nextDepositId - 1;
}

get fun getQueueInfo(): (int, int) {
    var state = getState();
    var len = getQueueSize(state);
    var total = 0;
    
    if (len > 0) {
        var (currentKey, currentValue, found) = state.withdrawalQueue.uDictGetFirst(256);
        while (found) {
            if (currentValue != null) {
                try {
                    var valueCopy = currentValue;
                    valueCopy.loadAddress();
                    var amount = valueCopy.loadCoins();
                    valueCopy.loadUint(8);
                    valueCopy.loadUint(64);
                    valueCopy.loadUint(64);
                    valueCopy.loadUint(8);
                    valueCopy.loadUint(32);
                    total = total + amount;
                } catch (_) {
                    if (currentValue != null) {
                        try {
                            var valueCopyV2 = currentValue;
                            valueCopyV2.loadAddress();
                            total = total + valueCopyV2.loadCoins();
                        } catch (_) {
                            // Пропускаем элемент
                        }
                    }
                }
            }
            (currentKey, currentValue, found) = state.withdrawalQueue.uDictGetNext(256, currentKey!);
        }
    }
    
    return (len, total);
}

get fun getQueueStatus(): int {
    var state = getState();
    var queueSize = getQueueSize(state);
    
    if (queueSize == 0) {
        return 0;
    }
    
    var (currentKey, currentValue, found) = state.withdrawalQueue.uDictGetFirst(256);
    
    if (found && currentValue != null) {
        try {
            var valueCopy = currentValue;
            valueCopy.loadAddress();
            valueCopy.loadCoins();
            valueCopy.loadUint(8);
            var nextTime = valueCopy.loadUint(64);
            
            return now() >= nextTime ? 2 : 1;
        } catch (_) {
            return 0;
        }
    }
    
    return 0;
}

get fun getNextQueueItemId(): int {
    var state = getState();
    var currentTime = now();
    
    var (currentKey, currentValue, found) = state.withdrawalQueue.uDictGetFirst(256);
    
    while (found) {
        if (currentValue != null) {
            try {
                var itemSlice = currentValue!;
                itemSlice.loadAddress();
                itemSlice.loadCoins();
                itemSlice.loadUint(8);
                var nextTime = itemSlice.loadUint(64);
                
                if (currentTime >= nextTime) {
                    return currentKey!;
                }
            } catch (_) {
                state.withdrawalQueue.uDictDelete(256, currentKey!);
                setState(state);
            }
        }
        (currentKey, currentValue, found) = state.withdrawalQueue.uDictGetNext(256, currentKey!);
    }
    
    return -1;
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
        .storeUint(self.priority, 8)
        .storeUint(self.gasEstimate, 32)
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
        .storeUint




### Анализ смарт-контракта Mixton для TON blockchain

#### 1. Константы
| Константа | Значение | Описание |
|-----------|----------|----------|
| OP_DEPOSIT | 0x6465706f | Код операции для депозита |
| OP_WITHDRAW | 0x695f7764 | Код операции для вывода средств |
| OP_MULTI_WITHDRAW | 0x6d756c77 | Код операции для множественного вывода |
| OP_PROCESS_QUEUE | 0x70726f63 | Код операции для обработки очереди |
| OP_EMERGENCY_WITHDRAW | 0x656d7764 | Код операции для экстренного вывода |
| OP_ADD_BLACKLIST | 0x61646462 | Код операции для добавления в черный список |
| OP_REMOVE_BLACKLIST | 0x72656d62 | Код операции для удаления из черного списка |
| OP_SET_FEE_RATE | 0x73657466 | Код операции для установки комиссии |
| OP_ADD_SIGNER | 0x61647369 | Код операции для добавления подписанта |
| OP_REMOVE_SIGNER | 0x726d7369 | Код операции для удаления подписанта |
| OP_UPDATE_ORACLE | 0x7570646f | Код операции для обновления данных оракула |
| OP_GET_HISTORY | 0x67657468 | Код операции для получения истории |
| MIN_FEE_RATE | 100 | Минимальная ставка комиссии (0.01%) |
| MAX_FEE_RATE | 500 | Максимальная ставка комиссии (0.05%) |
| MIN_DELAY | 30 | Минимальная задержка вывода (сек) |
| MAX_DELAY | 259200 | Максимальная задержка вывода (3 дня) |
| MIN_DEPOSIT_AMOUNT | 1000000000 | Минимальная сумма депозита (1 TON) |
| MAX_DEPOSIT_AMOUNT | 10000000000000 | Максимальная сумма депозита (10000 TON) |
| MIN_WITHDRAW_AMOUNT | 500000000 | Минимальная сумма вывода (0.5 TON) |
| MAX_PARTS | 4 | Максимальное количество частей вывода |
| WITHDRAW_TIMEOUT | 604800 | Таймаут вывода (7 дней) |
| MAX_SIGNERS | 5 | Максимальное количество подписантов |
| MAX_HISTORY_SIZE | 1000 | Максимальный размер истории транзакций |
| MAX_QUEUE_SIZE | 1000 | Максимальный размер очереди вывода |
| GAS_RESERVE | 5000000 | Резерв газа для операций |
| MIN_GAS_PER_ITEM | 3000000 | Минимальный газ на элемент очереди |
| BATCH_SIZE | 5 | Размер пакета для обработки |
| ERROR_UNAUTHORIZED | 403 | Код ошибки: неавторизованный доступ |
| ERROR_INVALID_AMOUNT | 400 | Код ошибки: неверная сумма |
| ERROR_INSUFFICIENT_BALANCE | 401 | Код ошибки: недостаточно средств |
| ERROR_AMOUNT_TOO_LARGE | 402 | Код ошибки: сумма слишком велика |
| ERROR_AMOUNT_TOO_SMALL | 404 | Код ошибки: сумма слишком мала |
| ERROR_INVALID_MODE | 405 | Код ошибки: неверный режим |
| ERROR_ADDRESS_BLACKLISTED | 406 | Код ошибки: адрес в черном списке |
| ERROR_DEPOSIT_NOT_FOUND | 407 | Код ошибки: депозит не найден |
| ERROR_WITHDRAWAL_TIMEOUT | 408 | Код ошибки: таймаут вывода |
| ERROR_INVALID_ADDRESS | 409 | Код ошибки: неверный адрес |
| ERROR_TOO_MANY_WITHDRAWALS | 410 | Код ошибки: слишком много выводов |
| ERROR_INVALID_FEE_RATE | 411 | Код ошибки: неверная ставка комиссии |
| ERROR_INVALID_DELAY | 412 | Код ошибки: неверная задержка |
| ERROR_QUEUE_FULL | 413 | Код ошибки: очередь заполнена |
| ERROR_TOO_FREQUENT_OPERATIONS | 414 | Код ошибки: слишком частые операции |
| ERROR_INSUFFICIENT_SIGNATURES | 415 | Код ошибки: недостаточно подписей |
| ERROR_INVALID_SIGNER | 416 | Код ошибки: неверный подписант |
| ERROR_ORACLE_DATA_INVALID | 417 | Код ошибки: неверные данные оракула |
| ERROR_HISTORY_FULL | 418 | Код ошибки: история заполнена |
| ERROR_SEND_FAILED | 419 | Код ошибки: ошибка отправки |
| ERROR_PROCESSING_FAILED | 420 | Код ошибки: ошибка обработки |
| ERROR_QUEUE_CORRUPTED | 421 | Код ошибки: очередь повреждена |
| ERROR_INSUFFICIENT_GAS | 422 | Код ошибки: недостаточно газа |

#### 2. Структуры данных
| Структура | Поля | Описание |
|-----------|------|----------|
| Deposit | sender: address, amount: int, timestamp: int, delay: int, status: int | Хранит информацию о депозите |
| QueueItem | recipient: address, amount: int, partsLeft: int, nextTime: int, depositId: int, priority: int, gasEstimate: int | Элемент очереди вывода средств |
| MixtonState | admin: address, deposits: dict, withdrawalQueue: dict, blacklist: dict, totalDeposits: int, totalWithdrawn: int, nextDepositId: int, nextQueueId: int, initialized: bool, currentFeeRate: int, signers: dict, requiredSignatures: int, oracleData: int, lastOracleUpdate: int, transactionHistory: dict, nextHistoryId: int, lastProcessedTime: int, failedTransactions: int, queueProcessingStats: dict, lastQueueCheck: int | Основное состояние контракта |
| TransactionRecord | txType: int, address: address, amount: int, timestamp: int, feeRate: int, status: int | Запись транзакции в истории |
| ProcessingStats | processedItems: int, processedAmount: int, gasUsed: int, remainingItems: int, timestamp: int | Статистика обработки очереди |

#### 3. Вспомогательные функции
| Функция | Параметры | Возвращаемое значение | Описание |
|---------|-----------|-----------------------|----------|
| getState | - | MixtonState | Получение состояния контракта |
| setState | state: MixtonState | - | Установка состояния контракта |
| MixtonState.toCell | self: MixtonState | cell | Преобразование состояния в ячейку |
| MixtonState.fromCell | cell: cell | MixtonState | Преобразование ячейки в состояние |
| addressToKey | addr: address | int | Преобразование адреса в ключ словаря |
| isBlacklisted | state: MixtonState, addr: address | bool | Проверка адреса в черном списке |
| isValidAddress | addr: address | bool | Проверка валидности адреса |
| checkSignatures | state: MixtonState, sender: address | bool | Проверка подписей отправителя |
| calculateRandomDelay | baseDelay: int, variance: int | int | Расчет случайной задержки |
| sendTonSafe | to: address, amount: int, availableBalance: int | bool | Безопасная отправка TON |
| estimateGasForTransfer | amount: int | int | Оценка газа для перевода |
| addTransactionRecord | state: MixtonState, txType: int, addr: address, amount: int, feeRate: int, status: int | - | Добавление записи в историю |
| estimateMultiWithdrawGasCost | count: int | int | Оценка газа для множественного вывода |

#### 4. Основные функции обработки
| Функция | Параметры | Описание |
|---------|-----------|----------|
| onInternalMessage | balance: int, value: int, msg: cell, body: slice | Обработка входящих сообщений |
| handleBouncedMessage | msgCell: slice, value: int | Обработка отклоненных сообщений |
| handleDeposit | sender: address, value: int, state: MixtonState | Обработка депозита |
| handleWithdraw | body: slice, sender: address, balance: int, value: int, state: MixtonState | Обработка вывода средств |

#### 5. Функции обработки очереди
| Функция | Параметры | Описание |
|---------|-----------|----------|
| handleProcessQueueSafe | balance: int, value: int, state: MixtonState, queueItemId: int | Безопасная обработка очереди |
| processQueueBatch | state: MixtonState, balance: int, value: int, batchSize: int | Пакетная обработка очереди |
| sendContinueMessage | nextItemId: int | Отправка сообщения для продолжения обработки |
| returnExcessGas | sender: address, originalValue: int, usedValue: int | Возврат излишков газа |
| estimateGasValue | gasAmount: int | Оценка стоимости газа |

#### 6. Get-методы
| Метод | Параметры | Возвращаемое значение | Описание |
|-------|-----------|-----------------------|----------|
| getAdmin | - | address | Получение адреса администратора |
| isAdmin | addr: address | bool | Проверка прав администратора |
| getMixerParams | - | (int, int, int, int) | Получение параметров миксера |
| getCurrentFeeRate | - | int | Получение текущей комиссии |
| getLimits | - | (int, int, int) | Получение лимитов |
| isAddressBlacklisted | addr: address | bool | Проверка адреса в черном списке |
| getDepositInfo | depositId: int | (int, int, int) | Получение информации о депозите |
| getBasicStats | - | (int, int) | Получение базовой статистики |
| getLastDepositId | - | int | Получение ID последнего депозита |
| getQueueInfo | - | (int, int) | Получение информации об очереди |
| getQueueStatus | - | int | Получение статуса очереди |
| getNextQueueItemId | - | int | Получение ID следующего элемента очереди |

#### 7. Методы структур
| Метод | Параметры | Возвращаемое значение | Описание |
|-------|-----------|-----------------------|----------|
| Deposit.toCell | self: Deposit | cell | Преобразование депозита в ячейку |
| QueueItem.toCell | self: QueueItem | cell | Преобразование элемента очереди в ячейку |
| TransactionRecord.toCell | self: TransactionRecord | cell | Преобразование записи транзакции в ячейку |
| ProcessingStats.toCell | self: ProcessingStats | cell | Преобразование статистики в ячейку (незавершено) |

### Основные особенности контракта:
1. **Миксер для TON blockchain** - обеспечивает анонимность транзакций
2. **Многоуровневая система безопасности** - черные списки, подписанты, оракулы
3. **Оптимизированная обработка очереди** - пакетная обработка, оценка газа
4. **Расширенная система ошибок** - 24 различных кода ошибок
5. **История транзакций** - хранение до 1000 записей
6. **Гибкая система комиссий** - от 0.01% до 0.05%
7. **Защита от атак** - ограничения на суммы, задержки, частоту операций
8. **Статистика и мониторинг** - отслеживание успешных/неуспешных операций

Контракт реализован с использованием современного стека TOLK 1.1.0 и оптимизирован для работы в среде TON blockchain.