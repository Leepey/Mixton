// features/shared/components/ui/ErrorPage.tsx
import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Paper, 
  useTheme,
  alpha,
  IconButton
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Home as HomeIcon, 
  Refresh as RefreshIcon, 
  ArrowBack as ArrowBackIcon 
} from '@mui/icons-material';
import type { ErrorPageProps } from '../../types/common.types';

export const ErrorPage: React.FC<ErrorPageProps> = ({
  code = 404,
  title = 'Page Not Found',
  message = 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.',
  showHomeButton = true,
  customAction
}) => {
  const theme = useTheme();

  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: `linear-gradient(135deg, #0a192f 0%, #000000 100%)`,
      color: theme.palette.text.primary,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Paper 
            elevation={0}
            sx={{
              p: { xs: 4, md: 6 },
              borderRadius: '24px',
              background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.grey[900], 0.6)})`,
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Декоративный фон */}
            <Box sx={{
              position: 'absolute',
              top: '-50%',
              right: '-50%',
              width: '200%',
              height: '200%',
              background: `radial-gradient(circle, ${alpha(theme.palette.error.main, 0.05)} 0%, transparent 70%)`,
              animation: 'pulse 4s ease-in-out infinite',
              '@keyframes pulse': {
                '0%, 100%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.1)' }
              }
            }} />

            {/* Код ошибки */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Typography 
                variant="h1" 
                component="div" 
                sx={{ 
                  fontSize: { xs: '4rem', md: '8rem' },
                  fontWeight: 900,
                  background: `linear-gradient(45deg, #FF5722, #FFC107)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1,
                  mb: 2,
                  opacity: 0.8
                }}
              >
                {code}
              </Typography>
            </motion.div>

            {/* Заголовок */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Typography 
                variant="h3" 
                component="h1" 
                sx={{ 
                  fontWeight: 700,
                  mb: 2,
                  fontSize: { xs: '1.5rem', md: '2rem' }
                }}
              >
                {title}
              </Typography>
            </motion.div>

            {/* Сообщение */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{ 
                  mb: 4,
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  lineHeight: 1.6,
                  maxWidth: '500px',
                  mx: 'auto'
                }}
              >
                {message}
              </Typography>
            </motion.div>

            {/* Кнопки действий */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                {/* Кнопка "Назад" */}
                <IconButton
                  onClick={handleGoBack}
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '12px',
                    background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.grey[900], 0.6)})`,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    color: theme.palette.primary.main,
                    '&:hover': {
                      background: alpha(theme.palette.primary.main, 0.1),
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <ArrowBackIcon />
                </IconButton>

                {/* Кнопка "Обновить" */}
                <IconButton
                  onClick={() => window.location.reload()}
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '12px',
                    background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.grey[900], 0.6)})`,
                    border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                    color: theme.palette.info.main,
                    '&:hover': {
                      background: alpha(theme.palette.info.main, 0.1),
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <RefreshIcon />
                </IconButton>

                {/* Кнопка "Домой" */}
                {showHomeButton && (
                  <Button
                    variant="contained"
                    onClick={handleGoHome}
                    startIcon={<HomeIcon />}
                    sx={{
                      borderRadius: '12px',
                      px: 4,
                      py: 1.5,
                      background: `linear-gradient(45deg, #00BCD4, #2196F3)`,
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(0, 188, 212, 0.3)'
                      }
                    }}
                  >
                    Go Home
                  </Button>
                )}

                {/* Кастомное действие */}
                {customAction && (
                  <Button
                    variant="outlined"
                    onClick={customAction.onClick}
                    sx={{
                      borderRadius: '12px',
                      px: 4,
                      py: 1.5,
                      borderColor: alpha(theme.palette.primary.main, 0.5),
                      color: theme.palette.primary.main,
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        backgroundColor: alpha(theme.palette.primary.main, 0.1)
                      }
                    }}
                  >
                    {customAction.label}
                  </Button>
                )}
              </Box>
            </motion.div>

            {/* Дополнительная информация */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Box sx={{ mt: 6, pt: 4, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)` }}>
                <Typography variant="body2" color="text.secondary">
                  If you believe this is an error, please contact our support team or try again later.
                </Typography>
              </Box>
            </motion.div>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};