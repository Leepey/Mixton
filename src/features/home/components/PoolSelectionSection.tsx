// features/home/components/PoolSelectionSection.tsx
import React from 'react';
import { Box, Grid, Typography, Alert, Tooltip, Fab } from '@mui/material';
import { motion } from 'framer-motion';
import { Info, CheckCircle } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material';
import { NeonText } from '../../shared/components/ui/typography/NeonText';
import { MixPoolCard } from '../../shared/components/ui/cards/MixPoolCard';

interface PoolSelectionSectionProps {
  availablePools: any[];
  selectedPool: string;
  showInfo: boolean;
  onPoolClick: (poolId: string) => void;
  onToggleInfo: () => void;
  userConnected: boolean;
}

export const PoolSelectionSection: React.FC<PoolSelectionSectionProps> = ({
  availablePools,
  selectedPool,
  showInfo,
  onPoolClick,
  onToggleInfo,
  userConnected
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ py: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
        <Typography 
          variant="h2" 
          component="h2" 
          sx={{ 
            fontSize: { xs: '2rem', md: '2.5rem' },
            fontWeight: 700
          }}
        >
          <NeonText text="Current Mix Pools" />
        </Typography>
        
        <Tooltip title="Information about mix pools">
          <Fab 
            size="small" 
            color="info" 
            onClick={onToggleInfo}
            sx={{ zIndex: 2 }}
          >
            <Info />
          </Fab>
        </Tooltip>
      </Box>
      
      {showInfo && (
        <Alert 
          severity="info" 
          sx={{ mb: 4 }}
          onClose={onToggleInfo}
        >
          <Typography variant="body2">
            Each pool has different fee rates and delay times. Higher pools offer better privacy with lower fees but longer wait times. 
            Click on a pool to select it for mixing.
          </Typography>
        </Alert>
      )}
      
      <Grid container spacing={3} justifyContent="center">
        {availablePools.map((pool, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={pool.id}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <Box sx={{ position: 'relative' }}>
                {/* Индикатор выбранного пула */}
                {selectedPool === pool.id && (
                  <Box 
                    sx={{
                      position: 'absolute',
                      top: -10,
                      right: -10,
                      zIndex: 3,
                      backgroundColor: theme.palette.success.main,
                      borderRadius: '50%',
                      width: 24,
                      height: 24,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: `0 0 10px ${theme: 'center',
                      boxShadow.palette.success.main}`
                    }}
                  >
                    <CheckCircle sx={{ color: 'white', fontSize: 16 }} />
                  </Box>
                )}
                
                <MixPoolCard 
                  pool={pool}
                  onClick={() => onPoolClick(pool.id)}
                  disabled={!userConnected}
                  isSelected={selectedPool === pool.id}
                />
              </Box>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};