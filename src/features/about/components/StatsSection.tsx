// src/features/about/components/StatsSection.tsx
import React from 'react';
import { Typography, Box, Container, Card, CardContent, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import {
  People,
  Shuffle,
  AttachMoney,
  Verified,
  Security,
  Pool
} from '@mui/icons-material';
import { useAboutData } from '../hooks/useAboutData';

interface StatsData {
  title: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

// Вспомогательная функция для преобразования строковых значений в числа
const parseNumericValue = (value: string | number): number => {
  if (typeof value === 'number') {
    return value;
  }
  
  // Извлекаем число из строки типа "15,000+" или "2,500,000+ TON"
  const numericString = value.replace(/[^\d]/g, '');
  return parseInt(numericString, 10) || 0;
};

export const StatsSection: React.FC = () => {
  const { stats, loading } = useAboutData();

  if (loading) {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography>Loading statistics...</Typography>
      </Box>
    );
  }

  const statsData: StatsData[] = stats ? [
    {
      title: 'Total Mixed',
      value: parseNumericValue(stats.totalMixed),
      unit: 'TON',
      icon: <Shuffle />,
      color: '#00BCD4',
      description: 'Total TON mixed through platform'
    },
    {
      title: 'Active Users',
      value: parseNumericValue(stats.usersCount),
      unit: '',
      icon: <People />,
      color: '#4CAF50',
      description: 'Trusting Mixton with their privacy'
    },
    {
      title: 'Available Pools',
      value: stats.poolsCount,
      unit: '',
      icon: <Pool />,
      color: '#FFC107',
      description: 'Privacy options available'
    },
    {
      title: 'Uptime',
      value: stats.uptime,
      unit: '%',
      icon: <Verified />,
      color: '#9C27B0',
      description: 'Service reliability'
    },
    {
      title: 'Security Audits',
      value: stats.securityAudits,
      unit: '',
      icon: <Security />,
      color: '#F44336',
      description: 'Completed security audits'
    }
  ] : [];

  // Компонент StatCard встроенный, так как оригинальный файл не найден
  const StatCard: React.FC<{
    title: string;
    value: number;
    unit: string;
    icon: React.ReactNode;
    color: string;
    description: string;
  }> = ({ title, value, unit, icon, color, description }) => (
    <Card
      sx={{
        height: '100%',
        textAlign: 'center',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 2
          }}
        >
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: `${color}20`,
              color: color
            }}
          >
            {icon}
          </Box>
        </Box>
        
        <Typography
          variant="h4"
          component="div"
          sx={{
            fontWeight: 'bold',
            color: color,
            mb: 1
          }}
        >
          {value.toLocaleString()}{unit}
        </Typography>
        
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: 600,
            mb: 1,
            color: 'text.primary'
          }}
        >
          {title}
        </Typography>
        
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: '0.875rem' }}
        >
          {description}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Container sx={{ py: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h2"
          component="h2"
          align="center"
          gutterBottom
          sx={{ fontWeight: 'bold', mb: 2 }}
        >
          By the Numbers
        </Typography>
        
        <Typography
          variant="h6"
          component="p"
          align="center"
          color="text.secondary"
          sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
        >
          Our platform's performance metrics and achievements speak for themselves
        </Typography>

        <Grid container spacing={4} justifyContent="center" sx={{ maxWidth: 1200, mx: 'auto' }}>
          {statsData.map((stat, index) => (
            <Grid size={{ xs: 12, sm: 12, md: 4, lg: 2.4 }} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
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
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No statistics available at the moment
            </Typography>
          </Box>
        )}
      </motion.div>
    </Container>
  );
};