// features/admin/components/AnalyticsPanel.tsx
import React from 'react';
import { Grid, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { 
  AccountBalance, 
  Shuffle, 
  HourglassEmpty, 
  TrendingUp, 
  People, 
  Schedule,
  CheckCircle,
  Warning,
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
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 0.5,
        color 
      }}
    >
      <Typography variant="caption" sx={{ fontWeight: 600 }}>
        {icon}
      </Typography>
      <Typography variant="caption" sx={{ fontWeight: 600 }}>
        {Math.abs(value)}%
      </Typography>
    </Box>
  );
};

export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ className }) => {
  const theme = useTheme();
  const { stats, loading, error } = useAdminData();

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
      getStatus: (stats) => stats.pendingTransactions === 0 ? 'excellent' : 
                     stats.pendingTransactions < 10 ? 'good' : 'warning',
      trend: { value: 8.3, isPositive: false }
    },
    {
      id: 'users',
      title: 'Active Users',
      getValue: (stats) => stats.totalUsers.toLocaleString(),
      icon: <People />,
      glowColor: '#9C27B0',
      description: 'Trusting Mixton',
      getStatus: (stats) => stats.totalUsers > 10000 ? 'excellent' : 
                     stats.totalUsers > 1000 ? 'good' : 'normal',
      trend: { value: 15.7, isPositive: true }
    },
    {
      id: 'processing',
      title: 'Processing Time',
      getValue: (stats) => `${stats.averageProcessingTime.toFixed(1)} min`,
      icon: <Schedule />,
      glowColor: '#FF5722',
      description: 'Average time',
      getStatus: (stats) => stats.averageProcessingTime < 5 ? 'excellent' : 
                     stats.averageProcessingTime < 15 ? 'good' : 'warning',
      trend: { value: 2.1, isPositive: false }
    },
    {
      id: 'uptime',
      title: 'Uptime',
      getValue: (stats) => `${stats.uptime.toFixed(1)}%`,
      icon: <TrendingUp />,
      glowColor: '#00BCD4',
      description: 'Service reliability',
      getStatus: (stats) => stats.uptime >= 99.9 ? 'excellent' : 
                     stats.uptime >= 99 ? 'good' : 
                     stats.uptime >= 95 ? 'normal' : 'warning',
      trend: { value: 0.1, isPositive: true }
    }
  ];

  // Состояние для выбранной карточки
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  // Обработчик клика по карточке
  const handleCardClick = (cardId: string) => {
    setSelectedCard(cardId === selectedCard ? null : cardId);
  };

  if (loading) {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Schedule sx={{ fontSize: 48, color: theme.palette.primary.main }} />
            <Typography variant="h6" color="text.secondary">
              Loading analytics data...
            </Typography>
          </Box>
        </motion.div>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <ErrorIcon sx={{ fontSize: 48, color: theme.palette.error.main }} />
            <Typography variant="h6" color="error">
              Failed to load analytics
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {error}
            </Typography>
          </Box>
        </motion.div>
      </Box>
    );
  }

  if (!stats) {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No data available
        </Typography>
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          Analytics Overview
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Real-time statistics and performance metrics
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        {statsData.map((stat, index) => {
          const value = stat.getValue(stats);
          const status = stat.getStatus(stats);
          const statusConfig = getStatusConfig(status);
          const isSelected = selectedCard === stat.id;
          
          return (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={stat.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                style={{ cursor: 'pointer' }}
              >
                <NeonCard 
                  title={stat.title}
                  value={value}
                  icon={stat.icon}
                  glowColor={stat.glowColor}
                  description={stat.description}
                  statusChip={statusConfig}
                  onClick={() => handleCardClick(stat.id)}
                  sx={{
                    transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                    boxShadow: isSelected 
                      ? `0 8px 32px ${alpha(stat.glowColor, 0.4)}` 
                      : 'none',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {/* Дополнительная информация при выборе карточки */}
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                    >
                      <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                        {stat.trend && (
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              24h Change
                            </Typography>
                            <TrendIndicator 
                              value={stat.trend.value} 
                              isPositive={stat.trend.isPositive} 
                            />
                          </Box>
                        )}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" color="text.secondary">
                            Status
                          </Typography>
                          <StatusChip 
                            status={statusConfig.color}
                            size="small"
                          />
                        </Box>
                      </Box>
                    </motion.div>
                  )}
                </NeonCard>
              </motion.div>
            </Grid>
          );
        })}
      </Grid>

      {/* Сводная статистика */}
      {selectedCard && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box 
            sx={{ 
              mt: 4, 
              p: 3, 
              borderRadius: '12px',
              background: alpha(theme.palette.primary.main, 0.05),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Detailed Information
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Total Volume
                </Typography>
                <Typography variant="h6">
                  {stats.totalVolume.toLocaleString()} TON
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Success Rate
                </Typography>
                <Typography variant="h6">
                  {((stats.completedTransactions / stats.totalTransactions) * 100).toFixed(1)}%
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Failed Transactions
                </Typography>
                <Typography variant="h6">
                  {stats.failedTransactions}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Avg Processing Time
                </Typography>
                <Typography variant="h6">
                  {stats.averageProcessingTime.toFixed(1)} min
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </motion.div>
      )}
    </motion.div>
  );
};