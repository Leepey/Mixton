// src/features/shared/components/ui/layout/Navbar.tsx
import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  CircularProgress,
  useTheme,
  alpha,
  Badge,
  Tooltip
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import RefreshIcon from '@mui/icons-material/Refresh';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTonConnect } from '../../../hooks/useTonConnect';
import { useAuth } from '../../../../auth/context/AuthContext';
import { formatAddress, normalizeAddress } from '../../../utils/formatUtils';
import { MixButton } from '../buttons/MixButton';
import { NeonText } from '../typography/NeonText';

const Navbar: React.FC = () => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();
  
  const { connected, wallet, address, connectWallet, disconnectWallet } = useTonConnect();
  const { user, logout } = useAuth();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Add any refresh logic here
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectWallet();
      logout();
      handleClose();
    } catch (error) {
      console.error('Disconnect failed:', error);
    }
  };

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error('Connect failed:', error);
    }
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    handleClose();
  };

  // Check if user is authenticated based on user object
  const isAuthenticated = !!user;

  const formattedAddress = address ? formatAddress(normalizeAddress(address)) : '';

  return (
    <AppBar 
      position="static" 
      sx={{ 
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <Toolbar>
        {/* Logo and Title */}
        <Box 
          component={motion.div}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #00ffff, #ff00ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/')}
          >
            Mixton
          </Typography>
        </Box>

        {/* Navigation Items */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Refresh Button */}
          <Tooltip title="Refresh Data">
            <IconButton
              onClick={handleRefresh}
              disabled={isRefreshing}
              sx={{
                color: 'white',
                '&:hover': {
                  backgroundColor: alpha('#ffffff', 0.1)
                }
              }}
            >
              {isRefreshing ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <RefreshIcon />
              )}
            </IconButton>
          </Tooltip>

          {/* Admin Panel (if authenticated) */}
          {isAuthenticated && user?.role === 'admin' && (
            <Tooltip title="Admin Panel">
              <IconButton
                onClick={() => navigate('/admin')}
                sx={{
                  color: 'white',
                  '&:hover': {
                    backgroundColor: alpha('#ffffff', 0.1)
                  }
                }}
              >
                <AdminPanelSettingsIcon />
              </IconButton>
            </Tooltip>
          )}

          {/* Wallet Connection */}
          {connected && address ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Tooltip title={address}>
                <MixButton
                  variant="outlined"
                  onClick={handleMenu}
                  sx={{
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                      backgroundColor: alpha('#ffffff', 0.1)
                    }
                  }}
                >
                  <AccountBalanceWalletIcon sx={{ mr: 1 }} />
                  {formattedAddress}
                </MixButton>
              </Tooltip>

              {/* User Menu */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                sx={{
                  mt: '45px',
                  '& .MuiPaper': {
                    backgroundColor: '#1a1a2e',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px'
                  }
                }}
              >
                <MenuItem onClick={() => handleNavigate('/dashboard')}>
                  <Typography>Dashboard</Typography>
                </MenuItem>
                {isAuthenticated && (
                  <MenuItem onClick={() => handleNavigate('/profile')}>
                    <Typography>Profile</Typography>
                  </MenuItem>
                )}
                <MenuItem onClick={handleDisconnect}>
                  <Typography color="error">Disconnect</Typography>
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <MixButton
              variant="contained"
              onClick={handleConnect}
              sx={{
                background: 'linear-gradient(45deg, #00ffff, #ff00ff)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #00cccc, #ff00ff)'
                }
              }}
            >
              <AccountBalanceWalletIcon sx={{ mr: 1 }} />
              Connect Wallet
            </MixButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;