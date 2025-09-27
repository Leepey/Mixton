// features/home/components/RecentTransactionsSection.tsx
import React from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material';
import { useMixerContext } from '../../../context/MixerContext';

export const RecentTransactionsSection: React.FC = () => {
  const theme = useTheme();
  const { mixHistory } = useMixerContext();

  // Получаем последние 5 транзакций
  const recentTransactions = mixHistory.slice(0, 5);

  return (
    <Box sx={{ py: 8 }}>
      <Typography 
        variant="h2" 
        component="h2" 
        gutterBottom
        sx={{ 
          textAlign: 'center', 
          mb: 6,
          fontSize: { xs: '2rem', md: '2.5rem' },
          fontWeight: 700
        }}
      >
        Recent Transactions
      </Typography>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <Paper 
          elevation={0}
          sx={{
            borderRadius: '16px',
            background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.grey[900], 0.6)})`,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha('#00BCD4', 0.2)}`,
            overflow: 'hidden'
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Transaction ID</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>{tx.id.substring(0, 8)}...</TableCell>
                      <TableCell>{tx.amount} TON</TableCell>
                      <TableCell>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: tx.status === 'completed' 
                              ? theme.palette.success.main 
                              : tx.status === 'pending' 
                                ? theme.palette.warning.main
                                : theme.palette.error.main,
                          }}
                        >
                          {tx.status}
                        </Typography>
                      </TableCell>
                      <TableCell>{new Date(tx.timestamp * 1000).toLocaleString()}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography variant="body2" color="text.secondary">
                        No recent transactions
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </motion.div>
    </Box>
  );
};