// src/features/dashboard/components/PoolsModule.tsx
import React, { useState } from 'react';
import { Grid, Typography, Paper, Box, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme, alpha } from '@mui/material/styles';
import { useMixerContext } from '../../../context/MixerContext';
import MixForm from '../../../components/forms/MixForm';
import type { Pool } from '../types/dashboard.types';

interface PoolsModuleProps {
  onPoolSelect: (poolId: string) => void;
}

const PoolsModule: React.FC<PoolsModuleProps> = ({ onPoolSelect }) => {
  const theme = useTheme();
  const { availablePools } = useMixerContext();

  const handlePoolClick = (poolId: string) => {
    onPoolSelect(poolId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        Available Mix Pools
      </Typography>
      
      <Grid container spacing={3}>
        {availablePools.map((pool: Pool) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={pool.id}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              whileHover={{ y: -10 }}
            >
              <Paper 
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.grey[900], 0.6)})`,
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alpha('#00BCD4', 0.2)}`,
                  cursor: 'pointer',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.3)}`,
                  }
                }}
                onClick={() => handlePoolClick(pool.id)}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {pool.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Min: {pool.minAmount} TON | Fee: {pool.fee}%
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <Typography variant="body2" color="text.secondary">
                    {pool.participants} participants
                  </Typography>
                  <Button 
                    size="small" 
                    variant="contained"
                    sx={{
                      borderRadius: '8px',
                      background: `linear-gradient(45deg, #00BCD4, #2196F3)`,
                    }}
                  >
                    Mix
                  </Button>
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </motion.div>
  );
};

export default PoolsModule;