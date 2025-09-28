// src/features/shared/components/ui/ErrorPage.tsx
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
    <Box
      component="section"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        position: 'relative',
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
      <Container maxWidth="md">
        <Paper
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          sx={{
            p: 6,
            borderRadius: 4,
            textAlign: 'center',
            background: alpha(theme.palette.background.paper, 0.05),
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}
        >
          {/* Код ошибки */}
          <Typography
            component={motion.div}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
            variant="h1"
            sx={{
              fontSize: '8rem',
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #f44336, #e91e63)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
              lineHeight: 1
            }}
          >
            {code}
          </Typography>

          {/* Заголовок */}
          <Typography
            component={motion.h2}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            variant="h3"
            gutterBottom
            fontWeight="bold"
            sx={{ mb: 2 }}
          >
            {title}
          </Typography>

          {/* Сообщение */}
          <Typography
            component={motion.p}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            variant="h6"
            color="text.secondary"
            sx={{ mb: 4, lineHeight: 1.6 }}
          >
            {message}
          </Typography>

          {/* Кнопки действий */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            sx={{ 
              display: 'flex', 
              gap: 2, 
              justifyContent: 'center', 
              flexWrap: 'wrap',
              mb: 4 
            }}
          >
            {/* Кнопка "Назад" */}
            <IconButton
              onClick={handleGoBack}
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
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  '&:hover': {
                    borderColor: theme.palette.primary.light,
                    background: alpha(theme.palette.primary.main, 0.1),
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                {customAction.label}
              </Button>
            )}
          </Box>

          {/* Дополнительная информация */}
          <Typography
            component={motion.p}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            variant="body2"
            color="text.secondary"
          >
            If you believe this is an error, please contact our support team or try again later.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};