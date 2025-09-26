// features/admin/components/ContractSettings.tsx
import React from 'react';
import { Grid, TextField, Button, Box, Typography, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material';
import { useUserManagement } from '../hooks/useUserManagement';

export const ContractSettings: React.FC = () => {
  const theme = useTheme();
  const { 
    adminSettings, 
    loading, 
    handleSettingsChange, 
    handleSaveSettings 
  } = useUserManagement();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper 
        elevation={0}
        sx={{
          p: 4,
          borderRadius: '16px',
          background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.grey[900], 0.6)})`,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha('#FF5722', 0.2)}`,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 4 }}>
          Contract Settings
        </Typography>
        
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Fee Rate"
              name="feeRate"
              type="number"
              value={adminSettings.feeRate}
              onChange={handleSettingsChange}
              InputProps={{
                endAdornment: <Typography variant="body2">%</Typography>,
              }}
              helperText="Transaction fee percentage"
            />
          </Grid>
          
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Min Amount"
              name="minAmount"
              type="number"
              value={adminSettings.minAmount}
              onChange={handleSettingsChange}
              InputProps={{
                endAdornment: <Typography variant="body2">TON</Typography>,
              }}
              helperText="Minimum amount for mixing"
            />
          </Grid>
          
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Max Amount"
              name="maxAmount"
              type="number"
              value={adminSettings.maxAmount}
              onChange={handleSettingsChange}
              InputProps={{
                endAdornment: <Typography variant="body2">TON</Typography>,
              }}
              helperText="Maximum amount for mixing"
            />
          </Grid>
          
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Process Interval"
              name="processInterval"
              type="number"
              value={adminSettings.processInterval}
              onChange={handleSettingsChange}
              InputProps={{
                endAdornment: <Typography variant="body2">seconds</Typography>,
              }}
              helperText="Automatic queue processing interval"
            />
          </Grid>
          
          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="contained"
                onClick={handleSaveSettings}
                disabled={loading}
                sx={{
                  borderRadius: '8px',
                  background: `linear-gradient(45deg, #FF5722, #FFC107)`,
                }}
              >
                Save Settings
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </motion.div>
  );
};