// src/features/dashboard/components/StatsModule.tsx
import React from 'react';
import { Grid, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { AccountBalanceWallet, Shuffle, History } from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';
import { useAuth } from '../../../context/AuthContext';
import { useMixerContext } from '../../../context/MixerContext';
import NeonCard from '../../../components/ui/cards/NeonCard';
import type { DashboardStats } from '../types/dashboard.types';

const StatsModule: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const { mixHistory } = useMixerContext();

  // Проверяем, что user не null и преобразуем баланс в число
  const walletBalance = user?.balance ? parseFloat(user.balance) : 0;
  
  const stats: DashboardStats = {
    walletBalance: walletBalance, // Теперь число
    totalTransactions: mixHistory.length,
    lastMixStatus: mixHistory.length > 0 ? 'completed' : 'none',
    lastMixTime: mixHistory.length > 0 ? '2 hours ago' : null,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Grid container spacing={3}>
        {/* Карточка баланса */}
        <Grid size={{ xs: 12, md: 4 }}>
          <NeonCard 
            title="Wallet Balance"
            icon={<AccountBalanceWallet />}
            glowColor="#00BCD4"
          >
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
              {stats.walletBalance.toFixed(2)} TON
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Available for mixing
            </Typography>
          </NeonCard>
        </Grid>

        {/* Карточка статистики */}
        <Grid size={{ xs: 12, md: 4 }}>
          <NeonCard 
            title="Mixing Statistics"
            icon={<Shuffle />}
            glowColor="#8BC34A"
          >
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
              {stats.totalTransactions}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total transactions
            </Typography>
          </NeonCard>
        </Grid>

        {/* Карточка последнего микса */}
        <Grid size={{ xs: 12, md: 4 }}>
          <NeonCard 
            title="Last Mix"
            icon={<History />}
            glowColor="#2196F3"
          >
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
              {stats.lastMixStatus === 'completed' ? 'Completed' : 'None'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {stats.lastMixTime || 'No transactions yet'}
            </Typography>
          </NeonCard>
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default StatsModule;