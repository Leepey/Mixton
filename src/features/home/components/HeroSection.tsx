// src/features/home/components/HeroSection.tsx
import React from 'react';
import {
  Grid,
  Box,
  Alert,
  Chip,
  Typography,
  Button,
  useTheme,
  alpha,
  Container
} from '@mui/material';
import { motion } from 'framer-motion';
import { Info, Security, Speed, VerifiedUser } from '@mui/icons-material';
import QuickMixForm from '../../mixer/components/QuickMixForm';
import { useAuth } from '../../../app/AuthContext';
import { useMixerContext } from '../../../context/MixerContext';
import type { MixPool } from '../../mixer/types/mixer';

interface HeroSectionProps {
  amount: string;
  amountError: string;
  transactionPending: boolean;
  selectedPool: string;
  availablePools: MixPool[];
  onAmountChange: (value: string) => void;
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
  const theme = useTheme();

  // Рассчитываем статистику для неавторизованных пользователей
  const totalParticipants = stats?.totalDeposits || 0;
  const totalVolume = stats?.totalWithdrawn || 0;
  const totalPools = availablePools.length;

  // Фичи для отображения
  const features = [
    {
      icon: <Security />,
      title: "Secure",
      description: "Military-grade encryption"
    },
    {
      icon: <Speed />,
      title: "Fast",
      description: "Instant transactions"
    },
    {
      icon: <VerifiedUser />,
      title: "Anonymous",
      description: "Zero-knowledge proofs"
    }
  ];

  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238BC34A' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          opacity: 0.3
        }
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={6} alignItems="center">
          {/* Левая колонка - Форма микшера */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Информационное сообщение о балансе контракта */}
              {contractBalance && (
                <Alert
                  severity="info"
                  sx={{
                    mb: 3,
                    borderRadius: 2,
                    background: alpha(theme.palette.info.main, 0.1),
                    border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`
                  }}
                  action={
                    <Chip
                      label={`${contractBalance} TON`}
                      color="info"
                      size="small"
                      sx={{ fontWeight: 'bold' }}
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
              />

              {/* Статистика */}
              <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip
                  icon={<Info />}
                  label={`${totalParticipants} Participants`}
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  icon={<Info />}
                  label={`${totalVolume.toFixed(2)} TON Volume`}
                  color="secondary"
                  variant="outlined"
                />
                <Chip
                  icon={<Info />}
                  label={`${totalPools} Active Pools`}
                  color="success"
                  variant="outlined"
                />
              </Box>
            </motion.div>
          </Grid>

          {/* Правая колонка - Изображение и описание */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Box
                sx={{
                  position: 'relative',
                  p: 4,
                  borderRadius: 4,
                  background: alpha(theme.palette.background.paper, 0.05),
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                }}
              >
                {/* Заголовок */}
                <Typography
                  variant="h2"
                  component={motion.h1}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  gutterBottom
                  sx={{
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #8BC34A, #2196F3)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 3
                  }}
                >
                  Secure & Anonymous TON Mixing
                </Typography>

                {/* Описание */}
                <Typography
                  variant="h6"
                  component={motion.p}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  color="text.secondary"
                  sx={{ mb: 4, lineHeight: 1.6 }}
                >
                  Our advanced mixing technology ensures your financial activity remains completely confidential with zero-knowledge proofs and multi-hop transactions.
                </Typography>

                {/* Фичи */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  {features.map((feature, index) => (
                    <Grid size={{ xs: 12, sm: 4 }} key={index}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <Box
                          sx={{
                            textAlign: 'center',
                            p: 2,
                            borderRadius: 2,
                            background: alpha(theme.palette.primary.main, 0.05),
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              background: alpha(theme.palette.primary.main, 0.1),
                              transform: 'translateY(-5px)'
                            }
                          }}
                        >
                          <Box
                            sx={{
                              fontSize: '2rem',
                              color: theme.palette.primary.main,
                              mb: 1
                            }}
                          >
                            {feature.icon}
                          </Box>
                          <Typography variant="h6" fontWeight="bold" gutterBottom>
                            {feature.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {feature.description}
                          </Typography>
                        </Box>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>

                {/* CTA кнопка */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => {
                      document.getElementById('features-section')?.scrollIntoView({ 
                        behavior: 'smooth' 
                      });
                    }}
                    sx={{
                      borderRadius: 2,
                      px: 4,
                      py: 1.5,
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main,
                      '&:hover': {
                        borderColor: theme.palette.primary.light,
                        background: alpha(theme.palette.primary.main, 0.1)
                      }
                    }}
                  >
                    Learn More
                  </Button>
                </motion.div>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};