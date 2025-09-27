// features/admin/components/ContractSettingsComponent.tsx
import React from 'react';
import { Grid, Box, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material';
import { useMixerContext } from '../../../context/MixerContext';
import { fromNano } from '@ton/core';

export const ContractSettingsComponent: React.FC = () => {
  const theme = useTheme();
  const { feeRates, limits, delays, stats } = useMixerContext();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {feeRates && limits && delays && (
        <Grid size={{ xs: 12 }}>
          <Paper 
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '16px',
              background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.grey[900], 0.6)})`,
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha('#FF5722', 0.2)}`,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Contract Pool Information
            </Typography>
            
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Basic Pool Fee
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {feeRates.basicRate}%
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Standard Pool Fee
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {feeRates.standardRate}%
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Premium Pool Fee
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {feeRates.premiumRate}%
                  </Typography>
                </Box>
              </Grid>
              
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Min Deposit
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {fromNano(limits.minDeposit)} TON
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Max Deposit
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {fromNano(limits.maxDeposit)} TON
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Min Withdraw
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {fromNano(limits.minWithdraw)} TON
                  </Typography>
                </Box>
              </Grid>
              
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Basic Pool Delay
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {delays.basicDelay / 3600} hours
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Standard Pool Delay
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {delays.standardDelay / 3600} hours
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Premium Pool Delay
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {delays.premiumDelay / 3600} hours
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      )}
      
      {stats && (
        <Grid size={{ xs: 12 }}>
          <Paper 
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '16px',
              background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.grey[900], 0.6)})`,
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha('#FF5722', 0.2)}`,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Contract Statistics
            </Typography>
            
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Deposits
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {stats.totalDeposits}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid size={{ xs: 12, md: 6 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Withdrawn
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {stats.totalWithdrawn}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      )}
    </motion.div>
  );
};