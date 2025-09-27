// src/mixer/components/MixForm.tsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
  InputAdornment,
  FormHelperText,
  Alert,
  Chip,
  Divider,
  useTheme,
  alpha,
  type SelectChangeEvent,
  Card,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress
} from '@mui/material';
import { Close, Add, Remove, Schedule, ExpandMore, AccountBalanceWallet } from '@mui/icons-material';
import type { MixPool } from '../types/mixer';
import type { MixFormData } from '../types/mixer'; // Используем общий тип

interface MixFormProps {
  open: boolean;
  onClose: () => void;
  poolId?: string;
  initialData: MixFormData;
  transactionPending: boolean;
  onSubmit: (data: MixFormData) => void;
  userConnected: boolean;
  availablePools: MixPool[];
}

interface Recipient {
  address: string;
  amount: number;
  delay: number; // в секундах
}

const MixForm: React.FC<MixFormProps> = ({
  open,
  onClose,
  poolId: initialPoolId,
  initialData,
  transactionPending,
  onSubmit,
  userConnected,
  availablePools
}) => {
  const theme = useTheme();
  const [formData, setFormData] = useState<MixFormData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDistribution, setShowDistribution] = useState(false);
  const [selectedPool, setSelectedPool] = useState<MixPool | null>(
    initialPoolId ? availablePools.find(p => p.id === initialPoolId) || null : null
  );
  const [isLoadingPools, setIsLoadingPools] = useState(true);
  const [recipients, setRecipients] = useState<Recipient[]>([{ address: '', amount: 0, delay: 3600 }]);
  
  // Отладка: выводим доступные пулы в консоль
  useEffect(() => {
    console.log('Available pools in MixForm:', availablePools);
    console.log('Initial pool ID:', initialPoolId);
    console.log('Selected pool:', selectedPool);
    
    // Если пулы загружены, убираем индикатор загрузки
    if (availablePools.length > 0) {
      setIsLoadingPools(false);
    }
  }, [availablePools, initialPoolId, selectedPool]);
  
  // Сброс формы при открытии/закрытии
  React.useEffect(() => {
    if (open) {
      // Убеждаемся, что amount всегда имеет значение
      const initialAmount = initialData.amount || (selectedPool?.minAmount || 1);
      setFormData({
        ...initialData,
        amount: initialAmount,
        inputAddress: initialData.inputAddress || ''
      });
      setErrors({});
      setRecipients([{ address: '', amount: 0, delay: 3600 }]);
      
      // Если есть initialPoolId, выбираем соответствующий пул
      if (initialPoolId) {
        const pool = availablePools.find(p => p.id === initialPoolId);
        setSelectedPool(pool || null);
      }
    }
  }, [open, initialData, initialPoolId, availablePools, selectedPool?.minAmount]);
  
  // Обработчик для текстовых полей
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'amount' || name === 'fee' ? (Number(value) || 0) : value
      }));
      
      if (errors[name]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };
  
  // Обработчик для Select
  const handleSelectChange = (e: SelectChangeEvent<number | string>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData(prev => ({
        ...prev,
        [name]: typeof value === 'string' ? value : Number(value)
      }));
      
      if (errors[name]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };
  
  // Обработчик выбора пула
  const handlePoolChange = (e: SelectChangeEvent<string>) => {
    const poolId = e.target.value;
    console.log('Pool changed to:', poolId); // Отладка
    
    const pool = availablePools.find(p => p.id === poolId) || null;
    setSelectedPool(pool);
    
    // Обновляем данные формы на основе выбранного пула
    setFormData(prev => ({
      ...prev,
      mixingOption: poolId,
      amount: pool ? Math.max(prev.amount || 0, pool.minAmount) : prev.amount || 0,
      fee: pool ? pool.fee : prev.fee || 0
    }));
  };
  
  // Добавление получателя для распределения
  const addRecipient = () => {
    setRecipients(prev => [...prev, { address: '', amount: 0, delay: 3600 }]);
  };
  
  // Удаление получателя
  const removeRecipient = (index: number) => {
    if (recipients.length > 1) {
      setRecipients(prev => prev.filter((_, i) => i !== index));
    }
  };
  
  // Обновление получателя
  const updateRecipient = (index: number, field: keyof Recipient, value: string | number) => {
    setRecipients(prev => {
      const newRecipients = [...prev];
      newRecipients[index] = { ...newRecipients[index], [field]: value };
      return newRecipients;
    });
  };
  
  // Валидация формы
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.inputAddress) {
      newErrors.inputAddress = 'Input address is required';
    }
    
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Amount is required';
    } else if (selectedPool) {
      if (formData.amount < selectedPool.minAmount) {
        newErrors.amount = `Minimum amount is ${selectedPool.minAmount} TON`;
      } else if (formData.amount > selectedPool.maxAmount) {
        newErrors.amount = `Maximum amount is ${selectedPool.maxAmount} TON`;
      }
    }
    
    // Валидация получателей при распределении
    if (showDistribution) {
      const totalAmount = recipients.reduce((sum, r) => sum + r.amount, 0);
      if (totalAmount > (formData.amount || 0)) {
        newErrors.recipients = 'Total distribution amount exceeds input amount';
      }
      
      recipients.forEach((recipient, index) => {
        if (!recipient.address) {
          newErrors[`recipient_${index}_address`] = 'Address is required';
        }
        if (recipient.amount <= 0) {
          newErrors[`recipient_${index}_amount`] = 'Amount must be greater than 0';
        }
        if (recipient.delay < 300) { // Минимум 5 минут
          newErrors[`recipient_${index}_delay`] = 'Delay must be at least 5 minutes';
        }
      });
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (validateForm()) {
      const fee = selectedPool ? selectedPool.fee : (formData.fee || 0.003);
      
      onSubmit({
        ...formData,
        fee,
        mixingOption: selectedPool?.id || formData.mixingOption,
        outputAddresses: showDistribution ? recipients.map(r => r.address) : ['']
      });
    }
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.grey[900], 0.8)})`,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha('#00BCD4', 0.3)}`,
          boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.4)}`
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 2
      }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Mix TON
        </Typography>
        <IconButton onClick={onClose} sx={{ color: theme.palette.text.secondary }}>
          <Close />
        </IconButton>
      </DialogTitle>
      
      <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.2), mb: 2 }} />
      
      <DialogContent>
        {!userConnected ? (
          <Alert severity="warning" sx={{ mb: 3 }}>
            Please connect your wallet to mix TON
          </Alert>
        ) : (
          <>
            {/* Выбор пула */}
            <Grid size={{ xs: 12 }} sx={{ mb: 3 }}>
              <FormControl fullWidth>
                <InputLabel id="pool-select-label">Select Pool</InputLabel>
                <Select
                  labelId="pool-select-label"
                  value={selectedPool?.id || ''}
                  onChange={handlePoolChange}
                  label="Select Pool"
                  disabled={isLoadingPools || availablePools.length === 0}
                >
                  {isLoadingPools ? (
                    <MenuItem value="" disabled>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CircularProgress size={20} />
                        <Typography>Loading pools...</Typography>
                      </Box>
                    </MenuItem>
                  ) : availablePools.length > 0 ? (
                    availablePools.map((pool) => (
                      <MenuItem key={pool.id} value={pool.id}>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {pool.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {pool.minAmount} - {pool.maxAmount} TON | {pool.fee * 100}% fee
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="" disabled>
                      <Typography color="text.secondary">No pools available</Typography>
                    </MenuItem>
                  )}
                </Select>
                {availablePools.length === 0 && !isLoadingPools && (
                  <FormHelperText error>
                    No pools available. Please check your connection or try again later.
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            {selectedPool && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {selectedPool.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {selectedPool.description}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Chip 
                    label={`Fee: ${selectedPool.fee * 100}%`} 
                    size="small"
                    sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main
                    }}
                  />
                  <Chip 
                    label={`Range: ${selectedPool.minAmount} - ${selectedPool.maxAmount} TON`} 
                    size="small"
                    sx={{
                      bgcolor: alpha(theme.palette.secondary.main, 0.1),
                      color: theme.palette.secondary.main
                    }}
                  />
                </Box>
              </Box>
            )}
            
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Input Address"
                  name="inputAddress"
                  value={formData.inputAddress || ''}
                  onChange={handleTextChange}
                  error={!!errors.inputAddress}
                  helperText={errors.inputAddress}
                  placeholder="EQC..."
                />
              </Grid>
              
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Amount (TON)"
                  name="amount"
                  type="number"
                  value={formData.amount || ''}
                  onChange={handleTextChange}
                  error={!!errors.amount}
                  helperText={errors.amount}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">TON</InputAdornment>,
                  }}
                  inputProps={{
                    min: selectedPool?.minAmount || 0.5,
                    max: selectedPool?.maxAmount || 10000
                  }}
                />
              </Grid>
              
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Note (optional)"
                  name="note"
                  value={formData.note || ''}
                  onChange={handleTextChange}
                  multiline
                  rows={2}
                  helperText="Add a note to remember the purpose of this mix"
                />
              </Grid>
              
              {/* Распределение средств */}
              <Grid size={{ xs: 12 }}>
                <Accordion 
                  expanded={showDistribution}
                  onChange={() => setShowDistribution(!showDistribution)}
                  sx={{
                    background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.5)}, ${alpha(theme.palette.grey[900], 0.3)})`,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    '&:before': { display: 'none' }
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccountBalanceWallet />
                      <Typography>Advanced Distribution</Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Distribute funds to multiple wallets with different delays
                      </Typography>
                      
                      {recipients.map((recipient, index) => (
                        <Card key={index} sx={{ mb: 2, p: 2 }}>
                          <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                              <TextField
                                fullWidth
                                label="Recipient Address"
                                value={recipient.address}
                                onChange={(e) => updateRecipient(index, 'address', e.target.value)}
                                error={!!errors[`recipient_${index}_address`]}
                                helperText={errors[`recipient_${index}_address`]}
                                placeholder="EQC..."
                              />
                            </Grid>
                            <Grid size={{ xs: 6, md: 3 }}>
                              <TextField
                                fullWidth
                                label="Amount (TON)"
                                type="number"
                                value={recipient.amount}
                                onChange={(e) => updateRecipient(index, 'amount', Number(e.target.value))}
                                error={!!errors[`recipient_${index}_amount`]}
                                helperText={errors[`recipient_${index}_amount`]}
                              />
                            </Grid>
                            <Grid size={{ xs: 6, md: 3 }}>
                              <TextField
                                fullWidth
                                label="Delay (minutes)"
                                type="number"
                                value={recipient.delay / 60}
                                onChange={(e) => updateRecipient(index, 'delay', Number(e.target.value) * 60)}
                                error={!!errors[`recipient_${index}_delay`]}
                                helperText={errors[`recipient_${index}_delay`]}
                              />
                            </Grid>
                          </Grid>
                          
                          {recipients.length > 1 && (
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                              <IconButton 
                                onClick={() => removeRecipient(index)}
                                color="error"
                                size="small"
                              >
                                <Remove />
                              </IconButton>
                            </Box>
                          )}
                        </Card>
                      ))}
                      
                      <Button
                        startIcon={<Add />}
                        onClick={addRecipient}
                        variant="outlined"
                        size="small"
                        sx={{ mt: 1 }}
                      >
                        Add Recipient
                      </Button>
                      
                      {errors.recipients && (
                        <FormHelperText error sx={{ mt: 1 }}>
                          {errors.recipients}
                        </FormHelperText>
                      )}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </Grid>
          </>
        )}
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} disabled={transactionPending}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!userConnected || transactionPending || !selectedPool}
          sx={{
            borderRadius: '8px',
            background: `linear-gradient(45deg, #00BCD4, #2196F3)`,
          }}
        >
          {transactionPending ? 'Processing...' : 'Mix TON'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MixForm;