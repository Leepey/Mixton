// src/features/home/components/AdvancedMixSection.tsx
import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Button, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Chip, 
  Divider,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  type SelectChangeEvent
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Shuffle, 
  Info, 
  Security, 
  Speed, 
  Timer, 
  AttachMoney,
  Add,
  Remove,
  HelpOutline
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../auth/components/AuthProvider';
import { NeonCard } from '../../shared/components/ui/cards/NeonCard';
import { MixButton } from '../../shared/components/ui/buttons/MixButton';
import { formatAmount } from '../../shared/utils/formatUtils';

interface OutputAddress {
  id: string;
  value: string;
}

interface MixFormData {
  amount: number;
  poolType: 'basic' | 'standard' | 'premium';
  delayHours: number;
  outputAddresses: OutputAddress[];
  note?: string;
}

const poolOptions = [
  {
    value: 'basic' as const,
    label: 'Basic Pool',
    description: 'Fast and affordable mixing',
    fee: 0.1,
    minAmount: 0.01,
    maxAmount: 10,
    estimatedTime: '1-2 hours',
    color: '#4CAF50'
  },
  {
    value: 'standard' as const,
    label: 'Standard Pool',
    description: 'Balanced privacy and speed',
    fee: 0.3,
    minAmount: 0.1,
    maxAmount: 50,
    estimatedTime: '2-4 hours',
    color: '#2196F3'
  },
  {
    value: 'premium' as const,
    label: 'Premium Pool',
    description: 'Maximum privacy and security',
    fee: 0.5,
    minAmount: 1,
    maxAmount: 100,
    estimatedTime: '4-8 hours',
    color: '#9C27B0'
  }
];

