// features/about/components/StatsSection.tsx
import React from 'react';
import { Grid, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { People, Shuffle, AttachMoney, Verified } from '@mui/icons-material';
import { useAboutData } from '../hooks/useAboutData';
import { StatCard } from './StatCard';

export const StatsSection: React.FC = () => {
  const { stats, loading } = useAboutData();

  if (loading) {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography>Loading statistics...</Typography>
      </Box>
    );
  }

  const statsData = stats ? [
    {
      title: 'Active Users',
      value: stats.totalUsers,
      unit: '',
      icon: <People />,
      color: '#00BCD4',
      description: 'Trusting Mixton'
    },
    {
      title: 'Total Mixes',
      value: stats.totalTransactions,
      unit: '',
      icon: <Shuffle />,
      color: '#4CAF50',
      description: 'Transactions processed'
    },
    {
      title: 'Total Volume',
      value: stats.totalVolume,
      unit: 'TON',
      icon: <AttachMoney />,
      color: '#FFC107',
      description: 'Value mixed'
    },
    {
      title: 'Uptime',
      value: stats.uptime,
      unit: '%',
      icon: <Verified />,
      color: '#9C27B0',
      description: 'Service reliability'
    }
  ] : [];

  return (
    <Box sx={{ py: 8, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography 
            variant="h3" 
            component="h2" 
            textAlign="center" 
            sx={{ mb: 6, fontWeight: 700 }}
          >
            By the Numbers
          </Typography>
          
          <Grid container spacing={4}>
            {statsData.map((stat, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.title}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <StatCard {...stat} />
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};