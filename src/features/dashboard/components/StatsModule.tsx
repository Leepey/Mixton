// features/dashboard/components/StatsModule.tsx
import React from 'react';
import { Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { AccountBalanceWallet, Shuffle, History } from '@mui/icons-material';
import { NeonCard } from '../../shared/components/ui/cards/NeonCard';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { useTransactionHistory } from '../hooks/useTransactionHistory';

export const StatsModule: React.FC = () => {
  const { stats } = useDashboardStats();
  const { transactions } = useTransactionHistory();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <NeonCard 
            title="Wallet Balance"
            icon={<AccountBalanceWallet />}
            glowColor="#00BCD4"
          >
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
              {stats?.balance || '0.00'} TON
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Available for mixing
            </Typography>
          </NeonCard>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <NeonCard 
            title="Mixing Statistics"
            icon={<Shuffle />}
            glowColor="#8BC34A"
          >
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
              {transactions.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total transactions
            </Typography>
          </NeonCard>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <NeonCard 
            title="Last Mix"
            icon={<History />}
            glowColor="#2196F3"
          >
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
              {transactions.length > 0 ? 'Completed' : 'None'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {transactions.length > 0 ? '2 hours ago' : 'No transactions yet'}
            </Typography>
          </NeonCard>
        </Grid>
      </Grid>
    </motion.div>
  );
};