// features/shared/components/ui/cards/PoolCard.tsx
import React from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  useTheme,
  alpha,
  type SxProps
} from '@mui/material';
import { motion } from 'framer-motion';

export interface PoolCardProps {
  title: string;
  subtitle?: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
  sx?: SxProps;
}

/**
 * Простая карточка для отображения информации о пуле
 */
export const PoolCard: React.FC<PoolCardProps> = ({
  title,
  subtitle,
  value,
  icon,
  color = '#00BCD4',
  sx = {}
}) => {
  const theme = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
    >
      <Paper 
        elevation={0}
        sx={{
          p: 3,
          borderRadius: '12px',
          background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.grey[900], 0.6)})`,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(color, 0.2)}`,
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: `0 10px 30px ${alpha(color, 0.2)}`,
          },
          ...sx
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          {icon && (
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: '10px',
              background: alpha(color, 0.1),
              color: color
            }}>
              {icon}
            </Box>
          )}
          <Box>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
        
        <Typography variant="h5" sx={{ fontWeight: 600, color }}>
          {value}
        </Typography>
      </Paper>
    </motion.div>
  );
};

export default PoolCard;