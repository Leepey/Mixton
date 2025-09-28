import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  AccountBalanceWallet, 
  Close,
  CheckCircle,
} from '@mui/icons-material';
import { useWalletAuth } from '../hooks/useWalletAuth';

interface ConnectWalletModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const ConnectWalletModal: React.FC<ConnectWalletModalProps> = ({
  open,
  onClose,
  onSuccess,
  onError,
}) => {
  const { 
    connect, 
    connecting, 
    error, 
    clearError,
    walletAddress,
    connected 
  } = useWalletAuth();

  const handleConnect = async () => {
    try {
      await connect();
      onSuccess?.();
      onClose();
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Failed to connect wallet');
    }
  };

  const handleClose = () => {
    clearError();
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          background: `linear-gradient(145deg, rgba(255, 255, 255, 0.05), rgba(0, 0, 0, 0.2))`,
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <AccountBalanceWallet sx={{ fontSize: 32, color: '#00BCD4', mr: 1 }} />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Connect Wallet
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
            {error}
          </Alert>
        )}

        {connected && walletAddress && (
          <Box sx={{ 
            textAlign: 'center', 
            p: 2, 
            mb: 2,
            borderRadius: '8px',
            background: 'rgba(76, 175, 80, 0.1)',
            border: '1px solid rgba(76, 175, 80, 0.3)',
          }}>
            <CheckCircle sx={{ color: '#4CAF50', mb: 1 }} />
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              Wallet Connected
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </Typography>
          </Box>
        )}

        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Connect your TON wallet to use the mixer service
          </Typography>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Box
              sx={{
                p: 3,
                borderRadius: '12px',
                border: '2px dashed rgba(0, 188, 212, 0.3)',
                cursor: 'pointer',
                transition: 'all 0.3s',
                '&:hover': {
                  borderColor: 'rgba(0, 188, 212, 0.6)',
                  background: 'rgba(0, 188, 212, 0.05)',
                },
              }}
              onClick={handleConnect}
            >
              {connecting ? (
                <CircularProgress size={24} />
              ) : (
                <>
                  <AccountBalanceWallet sx={{ fontSize: 48, color: '#00BCD4', mb: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Click to Connect
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Supported: TonKeeper, TonHub, MyTonWallet
                  </Typography>
                </>
              )}
            </Box>
          </motion.div>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            By connecting your wallet, you agree to our Terms of Service and Privacy Policy.
            Your wallet will be used for signing transactions only.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button 
          onClick={handleClose}
          disabled={connecting}
          startIcon={<Close />}
        >
          {connected ? 'Close' : 'Cancel'}
        </Button>
        
        {!connected && (
          <Button
            variant="contained"
            onClick={handleConnect}
            disabled={connecting}
            startIcon={connecting ? <CircularProgress size={20} /> : <AccountBalanceWallet />}
          >
            {connecting ? 'Connecting...' : 'Connect Wallet'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};