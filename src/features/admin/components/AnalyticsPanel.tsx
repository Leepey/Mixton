// src/features/admin/components/AnalyticsPanel.tsx
import React, { useState } from 'react';
import { Grid, Typography, Box, Paper } from '@mui/material'; // Добавляем Paper в импорт
import { motion } from 'framer-motion';
import {
  AccountBalance,
  Shuffle,
  HourglassEmpty,
  People,
  Schedule,
  CheckCircle,
  Error as ErrorIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material';
import { NeonCard, type NeonCardProps } from '../../shared/components/ui/cards/NeonCard';
import { StatusChip } from '../../shared/components/ui/StatusChip';
import { useAdminData } from '../hooks/useAdminData';
import type { BasicStats } from '../types/admin.types';
import type { AppStatus } from '../../shared/types/status.types';

interface AnalyticsPanelProps {
  className?: string;
}

// Тип для статуса карточки
type CardStatus = 'excellent' | 'good' | 'normal' | 'warning' | 'critical';

// Тип для данных карточки
interface StatCardData {
  id: string;
  title: string;
  getValue: (stats: BasicStats) => string;
  icon: React.ReactNode;
  glowColor: string;
  description: string;
  getStatus: (stats: BasicStats) => CardStatus;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

// Конфигурация для статусов
const getStatusConfig = (status: CardStatus): { label: string; color: AppStatus } => {
  switch (status) {
    case 'excellent':
      return { label: 'Excellent', color: 'success' };
    case 'good':
      return { label: 'Good', color: 'success' };
    case 'normal':
      return { label: 'Normal', color: 'info' };
    case 'warning':
      return { label: 'Warning', color: 'warning' };
    case 'critical':
      return { label: 'Critical', color: 'error' };
    default:
      return { label: 'Unknown', color: 'default' };
  }
};

// Компонент для отображения тренда
const TrendIndicator: React.FC<{ value: number; isPositive: boolean }> = ({ value, isPositive }) => {
  const theme = useTheme();
  const color = isPositive ? theme.palette.success.main : theme.palette.error.main;
  const icon = isPositive ? '↑' : '↓';
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', color, fontSize: '0.875rem', fontWeight: 500 }}>
      {icon} {Math.abs(value)}%
    </Box>
  );
};

export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ className }) => {
  const theme = useTheme();
  const { stats, loading, error } = useAdminData();
  
  // Состояние для выбранной карточки
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  // Обработчик клика по карточке
  const handleCardClick = (cardId: string) => {
    setSelectedCard(cardId === selectedCard ? null : cardId);
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Loading analytics data...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">Failed to load analytics: {error}</Typography>
      </Box>
    );
  }

  if (!stats) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>No data available</Typography>
      </Box>
    );
  }

  // Определяем данные для карточек
  const statsData: StatCardData[] = [
    {
      id: 'balance',
      title: 'Contract Balance',
      getValue: (stats) => `${stats.totalVolume.toLocaleString()} TON`,
      icon: <AccountBalance />,
      glowColor: '#FFC107',
      description: 'Available in pool',
      getStatus: () => 'excellent',
      trend: { value: 5.2, isPositive: true }
    },
    {
      id: 'transactions',
      title: 'Total Transactions',
      getValue: (stats) => stats.totalTransactions.toLocaleString(),
      icon: <Shuffle />,
      glowColor: '#4CAF50',
      description: 'All time',
      getStatus: (stats) => stats.totalTransactions > 1000 ? 'excellent' : 'good',
      trend: { value: 12.5, isPositive: true }
    },
    {
      id: 'pending',
      title: 'Pending Queue',
      getValue: (stats) => stats.pendingTransactions.toLocaleString(),
      icon: <HourglassEmpty />,
      glowColor: '#2196F3',
      description: 'Awaiting processing',
      getStatus: (stats) => stats.pendingTransactions === 0 ? 'excellent' : stats.pendingTransactions < 10 ? 'good' : 'warning',
      trend: { value: 8.3, isPositive: false }
    },
    {
      id: 'users',
      title: 'Active Users',
      getValue: (stats) => stats.totalUsers.toLocaleString(),
      icon: <People />,
      glowColor: '#9C27B0',
      description: 'Trusting Mixton',
      getStatus: (stats) => stats.totalUsers > 10000 ? 'excellent' : stats.totalUsers > 1000 ? 'good' : 'normal',
      trend: { value: 15.7, isPositive: true }
    },
    {
      id: 'processing',
      title: 'Processing Time',
      getValue: (stats) => `${stats.averageProcessingTime.toFixed(1)} min`,
      icon: <Schedule />,
      glowColor: '#FF5722',
      description: 'Average time',
      getStatus: (stats) => stats.averageProcessingTime < 5 ? 'excellent' : stats.averageProcessingTime < 15 ? 'good' : 'warning',
      trend: { value: 2.1, isPositive: false }
    },
    {
      id: 'uptime',
      title: 'Uptime',
      getValue: (stats) => `${stats.uptime.toFixed(1)}%`,
      icon: <CheckCircle />,
      glowColor: '#00BCD4',
      description: 'Service reliability',
      getStatus: (stats) => stats.uptime >= 99.9 ? 'excellent' : stats.uptime >= 99 ? 'good' : stats.uptime >= 95 ? 'normal' : 'warning',
      trend: { value: 0.1, isPositive: true }
    }
  ];

  return (
    <Box className={className}>
      <Typography 
        variant="h4" 
        component={motion.h2}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        gutterBottom 
        fontWeight="bold"
        sx={{ 
          background: 'linear-gradient(45deg, #8BC34A, #2196F3)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 3
        }}
      >
        Analytics Overview
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Real-time statistics and performance metrics
      </Typography>

      <Grid container spacing={3}>
        {statsData.map((stat, index) => {
          const value = stat.getValue(stats);
          const status = stat.getStatus(stats);
          const statusConfig = getStatusConfig(status);
          const isSelected = selectedCard === stat.id;

          return (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={stat.id}>
              <NeonCard
                title={stat.title} // Добавляем обязательное свойство title
                onClick={() => handleCardClick(stat.id)}
                sx={{ 
                  transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                  boxShadow: isSelected ? `0 8px 32px ${alpha(stat.glowColor, 0.4)}` : 'none',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ mr: 2, color: stat.glowColor }}>
                    {stat.icon}
                  </Box>
                  <Box>
                    <Typography variant="h4" fontWeight="bold" color={stat.glowColor}>
                      {value}
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {stat.description}
                </Typography>

                {/* Дополнительная информация при выборе карточки */}
                {isSelected && (
                  <Box sx={{ mt: 2 }}>
                    {stat.trend && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          24h Change
                        </Typography>
                        <TrendIndicator value={stat.trend.value} isPositive={stat.trend.isPositive} />
                      </Box>
                    )}
                    
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Status
                      </Typography>
                      <StatusChip 
                        label={statusConfig.label} 
                        status={statusConfig.color} // Используем свойство status вместо color
                        size="small"
                      />
                    </Box>
                  </Box>
                )}
              </NeonCard>
            </Grid>
          );
        })}
      </Grid>

      {/* Сводная статистика */}
      {selectedCard && (
        <Paper // Теперь Paper импортирован
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          sx={{
            mt: 4,
            p: 3,
            borderRadius: 3,
            background: alpha(theme.palette.background.paper, 0.05),
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
          }}
        >
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
            Detailed Information
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Total Volume
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {stats.totalVolume.toLocaleString()} TON
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Success Rate
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {((stats.completedTransactions / stats.totalTransactions) * 100).toFixed(1)}%
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Failed Transactions
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {stats.failedTransactions}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Avg Processing Time
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {stats.averageProcessingTime.toFixed(1)} min
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Box>
  );
};