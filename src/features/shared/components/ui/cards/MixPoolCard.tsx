// src/features/shared/components/ui/cards/MixPoolCard.tsx
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  useTheme,
  alpha,
  type CardProps
} from '@mui/material';
import { motion } from 'framer-motion';
import { AccountBalance, People, Schedule, TrendingUp } from '@mui/icons-material';
import type { MixPool } from '../../../../mixer/types/mixer.type';

interface MixPoolCardProps extends CardProps {
  pool: MixPool;
  onClick?: () => void;
  disabled?: boolean;
  isSelected?: boolean;
}

export const MixPoolCard: React.FC<MixPoolCardProps> = ({
  pool,
  onClick,
  disabled = false,
  isSelected = false,
  sx,
  ...props
}) => {
  const theme = useTheme();

  // Функция для получения цвета статуса
  const getStatusColor = (status: MixPool['status']) => {
    switch (status) {
      case 'active':
        return theme.palette.success.main;
      case 'full':
        return theme.palette.warning.main;
      case 'maintenance':
        return theme.palette.info.main;
      case 'inactive':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  // Функция для получения текста статуса
  const getStatusText = (status: MixPool['status']) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'full':
        return 'Full';
      case 'maintenance':
        return 'Maintenance';
      case 'inactive':
        return 'Inactive';
      default:
        return 'Unknown';
    }
  };

  return (
    <Card
      component={motion.div}
      whileHover={!disabled ? { y: -5 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        background: alpha(theme.palette.background.paper, 0.05),
        backdropFilter: 'blur(10px)',
        border: isSelected
          ? `2px solid ${theme.palette.primary.main}`
          : `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
        transition: 'all 0.3s ease',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.7 : 1,
        overflow: 'hidden',
        position: 'relative',
        '&::before': isSelected
          ? {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: alpha(theme.palette.primary.main, 0.05),
              pointerEvents: 'none',
            }
          : {},
        ...sx,
      }}
      onClick={!disabled ? onClick : undefined}
      {...props}
    >
      {/* Заголовок карточки */}
      <Box
        sx={{
          p: 3,
          background: isSelected
            ? alpha(theme.palette.primary.main, 0.1)
            : alpha(theme.palette.background.paper, 0.02),
          borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        }}
      >
        <Typography
          variant="h6"
          component="h3"
          fontWeight="bold"
          gutterBottom
          sx={{
            background: isSelected
              ? 'linear-gradient(45deg, #8BC34A, #2196F3)'
              : 'inherit',
            WebkitBackgroundClip: isSelected ? 'text' : 'initial',
            WebkitTextFillColor: isSelected ? 'transparent' : 'inherit',
          }}
        >
          {pool.name}
        </Typography>
        
        <Box display="flex" alignItems="center" gap={1}>
          <Chip
            label={getStatusText(pool.status)}
            size="small"
            sx={{
              background: alpha(getStatusColor(pool.status), 0.2),
              color: getStatusColor(pool.status),
              border: `1px solid ${alpha(getStatusColor(pool.status), 0.3)}`,
              fontWeight: 'bold',
            }}
          />
          <Chip
            label={`${(pool.fee * 100).toFixed(1)}% fee`}
            size="small"
            variant="outlined"
            color="primary"
          />
        </Box>
      </Box>

      {/* Содержимое карточки */}
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {pool.description}
        </Typography>

        {/* Характеристики пула */}
        <Box display="flex" flexDirection="column" gap={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <AccountBalance fontSize="small" color="primary" />
            <Typography variant="body2">
              <strong>Range:</strong> {pool.minAmount} - {pool.maxAmount} TON
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <People fontSize="small" color="primary" />
            <Typography variant="body2">
              <strong>Participants:</strong> {pool.participants}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <Schedule fontSize="small" color="primary" />
            <Typography variant="body2">
              <strong>Delay:</strong> {Math.round(pool.delay / 60)} min
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <TrendingUp fontSize="small" color="primary" />
            <Typography variant="body2">
              <strong>Volume:</strong> {pool.volume.toFixed(2)} TON
            </Typography>
          </Box>

          {/* Уровень анонимности */}
          <Box display="flex" alignItems="center" gap={1} mt={1}>
            <Typography variant="body2">
              <strong>Privacy Level:</strong>
            </Typography>
            <Box display="flex" gap={0.5}>
              {[...Array(5)].map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: i < pool.anonymityLevel
                      ? theme.palette.primary.main
                      : alpha(theme.palette.primary.main, 0.2),
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </CardContent>

      {/* Нижняя часть карточки */}
      <Box
        sx={{
          p: 2,
          background: alpha(theme.palette.background.paper, 0.02),
          borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        }}
      >
        <Button
          variant={isSelected ? "contained" : "outlined"}
          size="small"
          fullWidth
          disabled={disabled}
          onClick={onClick}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
          }}
        >
          {isSelected ? 'Selected' : 'Select Pool'}
        </Button>
      </Box>
    </Card>
  );
};