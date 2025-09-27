// features/auth/components/PublicAuthPages.tsx
import React from 'react';
import { Box, Typography, Paper, Container } from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material';

/**
 * Компонент страницы входа
 */
export const LoginPage: React.FC = () => {
  const theme = useTheme();

  return (
    <Container maxWidth="sm">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Paper 
          elevation={0}
          sx={{
            p: 4,
            borderRadius: '16px',
            background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.grey[900], 0.6)})`,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            mt: 8
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, textAlign: 'center' }}>
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
            Sign in to your account to continue
          </Typography>
          
          {/* Здесь будет форма входа */}
          <Box sx={{ 
            p: 3, 
            borderRadius: '8px', 
            bgcolor: alpha(theme.palette.background.paper, 0.5),
            textAlign: 'center'
          }}>
            <Typography variant="body2">Login form will be here</Typography>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

/**
 * Компонент страницы регистрации
 */
export const RegisterPage: React.FC = () => {
  const theme = useTheme();

  return (
    <Container maxWidth="sm">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Paper 
          elevation={0}
          sx={{
            p: 4,
            borderRadius: '16px',
            background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.grey[900], 0.6)})`,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            mt: 8
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, textAlign: 'center' }}>
            Create Account
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
            Join Mixton to start mixing your TON with complete privacy
          </Typography>
          
          {/* Здесь будет форма регистрации */}
          <Box sx={{ 
            p: 3, 
            borderRadius: '8px', 
            bgcolor: alpha(theme.palette.background.paper, 0.5),
            textAlign: 'center'
          }}>
            <Typography variant="body2">Registration form will be here</Typography>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

/**
 * Компонент страницы восстановления пароля
 */
export const ForgotPasswordPage: React.FC = () => {
  const theme = useTheme();

  return (
    <Container maxWidth="sm">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Paper 
          elevation={0}
          sx={{
            p: 4,
            borderRadius: '16px',
            background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.grey[900], 0.6)})`,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            mt: 8
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, textAlign: 'center' }}>
            Reset Password
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
            Enter your email address and we'll send you instructions to reset your password
          </Typography>
          
          {/* Здесь будет форма восстановления пароля */}
          <Box sx={{ 
            p: 3, 
            borderRadius: '8px', 
            bgcolor: alpha(theme.palette.background.paper, 0.5),
            textAlign: 'center'
          }}>
            <Typography variant="body2">Password reset form will be here</Typography>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};