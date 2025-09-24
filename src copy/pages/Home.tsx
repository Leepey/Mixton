// src/pages/Home.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  useTheme,
  alpha,
  Zoom,
  Fab,
  Tooltip,
  Chip,
  Alert
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Shuffle, 
  Security, 
  Speed, 
  PrivacyTip,
  Info,
  CheckCircle
} from '@mui/icons-material';
import NeonCard from '../components/ui/cards/NeonCard';
import MixPoolCard from '../components/ui/cards/MixPoolCard';
import TransactionLoader from '../components/ui/loaders/TransactionLoader';
import NeonText from '../components/ui/typography/NeonText';
import MixForm from '../components/forms/MixForm';
import QuickMixForm from '../components/forms/QuickMixForm';
import { useAuth } from '../context/AuthContext';
import { useMixerContext } from '../context/MixerContext';
import type { MixFormData } from '../types/mixer';

const Home: React.FC = () => {
  const theme = useTheme();
  
  // Существующие состояния
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [transactionPending, setTransactionPending] = useState(false);
  const [amountError, setAmountError] = useState('');
  const [selectedPool, setSelectedPool] = useState<string>('');
  const [showInfo, setShowInfo] = useState(false);
  
  const { user, tonConnect } = useAuth();
  const { 
    mixTons, 
    availablePools,
    contractBalance
  } = useMixerContext();
  
  // Обновляем состояние при изменении доступных пулов
  useEffect(() => {
    if (availablePools.length > 0 && !selectedPool) {
      setSelectedPool(availablePools[0].id);
    }
  }, [availablePools, selectedPool]);
  
  const validateAmount = useCallback((value: string, poolId?: string) => {
    if (!value) {
      setAmountError('Amount is required');
      return false;
    }
    
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) {
      setAmountError('Please enter a valid amount');
      return false;
    }
    
    // Проверка на соответствие лимитам пула
    if (poolId) {
      const pool = availablePools.find(p => p.id === poolId);
      if (pool) {
        if (num < pool.minAmount) {
          setAmountError(`Minimum amount for ${pool.name} is ${pool.minAmount} TON`);
          return false;
        }
        if (num > pool.maxAmount) {
          setAmountError(`Maximum amount for ${pool.name} is ${pool.maxAmount} TON`);
          return false;
        }
      }
    }
    
    setAmountError('');
    return true;
  }, [availablePools]);
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    
    if (!value) {
      setAmountError('Amount is required');
    } else {
      // Валидируем с учетом выбранного пула
      validateAmount(value, selectedPool);
    }
  };
  
  const handlePoolClick = (poolId: string) => {
    if (!user?.connected) return;
    
    setSelectedPool(poolId);
    const pool = availablePools.find(p => p.id === poolId);
    if (pool) {
      setAmount(pool.minAmount.toString());
      // Автоматически валидируем при выборе пула
      validateAmount(pool.minAmount.toString(), poolId);
    }
    setShowForm(true);
  };
  
  // Обработчик для быстрого микширования
  const handleQuickMix = async () => {
    if (!validateAmount(amount, selectedPool)) return;
    
    setTransactionPending(true);
    try {
      await mixTons(parseFloat(amount), note, undefined, selectedPool);
      setAmount('');
      setNote('');
    } catch (error) {
      console.error('Mix transaction failed:', error);
    } finally {
      setTransactionPending(false);
    }
  };
  
  // Обработчик для новой формы микшера с правильными типами
  const handleMix = async (data: MixFormData) => {
    setTransactionPending(true);
    try {
      // Проверяем, что amount определен
      if (data.amount === undefined || data.amount <= 0) {
        throw new Error('Amount is required and must be greater than 0');
      }
      
      // Используем только amount и note для существующей функции mixTons
      await mixTons(data.amount, data.note, undefined, selectedPool);
      setShowForm(false);
      setNote('');
    } catch (error) {
      console.error('Mix transaction failed:', error);
    } finally {
      setTransactionPending(false);
    }
  };
  
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: `linear-gradient(135deg, #0a192f 0%, #000000 100%)`,
      color: theme.palette.text.primary,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Неоновые элементы фона с новой цветовой схемой */}
      <Box sx={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${alpha('#00BCD4', 0.15)} 0%, transparent 70%)`,
        filter: 'blur(40px)',
        zIndex: 0
      }} />
      <Box sx={{
        position: 'absolute',
        bottom: '10%',
        right: '5%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${alpha('#8BC34A', 0.15)} 0%, transparent 70%)`,
        filter: 'blur(60px)',
        zIndex: 0
      }} />
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${alpha('#2196F3', 0.1)} 0%, transparent 70%)`,
        filter: 'blur(80px)',
        zIndex: 0
      }} />
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Hero Section */}
        <Box sx={{ 
          pt: { xs: 6, md: 5 }, 
          pb: { xs: 4, md: 8 }
        }}>
          <Grid container spacing={6} alignItems="center">
            {/* Левая колонка - Форма микшера */}
            <Grid size={{ xs: 12, md: 6 }}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                {/* Информационное сообщение о балансе контракта */}
                {contractBalance && (
                  <Alert 
                    severity="info" 
                    sx={{ mb: 2 }}
                    icon={<Info />}
                    action={
                      <Chip 
                        label={`${contractBalance} TON`}
                        color="primary"
                        size="small"
                        variant="outlined"
                      />
                    }
                  >
                    Contract balance available for mixing
                  </Alert>
                )}
               
                {/* Quick Mix Form */}
                <QuickMixForm
                  amount={amount}
                  amountError={amountError}
                  transactionPending={transactionPending}
                  selectedPool={selectedPool}
                  availablePools={availablePools}
                  onAmountChange={handleAmountChange}
                  onPoolChange={(poolId) => {
                    setSelectedPool(poolId);
                    const pool = availablePools.find(p => p.id === poolId);
                    if (pool) {
                      setAmount(pool.minAmount.toString());
                      validateAmount(pool.minAmount.toString(), poolId);
                    }
                  }}
                  onSubmit={handleQuickMix}
                  onConnect={() => tonConnect?.connectWallet()}
                  onDisconnect={() => tonConnect?.disconnectWallet()}
                  userConnected={user?.connected || false}
                  userBalance={user?.balance}
                />
              </motion.div>
            </Grid>
            
            {/* Правая колонка - Изображение и описание */}
            <Grid size={{ xs: 12, md: 6 }}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    height: { xs: '300px', md: '520px' },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    color: 'white',
                  }}
                >
                  {/* Размытый фон */}
                  <Box
                    component="span"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundImage: `url(/bg.png)`,
                      backgroundSize: '700px',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      filter: 'blur(0px)',
                      transform: 'scale(1.1)',
                      zIndex: 0,
                    }}
                  />
                  {/* Полупрозрачный оверлей для улучшения читаемости */}
                  <Box
                    component="span"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(135deg, rgba(1, 19, 22, 0.24) 0%, rgba(1, 8, 36, 0.25) 100%)',
                      zIndex: 1,
                    }}
                  />
                  {/* Контент (текст) */}
                  <Box sx={{ zIndex: 2, textAlign: 'center', px: 2 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 600,
                        mb: 2,
                        textShadow: '0 2px 10px rgba(0,0,0,0.4)',
                      }}
                    >
                      Secure & Anonymous TON Mixing
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        maxWidth: '400px',
                        lineHeight: 1.6,
                        textShadow: '0 1px 5px rgba(0,0,0,0.4)',
                      }}
                    >
                      Our advanced mixing technology ensures your financial activity remains completely confidential with zero-knowledge proofs and multi-hop transactions.
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Box>
        
        {/* Features Section */}
        <Box sx={{ py: 8 }}>
          <Typography 
            variant="h2" 
            component="h2" 
            gutterBottom
            sx={{ 
              textAlign: 'center', 
              mb: 6,
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 700
            }}
          >
            <NeonText text="Why Choose TON Mixer?" />
          </Typography>
          
          <Grid container spacing={4}>
            {[
              {
                icon: <Security />,
                title: "Zero-Knowledge Proofs",
                description: "Your transactions are completely private with cryptographic guarantees that ensure your financial privacy"
              },
              {
                icon: <Speed />,
                title: "Multi-Hop Mixing",
                description: "Funds pass through multiple nodes and randomized paths to ensure maximum anonymity and unlinkability"
              },
              {
                icon: <PrivacyTip />,
                title: "No KYC Required",
                description: "No personal information needed - complete privacy from start to finish with no registration required"
              }
            ].map((feature, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  viewport={{ once: true }}
                >
                  <NeonCard 
                    title={feature.title} 
                    icon={feature.icon}
                    body={
                      <Typography variant="body1" color="text.secondary">
                        {feature.description}
                      </Typography>
                    }
                  />
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
        
        {/* Mix Pools Section */}
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
                onClick={() => setShowInfo(!showInfo)}
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
              onClose={() => setShowInfo(false)}
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
                          justifyContent: 'center',
                          boxShadow: `0 0 10px ${theme.palette.success.main}`
                        }}
                      >
                        <CheckCircle sx={{ color: 'white', fontSize: 16 }} />
                      </Box>
                    )}
                    
                    <MixPoolCard 
                      pool={pool}
                      onClick={() => handlePoolClick(pool.id)}
                      disabled={!user?.connected}
                      isSelected={selectedPool === pool.id}
                    />
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
      
      {/* Floating Action Button для быстрого доступа */}
      {user?.connected && (
        <Zoom in={true}>
          <Fab
            color="secondary"
            aria-label="mix"
            sx={{
              position: 'fixed',
              bottom: 30,
              right: 30,
              width: 60,
              height: 60,
              background: 'linear-gradient(45deg, #8BC34A, #2196F3)',
              boxShadow: `0 4px 20px ${alpha('#8BC34A', 0.5)}`,
              zIndex: 1000,
              '&:hover': {
                background: 'linear-gradient(45deg, #7CB342, #1976D2)',
              }
            }}
            onClick={() => setShowForm(true)}
          >
            <Shuffle fontSize="large" />
          </Fab>
        </Zoom>
      )}
      
      {/* Mix Form Modal */}
      <MixForm
        open={showForm}
        onClose={() => {
          setShowForm(false);
          setAmountError('');
        }}
        onSubmit={handleMix}
        poolId={selectedPool}
        initialData={{
          inputAddress: '',
          amount: selectedPool ? availablePools.find(p => p.id === selectedPool)?.minAmount : 1,
          mixingOption: 'standard',
          outputAddresses: [''],
          note: note,
        }}
        transactionPending={transactionPending}
        userConnected={user?.connected || false}
        availablePools={availablePools}
      />
      
      <TransactionLoader 
        open={transactionPending} 
        message="Processing your transaction..."
      />
    </Box>
  );
};

export default Home;