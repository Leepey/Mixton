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

// Получение информации об очереди выводов - ИСПРАВЛЕНО
get fun getQueueInfo(): (int, int) {
    var state = MixtonState.load();
    var len = getQueueSize(state);
    var total = 0;
    
    if (len > 0) {
        var (currentKey, currentValue, found) = state.withdrawalQueue.uDictGetFirst(256);
        var shouldContinue = true;
        
        while (found && shouldContinue) {
            if (currentValue != null) {
                try {
                    var valueCopy = currentValue;
                    valueCopy.loadAddress();
                    var amount = valueCopy.loadCoins();
                    valueCopy.loadUint(8);     // partsLeft
                    valueCopy.loadUint(64);    // nextTime
                    valueCopy.loadUint(64);    // depositId
                    valueCopy.loadUint(8);     // priority
                    valueCopy.loadUint(32);    // gasEstimate
                    
                    total = total + amount;
                } catch (_) {
                    // Пропускаем некорректные элементы
                }
            }
            
            var nextKey = currentKey! + 1;
            (currentKey, currentValue, found) = state.withdrawalQueue.uDictGetNext(256, currentKey!);
            
            if (found && currentKey! <= nextKey - 1) {
                shouldContinue = false;
            }
        }
    }
    
    return (len, total);
}

// Получение статуса очереди - ИСПРАВЛЕНО
get fun getQueueStatus(): int {
    var state = MixtonState.load();
    var queueSize = getQueueSize(state);
    
    if (queueSize == 0) {
        return 0; // Очередь пуста
    }
    
    // Ищем первый элемент в очереди
    var (currentKey, currentValue, found) = state.withdrawalQueue.uDictGetFirst(256);
    
    if (found && currentValue != null) {
        try {
            var valueCopy = currentValue;
            valueCopy.loadAddress();  // Пропускаем адрес
            valueCopy.loadCoins();     // Пропускаем сумму
            valueCopy.loadUint(8);     // Пропускаем partsLeft
            var nextTime = valueCopy.loadUint(64);
            
            return blockchain.now() >= nextTime ? 2 : 1;
        } catch (_) {
            return 0; // Если не удалось прочитать, считаем очередь пустой
        }
    }
    
    return 0; // Очередь пуста
}

// Получение минимального времени обработки в очереди - ИСПРАВЛЕНО
get fun getMinNextTime(): int {
    var state = MixtonState.load();
    var minTime = -1;
    
    var (currentKey, currentValue, found) = state.withdrawalQueue.uDictGetFirst(256);
    
    if (found && currentValue != null) {
        try {
            var valueCopy = currentValue;
            valueCopy.loadAddress();
            valueCopy.loadCoins();
            valueCopy.loadUint(8);
            minTime = valueCopy.loadUint(64);
        } catch (_) {
            minTime = -1;
        }
    }
    
    return minTime;
}

// Получение детальной информации об очереди выводов - ИСПРАВЛЕНО
get fun getQueueDetails(): (int, int, int) {
    var state = MixtonState.load();
    var len = getQueueSize(state);
    var totalAmount = 0;
    var minNextTime = -1;
    
    if (len > 0) {
        var (currentKey, currentValue, found) = state.withdrawalQueue.uDictGetFirst(256);
        var shouldContinue = true;
        
        while (found && shouldContinue) {
            if (currentValue != null) {
                try {
                    var valueCopy = currentValue;
                    valueCopy.loadAddress();
                    var amount = valueCopy.loadCoins();
                    valueCopy.loadUint(8);
                    var nextTime = valueCopy.loadUint(64);
                    valueCopy.loadUint(64); // depositId
                    valueCopy.loadUint(8); // priority
                    valueCopy.loadUint(32); // gasEstimate
                    
                    totalAmount = totalAmount + amount;
                    
                    if (minNextTime == -1 || nextTime < minNextTime) {
                        minNextTime = nextTime;
                    }
                } catch (_) {
                    // Пропускаем некорректные элементы
                }
            }
            
            var nextKey = currentKey! + 1;
            (currentKey, currentValue, found) = state.withdrawalQueue.uDictGetNext(256, currentKey!);
            
            if (found && currentKey! <= nextKey - 1) {
                shouldContinue = false;
            }
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

// Получение истории транзакций (новый метод v2.0) - ИСПРАВЛЕНО
get fun getTransactionHistory(): cell {
    var state = MixtonState.load();
    var historyCell = beginCell();
    
    var (currentKey, currentValue, found) = state.transactionHistory.uDictGetFirst(256);
    while (found) {
        if (currentValue != null) {
            try {
                var valueCopy = currentValue;
                var txType = valueCopy.loadUint(8);
                var address = valueCopy.loadAddress();
                var amount = valueCopy.loadCoins();
                var timestamp = valueCopy.loadUint(64);
                var feeRate = valueCopy.loadUint(32);
                var status = valueCopy.loadUint(8);
                
                var record = TransactionRecord {
                    txType: txType,
                    address: address,
                    amount: amount,
                    timestamp: timestamp,
                    feeRate: feeRate,
                    status: status
                };
                
                historyCell.storeSlice(record.toCell().beginParse());
            } catch (_) {
                // Пропускаем некорректные записи
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

// Новые get-методы v2.3 для мониторинга очереди - ИСПРАВЛЕНО
get fun getQueueProcessingStats(): cell {
    var state = MixtonState.load();
    var statsCell = beginCell();
    
    var (currentKey, currentValue, found) = state.queueProcessingStats.uDictGetFirst(256);
    while (found) {
        if (currentValue != null) {
            try {
                var valueCopy = currentValue;
                var processedItems = valueCopy.loadUint(32);
                var processedAmount = valueCopy.loadUint(64);
                var gasUsed = valueCopy.loadUint(32);
                var remainingItems = valueCopy.loadUint(32);
                var timestamp = valueCopy.loadUint(64);
                
                var stats = ProcessingStats {
                    processedItems: processedItems,
                    processedAmount: processedAmount,
                    gasUsed: gasUsed,
                    remainingItems: remainingItems,
                    timestamp: timestamp
                };
                
                statsCell.storeSlice(stats.toCell().beginParse());
            } catch (_) {
                // Пропускаем некорректные записи
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