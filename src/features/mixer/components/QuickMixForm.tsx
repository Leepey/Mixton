// src/features/mixer/components/QuickMixForm.tsx
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Alert,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  Tooltip,
  Collapse,
  CircularProgress
} from '@mui/material';
import { Wallet, AccountBalance, Shuffle, Info, ExpandMore, ExpandLess, Send } from '@mui/icons-material';
import { motion } from 'framer-motion';
import type { SelectChangeEvent } from '@mui/material';
import type { MixPool } from '../../mixer/components/'; // Импортируем тип из файла типов

interface QuickMixFormProps {
  amount: string;
  amountError: string;
  transactionPending: boolean;
  selectedPool?: string;
  availablePools: MixPool[]; // Теперь используем импортированный тип
  onAmountChange: (value: string) => void;
  onPoolChange?: (poolId: string) => void;
  onSubmit: () => void;
  onConnect: () => void;
  onDisconnect: () => void;
  userConnected: boolean;
  userBalance?: string;
}

const QuickMixForm: React.FC<QuickMixFormProps> = ({
  amount,
  amountError,
  transactionPending,
  selectedPool,
  availablePools,
  onAmountChange,
  onPoolChange,
  onSubmit,
  onConnect,
  onDisconnect,
  userConnected,
  userBalance
}) => {
  const [showPoolInfo, setShowPoolInfo] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [localAmount, setLocalAmount] = useState(amount);
  const [localSelectedPool, setLocalSelectedPool] = useState(selectedPool || '');

  // Находим выбранный пул
  const currentPool = availablePools.find(pool => pool.id === localSelectedPool);
  
  // Рассчитываем комиссию
  const fee = currentPool && localAmount ? parseFloat(localAmount) * currentPool.fee : 0;
  
  // Рассчитываем итоговую сумму
  const totalAmount = parseFloat(localAmount || '0') + fee;
  
  // Проверяем, достаточно ли средств
  const hasEnoughFunds = userBalance && parseFloat(userBalance) >= totalAmount;
  
  // Проверяем валидность суммы
  const isAmountValid = currentPool && 
    parseFloat(localAmount || '0') >= currentPool.minAmount &&
    parseFloat(localAmount || '0') <= currentPool.maxAmount;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Разрешаем только цифры и точку
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      setLocalAmount(value);
      onAmountChange(value);
    }
  };

  const handlePoolChange = (e: SelectChangeEvent<string>) => {
    const poolId = e.target.value;
    setLocalSelectedPool(poolId);
    onPoolChange?.(poolId);
  };

  const handleSubmit = () => {
    if (isAmountValid && hasEnoughFunds && localSelectedPool) {
      onSubmit();
    }
  };

  return (
    <Card 
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{ 
        borderRadius: 3, 
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Typography 
          variant="h4" 
          component={motion.h2}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          gutterBottom 
          textAlign="center" 
          fontWeight="bold"
          sx={{ 
            background: 'linear-gradient(45deg, #8BC34A, #2196F3)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 3
          }}
        >
          Quick Mix
        </Typography>

        {!userConnected ? (
          <Box textAlign="center" py={2}>
            <Typography variant="body1" color="text.secondary" mb={3}>
              Connect your wallet to start mixing TON
            </Typography>
            <Button
              variant="contained"
              startIcon={<Wallet />}
              onClick={onConnect}
              fullWidth
              size="large"
              sx={{
                py: 1.5,
                borderRadius: 2,
                background: 'linear-gradient(45deg, #8BC34A, #2196F3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #7CB342, #1976D2)',
                }
              }}
            >
              Connect Wallet
            </Button>
          </Box>
        ) : (
          <>
            {/* Выбор пула */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Select Pool</InputLabel>
              <Select
                value={localSelectedPool}
                onChange={handlePoolChange}
                label="Select Pool"
              >
                {availablePools.map((pool) => (
                  <MenuItem key={pool.id} value={pool.id}>
                    <Box>
                      <Typography variant="subtitle1">{pool.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Fee: {(pool.fee * 100).toFixed(1)}% | Min: {pool.minAmount} TON
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              {currentPool && (
                <FormHelperText>
                  {currentPool.description} | Participants: {currentPool.participants}
                </FormHelperText>
              )}
            </FormControl>

            {/* Ввод суммы */}
            <TextField
              fullWidth
              label="Amount (TON)"
              value={localAmount}
              onChange={handleAmountChange}
              error={!!amountError || (currentPool && !isAmountValid)}
              helperText={
                amountError || 
                (currentPool && !isAmountValid && 
                  `Amount must be between ${currentPool.minAmount} and ${currentPool.maxAmount} TON`)
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountBalance />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            {/* Информация о транзакции */}
            {currentPool && localAmount && (
              <Box sx={{ mb: 3 }}>
                <Divider sx={{ my: 2 }} />
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Amount:</Typography>
                  <Typography variant="body2">{localAmount} TON</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Fee ({(currentPool.fee * 100).toFixed(1)}%):</Typography>
                  <Typography variant="body2">{fee.toFixed(6)} TON</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" fontWeight="bold">Total:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {totalAmount.toFixed(6)} TON
                  </Typography>
                </Box>
                
                {!hasEnoughFunds && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    Insufficient funds in your wallet
                  </Alert>
                )}
              </Box>
            )}

            {/* Расширенные настройки */}
            <Box sx={{ mb: 3 }}>
              <Button
                onClick={() => setShowAdvanced(!showAdvanced)}
                startIcon={showAdvanced ? <ExpandLess /> : <ExpandMore />}
                size="small"
                sx={{ mb: 1 }}
              >
                Advanced Options
              </Button>
              <Collapse in={showAdvanced}>
                <Alert severity="info">
                  Advanced mixing options will be available in the full mixing form
                </Alert>
              </Collapse>
            </Box>

            {/* Кнопка отправки */}
            <Button
              variant="contained"
              disabled={
                transactionPending || 
                !localAmount || 
                !localSelectedPool || 
                !isAmountValid || 
                !hasEnoughFunds
              }
              onClick={handleSubmit}
              fullWidth
              size="large"
              startIcon={transactionPending ? <CircularProgress size={20} /> : <Send />}
              sx={{
                py: 1.5,
                borderRadius: 2,
                background: 'linear-gradient(45deg, #8BC34A, #2196F3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #7CB342, #1976D2)',
                },
                '&:disabled': {
                  background: 'rgba(255, 255, 255, 0.1)',
                }
              }}
            >
              {transactionPending ? 'Processing...' : 'Mix Now'}
            </Button>

            {/* Баланс кошелька */}
            <Box textAlign="center" mt={2}>
              <Typography variant="body2" color="text.secondary">
                Balance: {userBalance || '0'} TON
              </Typography>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default QuickMixForm;