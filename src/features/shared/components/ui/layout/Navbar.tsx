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
import { useAuth } from '../../../../../App/AuthContext';
import { formatAddress, normalizeAddress } from '../../../utils/formatUtils';
import { MixButton } from '../buttons/MixButton';
import { NeonText } from '../typography/NeonText';

const Navbar: React.FC = () => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();
  const { connected, address, balance, isLoading, connectWallet, disconnectWallet, refreshBalance } = useTonConnect();
  const { user } = useAuth();

  // Отладочная информация
  useEffect(() => {
    console.log('Navbar Debug:');
    console.log('- Raw address:', address);
    console.log('- Normalized address:', normalizeAddress(address));
    console.log('- User:', user);
    console.log('- User is admin:', user?.isAdmin);
    console.log('- Address:', address);
  }, [user, address]);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigateTo = (path: string) => {
    navigate(path);
    handleClose();
  };

  const handleRefreshBalance = async () => {
    setIsRefreshing(true);
    try {
      await refreshBalance();
    } finally {
      setIsRefreshing(false);
    }
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/about', label: 'About' },
  ];

  return (
    <AppBar
      position="fixed"
      sx={{
        background: `linear-gradient(to right, ${alpha(theme.palette.background.paper, 0.1)}, ${alpha(theme.palette.grey[900], 0.2)})`,
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
      }}
    >
      <Toolbar>
        {/* Мобильное меню */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2, display: { sm: 'none' } }}
          onClick={handleMenu}
        >
          <MenuIcon />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          sx={{ display: { sm: 'none' } }}
        >
          {navLinks.map((link) => (
            <MenuItem key={link.path} onClick={() => navigateTo(link.path)}>
              {link.label}
            </MenuItem>
          ))}
          {user?.isAdmin && (
            <MenuItem onClick={() => navigateTo('/admin')}>
              <AdminPanelSettingsIcon sx={{ mr: 1 }} />
              Admin Panel
            </MenuItem>
          )}
        </Menu>

        {/* Логотип с названием */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.5, type: 'spring' }}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{ 
                fontWeight: 'bold',
                cursor: 'pointer',
                mr: 3
              }}
              onClick={() => navigate('/')}
            >
              <NeonText text="MixTon" color="primary" />
            </Typography>
          </motion.div>
        </Box>

        {/* Навигационные ссылки для десктопа */}
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 2 }}>
          {navLinks.map((link) => (
            <Button
              key={link.path}
              color="inherit"
              onClick={() => navigateTo(link.path)}
              sx={{
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: theme.palette.primary.main,
                  transform: 'scaleX(0)',
                  transition: 'transform 0.3s ease'
                },
                '&:hover::after': {
                  transform: 'scaleX(1)'
                }
              }}
            >
              {link.label}
            </Button>
          ))}
          
          {user?.isAdmin && (
            <Tooltip title="Admin Panel">
              <IconButton
                color="inherit"
                onClick={() => navigateTo('/admin')}
                sx={{
                  '&:hover': {
                    background: alpha(theme.palette.primary.main, 0.1)
                  }
                }}
              >
                <AdminPanelSettingsIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* Кнопки подключения кошелька и баланса */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : connected && address ? (
            <>
              <Tooltip title="Refresh Balance">
                <IconButton
                  color="inherit"
                  onClick={handleRefreshBalance}
                  disabled={isRefreshing}
                  sx={{
                    '&:hover': {
                      background: alpha(theme.palette.primary.main, 0.1)
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
              
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  background: alpha(theme.palette.background.paper, 0.1),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
                }}
              >
                <AccountBalanceWalletIcon fontSize="small" />
                <Typography variant="body2">
                  {balance ? `${parseFloat(balance).toFixed(2)} TON` : '0 TON'}
                </Typography>
              </Box>

              <Badge
                variant="dot"
                color="success"
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              >
                <MixButton
                  onClick={disconnectWallet}
                  variant="outlined"
                  size="small"
                >
                  {formatAddress(address)}
                </MixButton>
              </Badge>
            </>
          ) : (
            <MixButton
              onClick={connectWallet}
              variant="contained"
              startIcon={<AccountBalanceWalletIcon />}
            >
              Connect Wallet
            </MixButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;