// src/features/admin/components/ContractSettings.tsx
import React from 'react';
import {
  Grid,
  TextField,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Alert,
  Divider,
  Switch,
  FormControlLabel,
  Chip,
  Paper,
  Stack
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material';
import { motion } from 'framer-motion';
import {
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  AccountBalance as AccountBalanceIcon
} from '@mui/icons-material';

// Интерфейс для настроек контракта
interface ContractSettingsData {
  fee: number;
  minAmount: number;
  maxAmount: number;
  queueInterval: number;
  status: 'active' | 'maintenance' | 'paused';
  autoProcess: boolean;
  maxRecipients: number;
  anonymityLevel: number;
  contractAddress: string;
  lastUpdated?: string;
}

// Интерфейс для пропсов компонента
interface ContractSettingsProps {
  settings?: ContractSettingsData;
  loading?: boolean;
  onSave: (settings: Partial<ContractSettingsData>) => Promise<void>;
  onReset?: () => void;
}

// Дефолтные настройки
const DEFAULT_SETTINGS: ContractSettingsData = {
  fee: 1.0,
  minAmount: 0.1,
  maxAmount: 1000,
  queueInterval: 30,
  status: 'active',
  autoProcess: true,
  maxRecipients: 5,
  anonymityLevel: 3,
  contractAddress: 'EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c'
};

export const ContractSettings: React.FC<ContractSettingsProps> = ({
  settings = DEFAULT_SETTINGS,
  loading = false,
  onSave,
  onReset
}) => {
  const theme = useTheme();
  const [localSettings, setLocalSettings] = React.useState<ContractSettingsData>(settings);
  const [hasChanges, setHasChanges] = React.useState(false);

  React.useEffect(() => {
    setLocalSettings(settings);
    setHasChanges(false);
  }, [settings]);

  const handleSettingChange = (key: keyof ContractSettingsData, value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (onSave) {
      await onSave(localSettings);
      setHasChanges(false);
    }
  };

  const handleReset = () => {
    if (onReset) {
      onReset();
    } else {
      setLocalSettings(DEFAULT_SETTINGS);
      setHasChanges(true);
    }
  };

  const handleNumberChange = (key: keyof ContractSettingsData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      handleSettingChange(key, value);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)',
          background: alpha(theme.palette.background.paper, 0.05),
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Заголовок */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <SettingsIcon 
              sx={{ 
                mr: 2, 
                fontSize: 32,
                color: theme.palette.primary.main 
              }} 
            />
            <Box>
              <Typography 
                variant="h4" 
                component="h2" 
                fontWeight="bold"
                sx={{ 
                  background: 'linear-gradient(45deg, #8BC34A, #2196F3)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Contract Settings
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Configure smart contract parameters and behavior
              </Typography>
            </Box>
          </Box>

          {/* Основные настройки */}
          <Grid container spacing={3}>
            {/* Комиссия */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper 
                sx={{ 
                  p: 2, 
                  background: alpha(theme.palette.background.paper, 0.02),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AccountBalanceIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Typography variant="subtitle1" fontWeight="bold">
                    Transaction Fee
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  label="Fee Percentage"
                  type="number"
                  value={localSettings.fee}
                  onChange={handleNumberChange('fee')}
                  inputProps={{ 
                    min: 0, 
                    max: 10, 
                    step: 0.1,
                    inputMode: 'decimal'
                  }}
                  helperText="Fee percentage per transaction (0-10%)"
                  size="small"
                />
              </Paper>
            </Grid>

            {/* Лимиты */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper 
                sx={{ 
                  p: 2, 
                  background: alpha(theme.palette.background.paper, 0.02),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <SpeedIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Typography variant="subtitle1" fontWeight="bold">
                    Amount Limits
                  </Typography>
                </Box>
                <Stack spacing={1}>
                  <TextField
                    fullWidth
                    label="Minimum Amount (TON)"
                    type="number"
                    value={localSettings.minAmount}
                    onChange={handleNumberChange('minAmount')}
                    inputProps={{ 
                      min: 0.001, 
                      step: 0.001,
                      inputMode: 'decimal'
                    }}
                    size="small"
                  />
                  <TextField
                    fullWidth
                    label="Maximum Amount (TON)"
                    type="number"
                    value={localSettings.maxAmount}
                    onChange={handleNumberChange('maxAmount')}
                    inputProps={{ 
                      min: 0.1, 
                      step: 0.1,
                      inputMode: 'decimal'
                    }}
                    size="small"
                  />
                </Stack>
              </Paper>
            </Grid>

            {/* Обработка очереди */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper 
                sx={{ 
                  p: 2, 
                  background: alpha(theme.palette.background.paper, 0.02),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <RefreshIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Typography variant="subtitle1" fontWeight="bold">
                    Queue Processing
                  </Typography>
                </Box>
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    label="Processing Interval (seconds)"
                    type="number"
                    value={localSettings.queueInterval}
                    onChange={handleNumberChange('queueInterval')}
                    inputProps={{ 
                      min: 5, 
                      max: 300, 
                      step: 1,
                      inputMode: 'numeric'
                    }}
                    helperText="How often to process the queue"
                    size="small"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={localSettings.autoProcess}
                        onChange={(e) => handleSettingChange('autoProcess', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Auto-process transactions"
                  />
                </Stack>
              </Paper>
            </Grid>

            {/* Статус и безопасность */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper 
                sx={{ 
                  p: 2, 
                  background: alpha(theme.palette.background.paper, 0.02),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <SecurityIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Typography variant="subtitle1" fontWeight="bold">
                    Security & Status
                  </Typography>
                </Box>
                <Stack spacing={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Contract Status</InputLabel>
                    <Select
                      value={localSettings.status}
                      onChange={(e) => handleSettingChange('status', e.target.value)}
                      label="Contract Status"
                    >
                      <MenuItem value="active">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Chip 
                            label="Active" 
                            color="success" 
                            size="small" 
                            sx={{ mr: 1 }}
                          />
                          Operational
                        </Box>
                      </MenuItem>
                      <MenuItem value="maintenance">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Chip 
                            label="Maintenance" 
                            color="warning" 
                            size="small" 
                            sx={{ mr: 1 }}
                          />
                          Under maintenance
                        </Box>
                      </MenuItem>
                      <MenuItem value="paused">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Chip 
                            label="Paused" 
                            color="error" 
                            size="small" 
                            sx={{ mr: 1 }}
                          />
                          Temporarily paused
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>
                  
                  <TextField
                    fullWidth
                    label="Max Recipients"
                    type="number"
                    value={localSettings.maxRecipients}
                    onChange={handleNumberChange('maxRecipients')}
                    inputProps={{ 
                      min: 1, 
                      max: 10, 
                      step: 1,
                      inputMode: 'numeric'
                    }}
                    helperText="Maximum recipients per transaction"
                    size="small"
                  />
                </Stack>
              </Paper>
            </Grid>

            {/* Адрес контракта */}
            <Grid size={{ xs: 12 }}>
              <Paper 
                sx={{ 
                  p: 2, 
                  background: alpha(theme.palette.background.paper, 0.02),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                  Contract Address
                </Typography>
                <TextField
                  fullWidth
                  value={localSettings.contractAddress}
                  onChange={(e) => handleSettingChange('contractAddress', e.target.value)}
                  helperText="Smart contract address for mixing operations"
                  size="small"
                  InputProps={{
                    readOnly: true,
                    sx: { fontFamily: 'monospace' }
                  }}
                />
              </Paper>
            </Grid>
          </Grid>

          {/* Кнопки действий */}
          <Divider sx={{ my: 3 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              {hasChanges && (
                <Alert severity="info" sx={{ mb: 0 }}>
                  You have unsaved changes
                </Alert>
              )}
            </Box>
            
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                onClick={handleReset}
                disabled={loading}
                startIcon={<RefreshIcon />}
              >
                Reset to Default
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={loading || !hasChanges}
                startIcon={<SaveIcon />}
                sx={{
                  background: 'linear-gradient(45deg, #8BC34A, #2196F3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #7CB342, #1976D2)',
                  }
                }}
              >
                {loading ? 'Saving...' : 'Save Settings'}
              </Button>
            </Stack>
          </Box>

          {/* Информация о последнем обновлении */}
          {localSettings.lastUpdated && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Last updated: {new Date(localSettings.lastUpdated).toLocaleString()}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};