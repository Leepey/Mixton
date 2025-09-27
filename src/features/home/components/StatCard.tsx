// src/features/home/components/StatCard.tsx
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
  alpha,
  type CardProps
} from '@mui/material';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

interface StatCardProps extends CardProps {
  title: string;
  value: string;
  icon?: React.ReactNode;
  color?: string;
  trend?: string;
  description?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
  trend,
  description,
  sx,
  ...props
}) => {
  const theme = useTheme();
  const cardColor = color || theme.palette.primary.main;

  // Определяем, является ли тренд положительным
  const isPositiveTrend = trend?.startsWith('+');

  return (
    <Card
      component={motion.div}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      sx={{
        height: '100%',
        borderRadius: 3,
        background: alpha(theme.palette.background.paper, 0.05),
        backdropFilter: 'blur(10px)',
        border: `1px solid ${alpha(cardColor, 0.2)}`,
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${cardColor}, ${alpha(cardColor, 0.6)})`,
        },
        ...sx,
      }}
      {...props}
    >
      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Заголовок и иконка */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mb: 2 
          }}
        >
          <Typography 
            variant="h6" 
            color="text.secondary" 
            fontWeight={500}
          >
            {title}
          </Typography>
          
          {icon && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: 2,
                background: alpha(cardColor, 0.1),
                color: cardColor,
              }}
            >
              {icon}
            </Box>
          )}
        </Box>

        {/* Основное значение */}
        <Typography 
          variant="h3" 
          component="div"
          fontWeight="bold"
          sx={{
            mb: 1,
            background: `linear-gradient(45deg, ${cardColor}, ${alpha(cardColor, 0.8)})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {value}
        </Typography>

        {/* Тренд */}
        {trend && (
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5,
              mb: 1 
            }}
          >
            {isPositiveTrend ? (
              <TrendingUp 
                sx={{ 
                  color: theme.palette.success.main, 
                  fontSize: '1rem' 
                }} 
              />
            ) : (
              <TrendingDown 
                sx={{ 
                  color: theme.palette.error.main, 
                  fontSize: '1rem' 
                }} 
              />
            )}
            <Typography 
              variant="body2" 
              color={isPositiveTrend ? 'success.main' : 'error.main'}
              fontWeight={500}
            >
              {trend}
            </Typography>
          </Box>
        )}

        {/* Описание */}
        {description && (
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              mt: 'auto',
              fontSize: '0.875rem',
              lineHeight: 1.4
            }}
          >
            {description}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};