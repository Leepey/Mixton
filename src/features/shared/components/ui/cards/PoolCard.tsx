import React from 'react';
import { 
  Box, 
  Typography, 
  Chip, 
  useTheme,
  alpha,
  Skeleton
} from '@mui/material';
import { motion } from 'framer-motion';
import { SwapHoriz, Lock, Schedule } from '@mui/icons-material';

interface Pool {
  id: string;
  name: string;
  fee: number;
  minAmount: number;
  maxAmount: number;
  delay: string;
  capacity: number;
}

interface PoolCardProps {
  pool: Pool;
  onClick: () => void;
  isSelected: boolean;
}

const PoolCard: React.FC<PoolCardProps> = ({ pool, onClick, isSelected }) => {
  const theme = useTheme();
  
  // Цвета неоновой сине-голубой темы
  const neonBlue = '#00BCD4';
  const neonCyan = '#18FFFF';
  const deepBlue = '#0a192f';
  
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      <Box
        onClick={onClick}
        sx={{
          p: 2.5,
          borderRadius: '14px',
          background: isSelected
            ? `linear-gradient(135deg, ${alpha(neonBlue, 0.15)}, ${alpha(deepBlue, 0.8)})`
            : alpha(deepBlue, 0.6),
          border: `1px solid ${isSelected ? neonBlue : alpha(neonBlue, 0.2)}`,
          boxShadow: isSelected 
            ? `0 0 20px ${alpha(neonBlue, 0.4)}` 
            : 'none',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            borderColor: neonCyan,
            boxShadow: `0 0 25px ${alpha(neonCyan, 0.3)}`
          }
        }}
      >
        {/* Индикатор выбора */}
        {isSelected && (
          <Box sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: neonBlue,
            boxShadow: `0 0 10px ${neonBlue}`
          }} />
        )}
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <SwapHoriz sx={{ 
            fontSize: 24, 
            mr: 1.5, 
            color: isSelected ? neonCyan : neonBlue 
          }} />
          <Typography variant="h6" sx={{ 
            fontWeight: 600,
            color: isSelected ? neonCyan : theme.palette.text.primary
          }}>
            {pool.name}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
          <Chip
            icon={<Lock sx={{ fontSize: 16 }} />}
            label={`${pool.fee}% fee`}
            size="small"
            sx={{
              background: alpha(neonBlue, 0.1),
              color: neonBlue,
              border: `1px solid ${alpha(neonBlue, 0.3)}`,
              '& .MuiChip-icon': { color: neonBlue }
            }}
          />
          <Chip
            icon={<Schedule sx={{ fontSize: 16 }} />}
            label={pool.delay}
            size="small"
            sx={{
              background: alpha(neonCyan, 0.1),
              color: neonCyan,
              border: `1px solid ${alpha(neonCyan, 0.3)}`,
              '& .MuiChip-icon': { color: neonCyan }
            }}
          />
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            Min: {pool.minAmount} TON
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            Max: {pool.maxAmount} TON
          </Typography>
        </Box>
        
        {/* Индикатор заполненности пула */}
        <Box sx={{ mt: 1.5 }}>
          <Box sx={{ 
            width: '100%', 
            height: 6, 
            background: alpha(theme.palette.grey[700], 0.3),
            borderRadius: 3,
            overflow: 'hidden'
          }}>
            <Box sx={{ 
              width: `${pool.capacity}%`, 
              height: '100%',
              background: `linear-gradient(90deg, ${neonBlue}, ${neonCyan})`,
              boxShadow: `0 0 8px ${alpha(neonBlue, 0.5)}`
            }} />
          </Box>
          <Typography variant="caption" sx={{ 
            mt: 0.5, 
            display: 'block',
            textAlign: 'right',
            color: theme.palette.text.secondary
          }}>
            {pool.capacity}% filled
          </Typography>
        </Box>
      </Box>
    </motion.div>
  );
};

// Skeleton для состояния загрузки
export const PoolCardSkeleton: React.FC = () => (
  <Box sx={{
    p: 2.5,
    borderRadius: '14px',
    background: alpha('#0a192f', 0.6),
    border: '1px solid rgba(0, 188, 212, 0.2)'
  }}>
    <Skeleton variant="text" width="60%" height={28} sx={{ mb: 2 }} />
    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
      <Skeleton variant="rounded" width={80} height={24} />
      <Skeleton variant="rounded" width={100} height={24} />
    </Box>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
      <Skeleton variant="text" width="30%" />
      <Skeleton variant="text" width="30%" />
    </Box>
    <Skeleton variant="rounded" width="100%" height={6} sx={{ borderRadius: 3 }} />
  </Box>
);

export default PoolCard;