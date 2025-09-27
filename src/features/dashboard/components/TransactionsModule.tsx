// features/dashboard/components/TransactionsModule.tsx
import React from 'react';
import { Grid, Typography, Paper, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material';
import { History } from '@mui/icons-material';
import { useTransactionHistory } from '../hooks/useTransactionHistory';

export const TransactionsModule: React.FC = () => {
  const theme = useTheme();
  const { transactions, loading } = useTransactionHistory();

  if (loading) {
    return <Typography>Loading transactions...</Typography>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        Transaction History
      </Typography>
      
      {transactions.length > 0 ? (
        <Grid container spacing={3}>
          {transactions.map((tx) => (
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
                    {tx.amount} TON
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      px: 2, 
                      py: 0.5, 
                      borderRadius: '12px',
                      bgcolor: tx.status === 'completed' 
                        ? alpha(theme.palette.success.main, 0.2) 
                        : tx.status === 'pending' 
                          ? alpha(theme.palette.warning.main, 0.2)
                          : alpha(theme.palette.error.main, 0.2),
                      color: tx.status === 'completed' 
                        ? theme.palette.success.main 
                        : tx.status === 'pending' 
                          ? theme.palette.warning.main
                          : theme.palette.error.main,
                    }}
                  >
                    {tx.status}
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {new Date(tx.timestamp).toLocaleString()}
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