// src/features/dashboard/components/TransactionsModule.tsx
import React from 'react';
import { Grid, Typography, Paper, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { History } from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';
import { useMixerContext } from '../../../context/MixerContext';
import type { MixTransaction } from '../types/dashboard.types'
import {
  formatTransactionDate,
  formatTransactionStatus, // Добавлен импорт
  getStatusColor,
  formatAmountWithCurrency,
  calculateTransactionStats,
  sortTransactionsByDate
} from '../utils/transactionUtils';

const TransactionsModule: React.FC = () => {
  const theme = useTheme();
  const { mixHistory } = useMixerContext();

  // Сортируем транзакции по дате (новые сначала)
  const sortedTransactions = sortTransactionsByDate(mixHistory as MixTransaction[]);
  
  // Рассчитываем статистику
  const stats = calculateTransactionStats(mixHistory as MixTransaction[]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Статистика транзакций */}
      <Box sx={{ mb: 4, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Total: {stats.totalTransactions}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Completed: {stats.completedTransactions} ({stats.completionRate.toFixed(1)}%)
          </Typography>
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Total Amount: {formatAmountWithCurrency(stats.totalAmount)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Average: {formatAmountWithCurrency(stats.averageAmount)}
          </Typography>
        </Box>
      </Box>

      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        Transaction History
      </Typography>
      
      {sortedTransactions.length > 0 ? (
        <Grid container spacing={3}>
          {sortedTransactions.map((tx: MixTransaction) => (
            <Grid size={{ xs: 12 }} key={tx.id}>
              <Paper 
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.grey[900], 0.6)})`,
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alpha('#00BCD4', 0.2)}`,
                }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {formatAmountWithCurrency(tx.amount)}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      px: 2, 
                      py: 0.5, 
                      borderRadius: '12px',
                      bgcolor: alpha(getStatusColor(tx.status), 0.2),
                      color: getStatusColor(tx.status),
                      fontWeight: 600,
                    }}
                  >
                    {formatTransactionStatus(tx.status)} {/* Теперь функция доступна */}
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {formatTransactionDate(tx.timestamp)}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box 
          sx={{ 
            p: 4, 
            borderRadius: '16px',
            textAlign: 'center',
            background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.grey[900], 0.6)})`,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha('#00BCD4', 0.2)}`,
          }}
        >
          <History sx={{ fontSize: 60, color: alpha(theme.palette.text.secondary, 0.5), mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            No transactions yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your mixing history will appear here
          </Typography>
        </Box>
      )}
    </motion.div>
  );
};

export default TransactionsModule;