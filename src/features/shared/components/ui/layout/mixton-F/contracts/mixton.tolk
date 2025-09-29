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


