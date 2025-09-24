// src/components/ui/cards/MixPoolCard.tsx
import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip,
  useTheme,
  alpha,
  CardActionArea
} from '@mui/material';
import { motion } from 'framer-motion';
import type { MixPool } from '../../../types/mixer';

interface MixPoolCardProps {
  pool: MixPool;
  onClick?: () => void;
  disabled?: boolean;
  isSelected?: boolean;
}

const MixPoolCard: React.FC<MixPoolCardProps> = ({ 
  pool, 
  onClick, 
  disabled = false,
  isSelected = false
}) => {
  const theme = useTheme();
  
  // Определяем цвет в зависимости от типа пула
  const getPoolColor = () => {
    if (pool.id === 'basic') return theme.palette.primary.main;
    if (pool.id === 'standard') return theme.palette.secondary.main;
    return theme.palette.success.main;
  };
  
  const poolColor = getPoolColor();
  
  return (
    <motion.div
      whileHover={!disabled ? { y: -5 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
    >
      <Card 
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 3,
          overflow: 'hidden',
          border: isSelected ? `2px solid ${poolColor}` : '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: isSelected 
            ? `0 0 20px ${alpha(poolColor, 0.5)}` 
            : `0 8px 16px ${alpha('#000', 0.2)}`,
          background: isSelected 
            ? `linear-gradient(135deg, ${alpha(poolColor, 0.1)}, ${alpha(poolColor, 0.05)})`
            : 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.7 : 1,
          position: 'relative',
          '&:hover': !disabled ? {
            transform: 'translateY(-5px)',
            boxShadow: `0 12px 24px ${alpha('#000', 0.3)}`,
            border: `2px solid ${alpha(poolColor, 0.7)}`,
          } : {},
        }}
      >
        <CardActionArea 
          onClick={onClick}
          disabled={disabled}
          sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'stretch',
            '&:hover': {
              backgroundColor: 'transparent',
            }
          }}
        >
          <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Заголовок и индикатор статуса */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography 
                variant="h6" 
                component="h3"
                sx={{ 
                  fontWeight: 700,
                  color: poolColor,
                  textShadow: isSelected ? `0 0 10px ${alpha(poolColor, 0.5)}` : 'none'
                }}
              >
                {pool.name}
              </Typography>
              
              <Chip 
                label={`${(pool.fee * 100).toFixed(1)}%`}
                size="small"
                sx={{
                  backgroundColor: alpha(poolColor, 0.2),
                  color: poolColor,
                  border: `1px solid ${alpha(poolColor, 0.5)}`,
                  fontWeight: 600,
                }}
              />
            </Box>
            
            {/* Описание */}
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ mb: 2, flexGrow: 1 }}
            >
              {pool.description}
            </Typography>
            
            {/* Лимиты и задержка */}
            <Box sx={{ mt: 'auto' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Min/Max:
                </Typography>
                <Typography variant="caption" fontWeight={600}>
                  {pool.minAmount} - {pool.maxAmount} TON
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" color="text.secondary">
                  Delay:
                </Typography>
                <Typography variant="caption" fontWeight={600}>
                  {pool.minDelayHours}h
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </motion.div>
  );
};

export default MixPoolCard;