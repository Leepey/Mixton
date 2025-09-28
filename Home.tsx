// src/pages/Home.tsx
import React, { useState, useCallback } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  useTheme,
  alpha,
  Zoom,
  Fab,
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Shuffle, 
  Security, 
  Speed, 
  PrivacyTip,
} from '@mui/icons-material';
import NeonCard from '../components/ui/cards/NeonCard';
import MixPoolCard from '../components/ui/cards/MixPoolCard';
import TransactionLoader from '../components/ui/loaders/TransactionLoader';
import NeonText from '../components/ui/typography/NeonText';
import MixForm from '../components/forms/MixForm';
import QuickMixForm from '../components/forms/QuickMixForm';
import { useAuth } from '../context/AuthContext';
import { useMixerContext } from '../context/MixerContext';

const Home: React.FC = () => {
  const theme = useTheme();
  
  // Существующие состояния
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [transactionPending, setTransactionPending] = useState(false);
  const [amountError, setAmountError] = useState('');
  const [selectedPool, setSelectedPool] = useState<string>('');
  
  const { user, connectWallet, disconnectWallet } = useAuth();
  const { 
    mixTons, 
    availablePools 
  } = useMixerContext();
  
  const validateAmount = useCallback((value: string) => {
    if (!value) {
      setAmountError('Amount is required');
      return false;
    }
    
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) {
      setAmountError('Please enter a valid amount');
      return false;
    }
    
    setAmountError('');
    return true;
  }, []);
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    
    if (!value) {
      setAmountError('Amount is required');
    } else {
      setAmountError('');
    }
  };
  
  const handlePoolClick = (poolId: string) => {
    setSelectedPool(poolId);
    const pool = availablePools.find(p => p.id === poolId);
    if (pool) {
      setAmount(pool.minAmount.toString());
    }
    setShowForm(true);
  };
  
  // Обработчик для быстрого микширования
  const handleQuickMix = async () => {
    if (!validateAmount(amount)) return;
    
    setTransactionPending(true);
    try {
      await mixTons(parseFloat(amount), note);
      setAmount('');
      setNote('');
    } catch (error) {
      console.error('Mix transaction failed:', error);
    } finally {
      setTransactionPending(false);
    }
  };
  
  // Обработчик для новой формы микшера
  const handleMix = async (data: {
    inputAddress: string;
    amount: number;
    mixingOption: string;
    fee: number;
    outputAddresses: string[];
    note?: string;
  }) => {
    setTransactionPending(true);
    try {
      // Используем только amount и note для существующей функции mixTons
      await mixTons(data.amount, data.note);
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
               
                {/* Quick Mix Form */}
                <QuickMixForm
                  amount={amount}
                  amountError={amountError}
                  transactionPending={transactionPending}
                  onAmountChange={handleAmountChange}
                  onSubmit={handleQuickMix}
                  onConnect={connectWallet}
                  onDisconnect={disconnectWallet}
                  userConnected={user.connected}
                  userBalance={user.balance}
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
            <NeonText text="Current Mix Pools" />
          </Typography>
          
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
                  <MixPoolCard 
                    pool={pool}
                    onClick={() => {
                      if (user.connected) {
                        handlePoolClick(pool.id);
                      }
                    }}
                    disabled={!user.connected}
                  />
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
      
      {/* Floating Action Button для быстрого доступа */}
      {user.connected && (
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
        initialData={{
          inputAddress: '',
          amount: selectedPool ? availablePools.find(p => p.id === selectedPool)?.minAmount : undefined,
          mixingOption: 'standard',
          outputAddresses: [''],
          note: note,
        }}
        transactionPending={transactionPending}
        userConnected={user.connected}
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