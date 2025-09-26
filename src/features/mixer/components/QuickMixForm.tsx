// src\features\mixer\components\QuickMixForm.tsx
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
  Collapse
} from '@mui/material';
import { Wallet, AccountBalance, Shuffle, Info, ExpandMore, ExpandLess, Send } from '@mui/icons-material';
import { motion } from 'framer-motion';
import type { MixPool } from '../types/mixer';

interface QuickMixFormProps {
  amount: string;
  amountError: string;
  transactionPending: boolean;
  selectedPool?: string;
  availablePools: MixPool[];
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
  
  // Находим выбранный пул
  const currentPool = availablePools.find(pool => pool.id === selectedPool);
  
  // Рассчитываем комиссию
  const fee = currentPool && amount ? parseFloat(amount) * currentPool.fee : 0;
  
  // Рассчитываем итоговую сумму
  const totalAmount = parseFloat(amount || '0') + fee;
  
  // Проверяем, достаточно ли средств
  const hasEnoughFunds = userBalance && parseFloat(userBalance) >= totalAmount;
  
  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        borderRadius: 3,
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        overflow: 'hidden'
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography 
          variant="h5" 
          component="h2" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Shuffle color="primary" />
          Quick Mix
        </Typography>
        
        {!userConnected ? (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="body1" sx={{ mb: 3 }}>
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
          <Box>
            {/* Информация о кошельке */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 3 
            }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Connected
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {userBalance} TON
                </Typography>
              </Box>
              <Button
                variant="outlined"
                size="small"
                onClick={onDisconnect}
                color="secondary"
              >
                Disconnect
              </Button>
            </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            {/* Выбор пула */}
            {onPoolChange && (
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel id="pool-select-label">Select Pool</InputLabel>
                <Select
                  labelId="pool-select-label"
                  value={selectedPool || ''}
                  label="Select Pool"
                  onChange={(e) => onPoolChange(e.target.value)}
                  disabled={transactionPending}
                >
                  {availablePools.map((pool) => (
                    <MenuItem key={pool.id} value={pool.id}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <span>{pool.name}</span>
                        <Chip 
                          label={`${(pool.fee * 100).toFixed(1)}%`}
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  Different pools have different fees and delay times
                </FormHelperText>
              </FormControl>
            )}
            
            {/* Информация о выбранном пуле */}
            {currentPool && (
              <Alert 
                severity="info" 
                sx={{ mb: 3 }}
                action={
                  <IconButton 
                    aria-label="toggle pool info" 
                    color="inherit" 
                    size="small"
                    onClick={() => setShowPoolInfo(!showPoolInfo)}
                  >
                    {showPoolInfo ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                }
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" fontWeight={600}>
                    {currentPool.name}
                  </Typography>
                  <Chip 
                    label={`${(currentPool.fee * 100).toFixed(1)}% fee`}
                    size="small"
                    color="primary"
                  />
                  <Chip 
                    label={`${currentPool.minDelayHours}h delay`}
                    size="small"
                    color="secondary"
                  />
                </Box>
                <Collapse in={showPoolInfo}>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {currentPool.description}
                  </Typography>
                  <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Typography variant="caption" color="text.secondary">
                      Min: {currentPool.minAmount} TON
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Max: {currentPool.maxAmount} TON
                    </Typography>
                  </Box>
                </Collapse>
              </Alert>
            )}
            
            {/* Поле для ввода суммы */}
            <TextField
              label="Amount (TON)"
              variant="outlined"
              fullWidth
              value={amount}
              onChange={onAmountChange}
              error={!!amountError}
              helperText={amountError || (currentPool ? `Range: ${currentPool.minAmount} - ${currentPool.maxAmount} TON` : '')}
              disabled={transactionPending}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="Your wallet balance">
                      <Chip 
                        label={`${userBalance || 0} TON`}
                        size="small"
                        color={userBalance && parseFloat(amount) > parseFloat(userBalance) ? "error" : "primary"}
                        variant="outlined"
                      />
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />
            
            {/* Информация о комиссии */}
            {amount && !amountError && currentPool && (
              <Box sx={{ mb: 3, p: 2, backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Amount:</Typography>
                  <Typography variant="body2" fontWeight={600}>{amount} TON</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Fee ({(currentPool.fee * 100).toFixed(1)}%):</Typography>
                  <Typography variant="body2" fontWeight={600}>{fee.toFixed(6)} TON</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" fontWeight={600}>Total:</Typography>
                  <Typography 
                    variant="body2" 
                    fontWeight={600}
                    color={!hasEnoughFunds ? "error" : "inherit"}
                  >
                    {totalAmount.toFixed(6)} TON
                  </Typography>
                </Box>
                {!hasEnoughFunds && (
                  <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                    Insufficient funds in your wallet
                  </Typography>
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
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    Advanced mixing options will be available in the full mixing form
                  </Typography>
                </Alert>
              </Collapse>
            </Box>
            
            {/* Кнопка отправки */}
            <Button
              variant="contained"
              onClick={onSubmit}
              disabled={
                transactionPending || 
                !!amountError || 
                !amount || 
                !selectedPool ||
                !hasEnoughFunds
              }
              fullWidth
              size="large"
              startIcon={transactionPending ? <Send /> : <Shuffle />}
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
            
            {/* Предупреждение о недостатке средств */}
            {!hasEnoughFunds && amount && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                You don't have enough TON in your wallet. Please add more funds or reduce the amount.
              </Alert>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default QuickMixForm;