// features/home/components/HeroSection.tsx
import React from 'react';
import { Grid, Box, Alert, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { Info } from '@mui/icons-material';
import { QuickMixForm } from '../../mixer/components/QuickMixForm';
import { useAuth } from '../../../App/AuthContext';
import { useMixerContext } from '../../../context/MixerContext';

interface HeroSectionProps {
  amount: string;
  amountError: string;
  transactionPending: boolean;
  selectedPool: string;
  availablePools: any[];
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPoolChange: (poolId: string) => void;
  onSubmit: () => Promise<void>;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  amount,
  amountError,
  transactionPending,
  selectedPool,
  availablePools,
  onAmountChange,
  onPoolChange,
  onSubmit
}) => {
  const { user, tonConnect } = useAuth();
  const { contractBalance, stats } = useMixerContext();
  
  // Рассчитываем статистику для неавторизованных пользователей
  const totalParticipants = stats?.totalDeposits || 0;
  const totalVolume = stats?.totalWithdrawn || 0;
  const totalPools = availablePools.length;

  return (
    <Box sx={{ pt: { xs: 6, md: 5 }, pb: { xs: 4, md: 8 } }}>
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
              onAmountChange={onAmountChange}
              onPoolChange={onPoolChange}
              onSubmit={onSubmit}
              onConnect={() => tonConnect?.connectWallet()}
              onDisconnect={() => tonConnect?.disconnectWallet()}
              userConnected={user?.connected || false}
              userBalance={user?.balance}
              totalParticipants={totalParticipants}
              totalVolume={totalVolume}
              totalPools={totalPools}
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
  );
};