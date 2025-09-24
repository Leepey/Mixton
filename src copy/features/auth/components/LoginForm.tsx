import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Alert,
  CircularProgress,
  Link,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import { AccountBalanceWallet, Login } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { useWalletAuth } from '../hooks/useWalletAuth';
import { validateTonAddress } from '../utils/authUtils';

interface LoginFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onError }) => {
  const { login, loading, error, clearError } = useAuth();
  const { connect, connecting } = useWalletAuth();
  const [address, setAddress] = useState('');
  const [addressError, setAddressError] = useState('');

  const handleAddressChange = (value: string) => {
    setAddress(value);
    setAddressError('');
    
    if (value && !validateTonAddress(value)) {
      setAddressError('Invalid TON address format');
    }
  };

  const handleLogin = async () => {
    if (!address) {
      setAddressError('Address is required');
      return;
    }

    if (!validateTonAddress(address)) {
      setAddressError('Invalid TON address format');
      return;
    }

    try {
      await login({ address });
      onSuccess?.();
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Login failed');
    }
  };

  const handleWalletConnect = async () => {
    try {
      await connect();
      onSuccess?.();
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Failed to connect wallet');
    }
  };

  React.useEffect(() => {
    if (error) {
      onError?.(error);
    }
  }, [error, onError]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper 
        elevation={0}
        sx={{
          p: 4,
          borderRadius: '16px',
          background: `linear-gradient(145deg, rgba(255, 255, 255, 0.05), rgba(0, 0, 0, 0.2))`,
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          maxWidth: 400,
          width: '100%',
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <AccountBalanceWallet sx={{ fontSize: 48, color: '#00BCD4', mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
            Welcome to Mixton
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Connect your wallet to start mixing
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="TON Address"
            placeholder="EQD..."
            value={address}
            onChange={(e) => handleAddressChange(e.target.value)}
            error={!!addressError}
            helperText={addressError}
            disabled={loading || connecting}
            sx={{ mb: 2 }}
          />
          
          <Button
            fullWidth
            variant="contained"
            onClick={handleLogin}
            disabled={loading || connecting || !address || !!addressError}
            startIcon={loading ? <CircularProgress size={20} /> : <Login />}
            sx={{ mb: 2 }}
          >
            {loading ? 'Logging in...' : 'Login with Address'}
          </Button>
        </Box>

        <Divider sx={{ my: 2 }}>
          <Typography variant="body2" color="text.secondary">
            OR
          </Typography>
        </Divider>

        <Button
          fullWidth
          variant="outlined"
          onClick={handleWalletConnect}
          disabled={loading || connecting}
          startIcon={connecting ? <CircularProgress size={20} /> : <AccountBalanceWallet />}
          sx={{ mb: 2 }}
        >
          {connecting ? 'Connecting...' : 'Connect Wallet'}
        </Button>

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            By connecting, you agree to our{' '}
            <Link href="#" sx={{ color: '#00BCD4' }}>
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="#" sx={{ color: '#00BCD4' }}>
              Privacy Policy
            </Link>
          </Typography>
        </Box>
      </Paper>
    </motion.div>
  );
};