export const AdvancedMixSection: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  
  const [formData, setFormData] = useState<MixFormData>({
    amount: 1,
    poolType: 'standard',
    delayHours: 3,
    outputAddresses: [
      { id: '1', value: '' }
    ],
    note: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const selectedPool = poolOptions.find(pool => pool.value === formData.poolType);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Валидация суммы
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    } else if (selectedPool && formData.amount < selectedPool.minAmount) {
      newErrors.amount = `Minimum amount is ${selectedPool.minAmount} TON`;
    } else if (selectedPool && formData.amount > selectedPool.maxAmount) {
      newErrors.amount = `Maximum amount is ${selectedPool.maxAmount} TON`;
    }

    // Валидация выходных адресов
    const validAddresses = formData.outputAddresses.filter(addr => addr.value.trim() !== '');
    if (validAddresses.length === 0) {
      newErrors.outputAddresses = 'At least one output address is required';
    }

    // Валидация задержки
    if (!formData.delayHours || formData.delayHours <= 0) {
      newErrors.delayHours = 'Delay must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const amount = parseFloat(value) || 0;
    setFormData(prev => ({ ...prev, amount }));
    
    // Очищаем ошибку при изменении
    if (errors.amount) {
      setErrors(prev => ({ ...prev, amount: '' }));
    }
  };

  const handleDelayChange = (event: SelectChangeEvent<number>) => {
    const value = event.target.value;
    const delayHours = typeof value === 'string' ? parseInt(value) || 0 : value;
    setFormData(prev => ({ ...prev, delayHours }));
    
    // Очищаем ошибку при изменении
    if (errors.delayHours) {
      setErrors(prev => ({ ...prev, delayHours: '' }));
    }
  };

  const handleOutputAddressChange = (id: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      outputAddresses: prev.outputAddresses.map(addr =>
        addr.id === id ? { ...addr, value } : addr
      )
    }));
    
    // Очищаем ошибку при изменении
    if (errors.outputAddresses) {
      setErrors(prev => ({ ...prev, outputAddresses: '' }));
    }
  };

  const handleNoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, note: value }));
  };

  const addOutputAddress = () => {
    setFormData(prev => ({
      ...prev,
      outputAddresses: [
        ...prev.outputAddresses,
        { id: Date.now().toString(), value: '' }
      ]
    }));
  };

  const removeOutputAddress = (id: string) => {
    if (formData.outputAddresses.length > 1) {
      setFormData(prev => ({
        ...prev,
        outputAddresses: prev.outputAddresses.filter(addr => addr.id !== id)
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Проверяем, подключен ли пользователь
    if (!user?.connected) {
      navigate('/auth', { 
        state: { from: location.pathname, message: 'Please connect your wallet to mix TON' }
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Здесь будет логика отправки транзакции
      console.log('Submitting mix form:', formData);
      
      // Имитация задержки для демонстрации
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Показываем уведомление об успехе
      alert('Mix request submitted successfully!');
      
      // Сброс формы
      setFormData({
        amount: 1,
        poolType: 'standard',
        delayHours: 3,
        outputAddresses: [{ id: '1', value: '' }],
        note: ''
      });
      
    } catch (error) {
      console.error('Error submitting mix form:', error);
      alert('Failed to submit mix request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ py: 12, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Заголовок секции */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h3" 
              component="h2" 
              sx={{ 
                fontWeight: 700, 
                mb: 2,
                background: `linear-gradient(45deg, #00BCD4, #2196F3)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Advanced Mixing
            </Typography>
            
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{ mb: 4, maxWidth: '600px', mx: 'auto' }}
            >
              Customize your mixing parameters for enhanced privacy and security
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {/* Форма миксинга */}
            <Grid size={{ xs: 12, lg: 8 }}>
              <Paper 
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: '16px',
                  background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.grey[900], 0.6)})`,
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                }}
              >
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    {/* Выбор пула */}
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Shuffle sx={{ color: theme.palette.primary.main }} />
                        Select Mixing Pool
                      </Typography>
                      
                      <Grid container spacing={2}>
                        {poolOptions.map((pool) => (
                          <Grid size={{ xs: 12, sm: 4 }} key={pool.value}>
                            <Paper 
                              elevation={0}
                              sx={{
                                p: 3,
                                borderRadius: '12px',
                                border: `2px solid ${formData.poolType === pool.value ? alpha(pool.color, 0.5) : alpha(theme.palette.divider, 0.2)}`,
                                background: formData.poolType === pool.value ? alpha(pool.color, 0.1) : 'transparent',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  borderColor: pool.color,
                                  backgroundColor: alpha(pool.color, 0.1),
                                  transform: 'translateY(-2px)'
                                }
                              }}
                              onClick={() => setFormData(prev => ({ ...prev, poolType: pool.value }))}
                            >
                              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: pool.color }}>
                                {pool.label}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                {pool.description}
                              </Typography>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="body2">
                                  Fee: {pool.fee}%
                                </Typography>
                                <Chip 
                                  label={pool.estimatedTime}
                                  size="small"
                                  sx={{ 
                                    backgroundColor: alpha(pool.color, 0.1),
                                    color: pool.color,
                                    fontWeight: 500
                                  }}
                                />
                              </Box>
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>

                    {/* Сумма для миксинга */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AttachMoney sx={{ color: theme.palette.primary.main }} />
                        Amount to Mix
                      </Typography>
                      
                      <TextField
                        fullWidth
                        type="number"
                        value={formData.amount}
                        onChange={handleAmountChange}
                        error={!!errors.amount}
                        helperText={errors.amount || `Range: ${selectedPool?.minAmount} - ${selectedPool?.maxAmount} TON`}
                        InputProps={{
                          endAdornment: <Typography variant="body2">TON</Typography>,
                        }}
                        placeholder="Enter amount"
                      />
                    </Grid>

                    {/* Время задержки */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Timer sx={{ color: theme.palette.primary.main }} />
                        Delay Period
                      </Typography>
                      
                      <FormControl fullWidth error={!!errors.delayHours}>
                        <InputLabel>Delay (hours)</InputLabel>
                        <Select
                          value={formData.delayHours}
                          onChange={handleDelayChange}
                          label="Delay (hours)"
                        >
                          <MenuItem value={1}>1 hour</MenuItem>
                          <MenuItem value={2}>2 hours</MenuItem>
                          <MenuItem value={3}>3 hours</MenuItem>
                          <MenuItem value={4}>4 hours</MenuItem>
                          <MenuItem value={6}>6 hours</MenuItem>
                          <MenuItem value={8}>8 hours</MenuItem>
                          <MenuItem value={12}>12 hours</MenuItem>
                          <MenuItem value={24}>24 hours</MenuItem>
                        </Select>
                        {errors.delayHours && (
                          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                            {errors.delayHours}
                          </Typography>
                        )}
                      </FormControl>
                    </Grid>

                    {/* Выходные адреса */}
                    <Grid size={{ xs: 12 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Security sx={{ color: theme.palette.primary.main }} />
                          Output Addresses
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Tooltip title="Add more addresses for better privacy">
                            <IconButton 
                              onClick={addOutputAddress}
                              size="small"
                              sx={{ 
                                color: theme.palette.primary.main,
                                '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.1) }
                              }}
                            >
                              <Add />
                            </IconButton>
                          </Tooltip>
                          
                          <Tooltip title="Learn about output addresses">
                            <IconButton 
                              onClick={() => setShowHelp(!showHelp)}
                              size="small"
                              color={showHelp ? 'primary' : 'default'}
                            >
                              <HelpOutline />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                      
                      {showHelp && (
                        <Paper 
                          elevation={0}
                          sx={{
                            p: 2,
                            mb: 2,
                            borderRadius: '8px',
                            backgroundColor: alpha(theme.palette.info.main, 0.1),
                            border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            Adding multiple output addresses enhances privacy by distributing the mixed funds across different destinations.
                          </Typography>
                        </Paper>
                      )}
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {formData.outputAddresses.map((address, index) => (
                          <Box key={address.id} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <TextField
                              fullWidth
                              value={address.value}
                              onChange={(e) => handleOutputAddressChange(address.id, e as React.ChangeEvent<HTMLInputElement>)}
                              placeholder={`Output address ${index + 1}`}
                              error={!!errors.outputAddresses && index === 0}
                            />
                            {formData.outputAddresses.length > 1 && (
                              <IconButton 
                                onClick={() => removeOutputAddress(address.id)}
                                size="small"
                                color="error"
                              >
                                <Remove />
                              </IconButton>
                            )}
                          </Box>
                        ))}
                        
                        {errors.outputAddresses && (
                          <Typography variant="body2" color="error">
                            {errors.outputAddresses}
                          </Typography>
                        )}
                      </Box>
                    </Grid>

                    {/* Примечание */}
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        value={formData.note}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData(prev => ({ ...prev, note: value }));
                        }}
                        placeholder="Add a note (optional)"
                        label="Note"
                      />
                    </Grid>

                    {/* Информация о транзакции */}
                    <Grid size={{ xs: 12 }}>
                      <Paper 
                        elevation={0}
                        sx={{
                          p: 3,
                          borderRadius: '12px',
                          backgroundColor: alpha(theme.palette.background.paper, 0.5),
                          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                        }}
                      >
                        <Grid container spacing={2}>
                          <Grid size={{ xs: 6, sm: 3 }}>
                            <Typography variant="body2" color="text.secondary">
                              Fee Rate
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {selectedPool?.fee}%
                            </Typography>
                          </Grid>
                          
                          <Grid size={{ xs: 6, sm: 3 }}>
                            <Typography variant="body2" color="text.secondary">
                              Fee Amount
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {formatAmount(formData.amount * (selectedPool?.fee || 0) / 100)} TON
                            </Typography>
                          </Grid>
                          
                          <Grid size={{ xs: 6, sm: 3 }}>
                            <Typography variant="body2" color="text.secondary">
                              You'll Receive
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {formatAmount(formData.amount * (1 - (selectedPool?.fee || 0) / 100))} TON
                            </Typography>
                          </Grid>
                          
                          <Grid size={{ xs: 6, sm: 3 }}>
                            <Typography variant="body2" color="text.secondary">
                              Estimated Time
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {selectedPool?.estimatedTime}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>

                    {/* Кнопка отправки */}
                    <Grid size={{ xs: 12 }}>
                      <MixButton
                        type="submit"
                        disabled={isSubmitting || !user?.connected}
                        loading={isSubmitting}
                        fullWidth
                        sx={{ py: 1.5 }}
                      >
                        {user?.connected ? 'Start Mixing' : 'Connect Wallet to Mix'}
                      </MixButton>
                    </Grid>
                  </Grid>
                </form>
              </Paper>
            </Grid>

            {/* Информационная панель */}
            <Grid size={{ xs: 12, lg: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Карточка безопасности */}
                <NeonCard 
                  title="Security Features"
                  icon={<Security />}
                  glowColor="#4CAF50"
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Speed sx={{ color: '#4CAF50' }} />
                      <Typography variant="body2">
                        Instant transaction processing
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Timer sx={{ color: '#4CAF50' }} />
                      <Typography variant="body2">
                        Customizable delay periods
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Shuffle sx={{ color: '#4CAF50' }} />
                      <Typography variant="body2">
                        Multi-output distribution
                      </Typography>
                    </Box>
                  </Box>
                </NeonCard>

                {/* Карточка преимуществ */}
                <NeonCard 
                  title="Why Advanced Mixing?"
                  icon={<Info />}
                  glowColor="#2196F3"
                >
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    Advanced mixing provides enhanced privacy by allowing you to customize 
                    every aspect of the mixing process. Choose your preferred pool, 
                    set custom delays, and distribute funds across multiple addresses 
                    for maximum anonymity.
                  </Typography>
                </NeonCard>

                {/* Статистика */}
                <NeonCard 
                  title="Current Pool Stats"
                  icon={<Shuffle />}
                  glowColor="#FF9800"
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        Active Users
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {selectedPool?.label === 'Basic' ? '45' : 
                         selectedPool?.label === 'Standard' ? '32' : '18'}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        Total Liquidity
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {selectedPool?.label === 'Basic' ? '1,250' : 
                         selectedPool?.label === 'Standard' ? '2,890' : '5,670'} TON
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        Success Rate
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        99.8%
                      </Typography>
                    </Box>
                  </Box>
                </NeonCard>
              </Box>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};