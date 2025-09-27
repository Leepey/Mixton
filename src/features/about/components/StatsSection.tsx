// src/features/about/components/StatsSection.tsx
import React from 'react';
import { Grid, Typography, Box, Container } from '@mui/material'; // Добавляем Container в импорт
import { motion } from 'framer-motion';
import { 
  People, 
  Shuffle, 
  AttachMoney, 
  Verified 
} from '@mui/icons-material';
import { useAboutData } from '../hooks/useAboutData';
import { StatCard } from './StatCard';

interface StatsData {
  title: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

export const StatsSection: React.FC = () => {
  const { stats, loading } = useAboutData();

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography>Loading statistics...</Typography>
      </Container>
    );
  }

  const statsData: StatsData[] = stats ? [
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
    <Box 
      component="section"
      sx={{ 
        py: 8,
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238BC34A' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          opacity: 0.3
        }
      }}
    >
      <Container maxWidth="lg">
        <Box textAlign="center" mb={6}>
          <Typography 
            variant="h3" 
            component={motion.h2}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            gutterBottom 
            fontWeight="bold"
            sx={{ 
              color: 'white',
              mb: 2
            }}
          >
            By the Numbers
          </Typography>
          
          <Typography 
            variant="h6" 
            component={motion.p}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            Our platform's performance metrics and achievements speak for themselves
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {statsData.map((stat, index) => (
            <Grid 
              size={{ xs: 12, sm: 6, md: 3 }} 
              key={stat.title}
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              >
                <StatCard
                  title={stat.title}
                  value={stat.value}
                  unit={stat.unit}
                  icon={stat.icon}
                  color={stat.color}
                  description={stat.description}
                />
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {statsData.length === 0 && (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              No statistics available at the moment
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};