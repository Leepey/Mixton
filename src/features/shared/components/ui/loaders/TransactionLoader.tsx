// features/shared/components/ui/loaders/TransactionLoader.tsx
import React from 'react';
import { 
  Backdrop, 
  CircularProgress, 
  Typography, 
  Box, 
  Paper,
  alpha,
  useTheme
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

interface TransactionLoaderProps {
  open: boolean;
  message?: string;
  submessage?: string;
  progress?: number;
  showProgress?: boolean;
  duration?: number;
}

export const TransactionLoader: React.FC<TransactionLoaderProps> = ({
  open,
  message = 'Processing transaction...',
  submessage,
  progress,
  showProgress = false,
  duration = 30000
}) => {
  const theme = useTheme();

  return (
    <AnimatePresence>
      {open && (
        <Backdrop
          sx={{ 
            color: '#fff', 
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backdropFilter: 'blur(8px)',
            backgroundColor: alpha(theme.palette.background.default, 0.8)
          }}
          open={open}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: '20px',
                background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.grey[900], 0.8)})`,
                backdropFilter: 'blur(20px)',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                minWidth: 320,
                maxWidth: 400,
                textAlign: 'center'
              }}
            >
              {/* Основной индикатор загрузки */}
              <Box sx={{ mb: 3, position: 'relative' }}>
                <CircularProgress
                  size={64}
                  thickness={4}
                  sx={{
                    color: theme.palette.primary.main,
                    '& .MuiCircularProgress-circle': {
                      strokeLinecap: 'round',
                    },
                  }}
                />
                
                {/* Пульсирующий эффект */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.2)} 0%, transparent 70%)`,
                    animation: 'pulse 2s ease-in-out infinite',
                    '@keyframes pulse': {
                      '0%, 100%': { transform: 'translate(-50%, -50%) scale(1)', opacity: 0.5 },
                      '50%': { transform: 'translate(-50%, -50%) scale(1.2)', opacity: 0.8 }
                    }
                  }}
                />
              </Box>

              {/* Основное сообщение */}
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600, 
                  mb: 1,
                  color: theme.palette.text.primary
                }}
              >
                {message}
              </Typography>

              {/* Дополнительное сообщение */}
              {submessage && (
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  {submessage}
                </Typography>
              )}

              {/* Прогресс-бар (если нужен) */}
              {showProgress && progress !== undefined && (
                <Box sx={{ mt: 3 }}>
                  <Box
                    sx={{
                      width: '100%',
                      height: 6,
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      borderRadius: 3,
                      overflow: 'hidden',
                      mb: 1
                    }}
                  >
                    <Box
                      sx={{
                        width: `${progress}%`,
                        height: '100%',
                        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                        borderRadius: 3,
                        transition: 'width 0.3s ease'
                      }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {progress}% complete
                  </Typography>
                </Box>
              )}

              {/* Анимированные точки для индикации процесса */}
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 3 }}>
                {[0, 1, 2].map((index) => (
                  <motion.div
                    key={index}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: theme.palette.primary.main,
                    }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.4, 1, 0.4],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: index * 0.2,
                    }}
                  />
                ))}
              </Box>

              {/* Информация о времени */}
              {duration && (
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ mt: 2, display: 'block' }}
                >
                  Estimated time: {Math.ceil(duration / 1000)} seconds
                </Typography>
              )}
            </Paper>
          </motion.div>
        </Backdrop>
      )}
    </AnimatePresence>
  );
};

// Экспорт по умолчанию для совместимости
export default TransactionLoader;