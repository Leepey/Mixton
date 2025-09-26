// features/shared/components/ui/cards/MixPoolCard.tsx
import React from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  Button, 
  Chip,
  useTheme,
  alpha,
  type SxProps
} from '@mui/material';
import { motion } from 'framer-motion';
import { Shuffle } from '@mui/icons-material';

export interface MixPoolCardProps {
  id: string;
  name: string;
  fee: number;
  minAmount: number;
  maxAmount: number;
  minDelayHours: number;
  participants: number;
  isActive?: boolean;
  onSelect?: (poolId: string) => void;
  sx?: SxProps;
}

/**
 * Карточка для отображения пула микширования
 */
export const MixPoolCard: React.FC<MixPoolCardProps> = ({
  id,
  name,
  fee,
  minAmount,
  maxAmount,
  minDelayHours,
  participants,
  isActive = true,
  onSelect,
  sx = {}
}) => {
  const theme = useTheme();

  const getPoolColor = () => {
    switch (id) {
      case 'basic':
        return '#4CAF50';
      case 'standard':
        return '#2196F3';
      case 'premium':
        return '#9C27B0';
      default:
        return theme.palette.primary.main;
    }
  };

  const poolColor = getPoolColor();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      whileHover={{ 
        y: -10,
        transition: { duration: 0.2 }
      }}
    >
      <Paper 
        elevation={0}
        sx={{
          p: 3,
          borderRadius: '16px',
          height: '100%',
          background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.grey[900], 0.6)})`,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(poolColor, 0.2)}`,
          transition: 'transform 0.3s, box-shadow 0.3s',
          cursor: 'pointer',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: `0 10px 30px ${alpha(poolColor, 0.2)}`,
          },
          ...sx
        }}
        onClick={() => onSelect?.(id)}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: poolColor }}>
          {name}
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Fee Rate
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {(fee * 100).toFixed(1)}%
          </Typography>
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Amount Range
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {minAmount} - {maxAmount} TON
          </Typography>
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Min Delay
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {minDelayHours} hours
          </Typography>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Participants
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {participants}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Chip 
            label={isActive ? 'Active' : 'Inactive'} 
            size="small"
            sx={{
              bgcolor: isActive 
                ? alpha(theme.palette.success.main, 0.2) 
                : alpha(theme.palette.error.main, 0.2),
              color: isActive 
                ? theme.palette.success.main 
                : theme.palette.error.main,
            }}
          />
          
          <Button
            variant="contained"
            size="small"
            startIcon={<Shuffle />}
            sx={{
              borderRadius: '8px',
              background: `linear-gradient(45deg, ${poolColor}, ${alpha(poolColor, 0.7)})`,
            }}
          >
            Mix
          </Button>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default MixPoolCard;