// src/features/home/components/StatsOverviewSection.tsx
import React from 'react';
import {
  Grid,
  Box,
  Typography,
  useTheme,
  alpha,
  Container
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  People, 
  AccountBalance, 
  Security, 
  Speed,
  Timer
} from '@mui/icons-material';
import { NeonText } from '../../shared/components/ui/typography/NeonText';
import { StatCard } from './StatCard';

interface StatsOverviewSectionProps {
  totalParticipants: number;
  totalVolume: number;
  totalPools: number;
  averageMixTime?: number;
  securityScore?: number;
  totalTransactions?: number;
}

export const StatsOverviewSection: React.FC<StatsOverviewSectionProps> = ({
  totalParticipants,
  totalVolume,
  totalPools,
  averageMixTime = 1800, // 30 минут по умолчанию
  securityScore = 98, // 98% по умолчанию
  totalTransactions = 0
}) => {
  const theme = useTheme();

  // Форматируем числа для отображения
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  // Форматируем время
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  // Данные для статистических карточек
  const statsData = [
    {
      title: 'Total Participants',
      value: formatNumber(totalParticipants),
      icon: <People />,
      color: theme.palette.primary.main,
      trend: '+12%',
      description: 'Active users mixing TON'
    },
    {
      title: 'Total Volume',
      value: `${formatNumber(totalVolume)} TON`,
      icon: <AccountBalance />,
      color: theme.palette.success.main,
      trend: '+23%',
      description: 'Total mixed volume'
    },
    {
      title: 'Active Pools',
      value: totalPools.toString(),
      icon: <TrendingUp />,
      color: theme.palette.info.main,
      trend: '+5%',
      description: 'Available mixing pools'
    },
    {
      title: 'Total Transactions',
      value: formatNumber(totalTransactions),
      icon: <Speed />,
      color: theme.palette.warning.main,
      trend: '+18%',
      description: 'Completed transactions'
    },
    {
      title: 'Avg. Mix Time',
      value: formatTime(averageMixTime),
      icon: <Timer />,
      color: theme.palette.secondary.main,
      trend: '-15%',
      description: 'Average processing time'
    },
    {
      title: 'Security Score',
      value: `${securityScore}%`,
      icon: <Security />,
      color: theme.palette.error.main,
      trend: '+2%',
      description: 'Privacy protection level'
    }
  ];

  return (
    <Box
      component="section"
      id="stats-overview-section"
      sx={{
        py: 8,
        background: 'linear-gradient(180deg, #16213e 0%, #1a1a2e 100%)',
        position: 'relative',
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
      <Container maxWidth="xl">
        {/* Заголовок секции */}
        <Box textAlign="center" mb={8}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <NeonText
              variant="h3"
              component="h2"
              color={theme.palette.primary.main}
              sx={{ mb: 3 }}
            >
              Platform Statistics
            </NeonText>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              maxWidth={600} 
              mx="auto"
              sx={{ lineHeight: 1.6 }}
            >
              Real-time statistics showing the growth and performance of our TON mixing platform. 
              Join thousands of users who trust us with their privacy.
            </Typography>
          </motion.div>
        </Box>

        {/* Сетка статистических карточек */}
        <Grid container spacing={4}>
          {statsData.map((stat, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={stat.title}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <StatCard
                  title={stat.title}
                  value={stat.value}
                  icon={stat.icon}
                  color={stat.color}
                  trend={stat.trend}
                  description={stat.description}
                />
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Дополнительная информация */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <Box
            sx={{
              mt: 8,
              p: 4,
              borderRadius: 4,
              background: alpha(theme.palette.primary.main, 0.05),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              textAlign: 'center'
            }}
          >
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Growing Community
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Our platform is continuously growing with new users joining every day. 
              We're committed to providing the most secure and private TON mixing service.
            </Typography>
            
            {/* Индикаторы роста */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 4,
                mt: 4,
                flexWrap: 'wrap'
              }}
            >
              <Box textAlign="center">
                <Typography variant="h4" color={theme.palette.primary.main} fontWeight="bold">
                  99.9%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Uptime
                </Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h4" color={theme.palette.success.main} fontWeight="bold">
                  24/7
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Support
                </Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h4" color={theme.palette.info.main} fontWeight="bold">
                  100%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Decentralized
                </Typography>
              </Box>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};