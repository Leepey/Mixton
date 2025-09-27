// src/features/home/components/PoolSelectionSection.tsx
import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Alert,
  Tooltip,
  Fab,
  useTheme,
  alpha,
  Container
} from '@mui/material';
import { motion } from 'framer-motion';
import { Info, CheckCircle, HelpOutline } from '@mui/icons-material';
import { NeonText } from '../../shared/components/ui/typography/NeonText';
import { MixPoolCard } from '../../shared/components/ui/cards/MixPoolCard';
import type { MixPool } from '../../mixer/types/mixer.type';

interface PoolSelectionSectionProps {
  availablePools: MixPool[];
  selectedPool: string;
  showInfo: boolean;
  onPoolClick: (poolId: string) => void;
  onToggleInfo: () => void;
  userConnected: boolean;
}

export const PoolSelectionSection: React.FC<PoolSelectionSectionProps> = ({
  availablePools,
  selectedPool,
  showInfo,
  onPoolClick,
  onToggleInfo,
  userConnected
}) => {
  const theme = useTheme();

  return (
    <Box
      component="section"
      id="pool-selection-section"
      sx={{
        py: 8,
        background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
        position: 'relative',
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
        {/* Заголовок секции */}
        <Box textAlign="center" mb={6}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <NeonText
              variant="h3"
              component="h2"
              color={theme.palette.primary.main}
              sx={{ mb: 2 }}
            >
              Choose Your Pool
            </NeonText>
            <Typography variant="h6" color="text.secondary" maxWidth={600} mx="auto">
              Select a mixing pool that best suits your needs. Each pool offers different levels of privacy, fees, and processing times.
            </Typography>
          </motion.div>
        </Box>

        {/* Информационное сообщение */}
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Alert
              severity="info"
              sx={{
                mb: 4,
                borderRadius: 2,
                background: alpha(theme.palette.info.main, 0.1),
                border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
              }}
            >
              <Typography variant="body2" gutterBottom>
                Each pool has different fee rates and delay times. Higher pools offer better privacy with lower fees but longer wait times.
              </Typography>
              <Typography variant="body2">
                Click on a pool to select it for mixing.
              </Typography>
            </Alert>
          </motion.div>
        )}

        {/* Сетка пулов */}
        <Grid container spacing={4}>
          {availablePools.map((pool, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={pool.id}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                style={{ height: '100%' }}
              >
                <Box sx={{ position: 'relative', height: '100%' }}>
                  {/* Индикатор выбранного пула */}
                  {selectedPool === pool.id && (
                    <Tooltip title="Selected Pool">
                      <Fab
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: -12,
                          right: -12,
                          zIndex: 2,
                          background: theme.palette.success.main,
                          '&:hover': {
                            background: theme.palette.success.dark,
                          },
                        }}
                      >
                        <CheckCircle />
                      </Fab>
                    </Tooltip>
                  )}

                  {/* Карточка пула */}
                  <MixPoolCard
                    pool={pool}
                    onClick={() => onPoolClick(pool.id)}
                    disabled={!userConnected || pool.status !== 'active'}
                    isSelected={selectedPool === pool.id}
                    sx={{
                      height: '100%',
                    }}
                  />
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Кнопка помощи */}
        <Box textAlign="center" mt={6}>
          <Tooltip title="Learn about pools">
            <Fab
              color="primary"
              onClick={onToggleInfo}
              sx={{
                background: alpha(theme.palette.primary.main, 0.1),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                color: theme.palette.primary.main,
                '&:hover': {
                  background: alpha(theme.palette.primary.main, 0.2),
                },
              }}
            >
              <HelpOutline />
            </Fab>
          </Tooltip>
        </Box>

        {/* Сообщение для неавторизованных пользователей */}
        {!userConnected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Alert
              severity="warning"
              sx={{
                mt: 4,
                borderRadius: 2,
                background: alpha(theme.palette.warning.main, 0.1),
                border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
              }}
            >
              <Typography variant="body2">
                Please connect your wallet to select a pool and start mixing.
              </Typography>
            </Alert>
          </motion.div>
        )}
      </Container>
    </Box>
  );
};