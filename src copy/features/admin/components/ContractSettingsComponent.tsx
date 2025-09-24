// src/features/admin/components/ContractSettingsComponent.tsx
import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  TextField, 
  Button, 
  Alert,
  Divider,
  Card,
  CardContent,
  CardHeader,
  IconButton,
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Save, 
  Refresh,
  Settings,
  Paid,
  Schedule,
} from '@mui/icons-material';
import { useContractManagement } from '../hooks/useContractManagement';
import type { ContractSettings } from '../types/admin.types';

export const ContractSettingsComponent: React.FC = () => {
  const { 
    settings, 
    loading, 
    updating, 
    errors, 
    updateSettings, 
    refreshSettings 
  } = useContractManagement();
  
  const [formSettings, setFormSettings] = useState<ContractSettings | null>(null);

  React.useEffect(() => {
    if (settings) {
      setFormSettings(settings);
    }
  }, [settings]);

  const handleFeeRateChange = (pool: keyof ContractSettings['feeRates'], value: string) => {
    if (!formSettings) return;
    setFormSettings({
      ...formSettings,
      feeRates: {
        ...formSettings.feeRates,
        [pool]: parseFloat(value) / 100,
      },
    });
  };

  const handleLimitChange = (limit: keyof ContractSettings['limits'], value: string) => {
    if (!formSettings) return;
    setFormSettings({
      ...formSettings,
      limits: {
        ...formSettings.limits,
        [limit]: parseFloat(value),
      },
    });
  };

  const handleDelayChange = (delay: keyof ContractSettings['delays'], value: string) => {
    if (!formSettings) return;
    setFormSettings({
      ...formSettings,
      delays: {
        ...formSettings.delays,
        [delay]: parseInt(value),
      },
    });
  };

  const handlePoolChange = (
    pool: keyof ContractSettings['pools'],
    field: 'min' | 'max' | 'participants',
    value: string
  ) => {
    if (!formSettings) return;
    setFormSettings({
      ...formSettings,
      pools: {
        ...formSettings.pools,
        [pool]: {
          ...formSettings.pools[pool],
          [field]: field === 'participants' ? parseInt(value) : parseFloat(value),
        },
      },
    });
  };

  const handleSave = async () => {
    if (formSettings) {
      await updateSettings(formSettings);
    }
  };

  if (loading || !formSettings) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography>Loading contract settings...</Typography>
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
          Contract Settings
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={refreshSettings}
            disabled={loading}
            sx={{ mr: 2 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSave}
            disabled={updating}
          >
            Save Changes
          </Button>
        </Box>
      </Box>

      {errors.length > 0 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Fee Rates */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card 
            elevation={0}
            sx={{
              borderRadius: '16px',
              background: `linear-gradient(145deg, rgba(255, 255, 255, 0.05), rgba(0, 0, 0, 0.2))`,
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <CardHeader 
              title="Fee Rates" 
              avatar={<Paid />}
              titleTypographyProps={{ variant: 'h6' }}
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Basic Pool Fee (%)"
                    type="number"
                    value={formSettings.feeRates.basic * 100}
                    onChange={(e) => handleFeeRateChange('basic', e.target.value)}
                    inputProps={{ step: 0.1, min: 0, max: 10 }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Standard Pool Fee (%)"
                    type="number"
                    value={formSettings.feeRates.standard * 100}
                    onChange={(e) => handleFeeRateChange('standard', e.target.value)}
                    inputProps={{ step: 0.1, min: 0, max: 10 }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Premium Pool Fee (%)"
                    type="number"
                    value={formSettings.feeRates.premium * 100}
                    onChange={(e) => handleFeeRateChange('premium', e.target.value)}
                    inputProps={{ step: 0.1, min: 0, max: 10 }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Limits */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card 
            elevation={0}
            sx={{
              borderRadius: '16px',
              background: `linear-gradient(145deg, rgba(255, 255, 255, 0.05), rgba(0, 0, 0, 0.2))`,
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <CardHeader 
              title="Limits" 
              avatar={<Settings />}
              titleTypographyProps={{ variant: 'h6' }}
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Min Deposit (TON)"
                    type="number"
                    value={formSettings.limits.minDeposit}
                    onChange={(e) => handleLimitChange('minDeposit', e.target.value)}
                    inputProps={{ step: 0.1, min: 0 }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Max Deposit (TON)"
                    type="number"
                    value={formSettings.limits.maxDeposit}
                    onChange={(e) => handleLimitChange('maxDeposit', e.target.value)}
                    inputProps={{ step: 0.1, min: 0 }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Min Withdraw (TON)"
                    type="number"
                    value={formSettings.limits.minWithdraw}
                    onChange={(e) => handleLimitChange('minWithdraw', e.target.value)}
                    inputProps={{ step: 0.1, min: 0 }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Max Withdraw (TON)"
                    type="number"
                    value={formSettings.limits.maxWithdraw}
                    onChange={(e) => handleLimitChange('maxWithdraw', e.target.value)}
                    inputProps={{ step: 0.1, min: 0 }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Delays */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card 
            elevation={0}
            sx={{
              borderRadius: '16px',
              background: `linear-gradient(145deg, rgba(255, 255, 255, 0.05), rgba(0, 0, 0, 0.2))`,
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <CardHeader 
              title="Delays" 
              avatar={<Schedule />}
              titleTypographyProps={{ variant: 'h6' }}
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Min Delay (hours)"
                    type="number"
                    value={formSettings.delays.minDelay}
                    onChange={(e) => handleDelayChange('minDelay', e.target.value)}
                    inputProps={{ step: 1, min: 0 }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Max Delay (hours)"
                    type="number"
                    value={formSettings.delays.maxDelay}
                    onChange={(e) => handleDelayChange('maxDelay', e.target.value)}
                    inputProps={{ step: 1, min: 0 }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Pool Settings */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card 
            elevation={0}
            sx={{
              borderRadius: '16px',
              background: `linear-gradient(145deg, rgba(255, 255, 255, 0.05), rgba(0, 0, 0, 0.2))`,
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <CardHeader 
              title="Pool Settings" 
              avatar={<Settings />}
              titleTypographyProps={{ variant: 'h6' }}
            />
            <CardContent>
              <Grid container spacing={2}>
                {(['basic', 'standard', 'premium'] as const).map((pool) => (
                  <React.Fragment key={pool}>
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        {pool.charAt(0).toUpperCase() + pool.slice(1)} Pool
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <TextField
                        fullWidth
                        label="Min Amount"
                        type="number"
                        value={formSettings.pools[pool].min}
                        onChange={(e) => handlePoolChange(pool, 'min', e.target.value)}
                        inputProps={{ step: 0.1, min: 0 }}
                      />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <TextField
                        fullWidth
                        label="Max Amount"
                        type="number"
                        value={formSettings.pools[pool].max}
                        onChange={(e) => handlePoolChange(pool, 'max', e.target.value)}
                        inputProps={{ step: 0.1, min: 0 }}
                      />
                    </Grid>
                  </React.Fragment>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </motion.div>
  );
};