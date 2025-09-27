// src/components/ui/buttons/TonConnectButton.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { Button, CircularProgress, Alert, Snackbar, type ButtonProps } from '@mui/material';
import { motion } from 'framer-motion';

interface TonConnectButtonProps extends Omit<ButtonProps, 'onClick' | 'children'> {
  children?: React.ReactNode;
  onClick?: () => void;
  connected?: boolean;
}

export const TonConnectButton: React.FC<TonConnectButtonProps> = ({ 
  children, 
  onClick, 
  connected: propConnected,
  ...buttonProps 
}) => {
  const [tonConnectUI] = useTonConnectUI();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const connected = propConnected !== undefined ? propConnected : tonConnectUI.connected;

  useEffect(() => {
    console.log('TonConnect state:', {
      connected: tonConnectUI.connected,
      wallet: tonConnectUI.wallet,
      account: tonConnectUI.account,
    });
  }, [tonConnectUI.connected, tonConnectUI.wallet, tonConnectUI.account]);

  const handleConnect = async () => {
    if (onClick) {
      onClick();
      return;
    }

    if (tonConnectUI.connected) {
      await tonConnectUI.disconnect();
      return;
    }

    setIsConnecting(true);
    setError(null);

    // Очищаем предыдущий таймаут
    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
    }

    try {
      console.log('Attempting to connect wallet...');
      
      // Увеличиваем таймаут для локальной разработки
      const timeoutPromise = new Promise((_, reject) => {
        connectionTimeoutRef.current = setTimeout(() => {
          reject(new Error('Connection timeout. Please try again.'));
        }, 60000); // 60 секунд
      });

      await Promise.race([
        tonConnectUI.connectWallet(),
        timeoutPromise
      ]);
      
      console.log('Wallet connected successfully');
    } catch (err) {
      console.error('Connection error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(errorMessage);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleCloseError = () => {
    setError(null);
  };

  // Очищаем таймаут при размонтировании компонента
  useEffect(() => {
    return () => {
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant={connected ? "outlined" : "contained"}
          color={connected ? "error" : "primary"}
          onClick={handleConnect}
          disabled={isConnecting}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1,
            fontWeight: 600,
            fontSize: '0.9rem',
            boxShadow: connected
              ? '0 0 10px rgba(244, 67, 54, 0.3)'
              : '0 0 10px rgba(33, 150, 243, 0.3)',
            ...(connected && {
              borderColor: 'error.main',
              color: 'error.main',
              '&:hover': {
                borderColor: 'error.dark',
                backgroundColor: 'rgba(244, 67, 54, 0.1)',
                color: 'error.dark'
              }
            }),
            ...(!connected && {
              background: 'linear-gradient(45deg, #2196F3, #00BCD4)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976D2, #00ACC1)',
              }
            })
          }}
          {...buttonProps}
        >
          {isConnecting ? (
            <CircularProgress size={16} color="inherit" sx={{ mr: 1 }} />
          ) : null}
          {children || (connected ? 'Disconnect' : 'Connect Wallet')}
        </Button>
      </motion.div>

      <Snackbar
        open={!!error}
        autoHideDuration={8000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default TonConnectButton;