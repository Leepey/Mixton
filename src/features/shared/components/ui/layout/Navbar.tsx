// src/components/layout/Navbar.tsx
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
  alpha
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import RefreshIcon from '@mui/icons-material/Refresh';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTonConnect } from '../../../hooks/useTonConnect';
import { useAuthContext } from '../../../features/auth/components/AuthProvider';
import { formatAddress, normalizeAddress } from '../../features/shared/utils/formatUtils';
import { MixButton } from '../../features/shared/components/ui/buttons/MixButton';
import { NeonText } from '../../features/shared/components/ui/typography/NeonText';

const Navbar: React.FC = () => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();
  const { connected, address, balance, isLoading, connectWallet, disconnectWallet, refreshBalance } = useTonConnect();
  const { user } = useAuthContext();
  
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
  
  return (
    <AppBar 
      position="static" 
      sx={{ 
        background: 'linear-gradient(90deg, #0a192f 0%, #172a45 100%)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
      }}
    >
      <Toolbar>
        {/* Мобильное меню */}
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ 
            mr: 2,
            display: { md: 'none' }
          }}
          onClick={handleMenu}
        >
          <MenuIcon />
        </IconButton>
        
        {/* Логотип с названием */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <Box
            component="img"
            src="/logo.png"
            alt="TON Mixer Logo"
            sx={{
              height: { xs: '32px', md: '40px' },
              mr: { xs: 1, md: 1.5 },
            }}
          />
          <NeonText 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 800,
              letterSpacing: '.1rem',
              fontSize: { xs: '1.2rem', md: '1.4rem' }
            }}
          >
            MixTon
          </NeonText>
        </motion.div>
        
        {/* Навигационные ссылки для десктопа */}
        <Box sx={{ 
          display: { xs: 'none', md: 'flex' }, 
          alignItems: 'center',
          gap: 3,
          mr: 'auto',
          ml: 4
        }}>
          {['/', '/dashboard', '/about'].map((path) => {
            const label = path === '/' ? 'Home' : path.substring(1).charAt(0).toUpperCase() + path.substring(2);
            return (
              <motion.div
                key={path}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  color="inherit" 
                  onClick={() => navigateTo(path)}
                  sx={{
                    position: 'relative',
                    fontWeight: 500,
                    fontSize: '0.95rem',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      height: '2px',
                      background: 'transparent',
                      transition: 'background 0.3s ease',
                    },
                    '&:hover::after': {
                      background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    }
                  }}
                >
                  {label}
                </Button>
              </motion.div>
            );
          })}
          
          {/* Ссылка на админ-панель (только для администраторов) */}
          {user?.isAdmin && (
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                color="inherit" 
                onClick={() => navigateTo('/admin')}
                sx={{
                  position: 'relative',
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  color: '#FF5722',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '2px',
                    background: 'transparent',
                    transition: 'background 0.3s ease',
                  },
                  '&:hover::after': {
                    background: `linear-gradient(90deg, #FF5722, #FFC107)`,
                  }
                }}
                startIcon={<AdminPanelSettingsIcon />}
              >
                Admin
              </Button>
            </motion.div>
          )}
        </Box>
        
        {/* Информация о кошельке */}
        {connected && address && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Box sx={{ 
              display: { xs: 'none', md: 'flex' }, 
              alignItems: 'center',
              gap: 2,
              mr: 2,
              px: 2,
              py: 1,
              borderRadius: 2,
              background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.1)}, ${alpha(theme.palette.grey[900}, 0.2)})`,
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
            }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontFamily: 'monospace',
                  color: theme.palette.text.secondary,
                  fontSize: '0.85rem'
                }}
              >
                {formatAddress(address)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <NeonText 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 'bold',
                    fontSize: '0.95rem',
                    color: theme.palette.primary.main
                  }}
                >
                  {balance} TON
                </NeonText>
                <IconButton 
                  size="small" 
                  onClick={handleRefreshBalance}
                  disabled={isRefreshing || isLoading}
                  color="primary"
                  sx={{
                    p: 0.5,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    }
                  }}
                >
                  {isRefreshing ? 
                    <CircularProgress size={16} color="inherit" /> : 
                    <RefreshIcon fontSize="small" />
                  }
                </IconButton>
              </Box>
            </Box>
          </motion.div>
        )}
        
        {/* Кнопка подключения/отключения кошелька */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {connected ? (
            <MixButton
              variant="outlined"
              color="error"
              onClick={disconnectWallet}
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={16} /> : undefined}
            >
              {isLoading ? 'Disconnecting...' : 'Disconnect'}
            </MixButton>
          ) : (
            <MixButton
              onClick={connectWallet}
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={16} /> : undefined}
            >
              {isLoading ? 'Connecting...' : 'Connect Wallet'}
            </MixButton>
          )}
        </motion.div>
        
        {/* Мобильное меню */}
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          sx={{
            '& .MuiPaper-root': {
              background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.grey[900], 0.8)})`,
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              borderRadius: 2,
              boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.2)}`
            },
            '& .MuiMenuItem-root': {
              py: 1.5,
              px: 2,
              borderRadius: 1,
              '&:hover': {
                background: alpha(theme.palette.primary.main, 0.1),
              }
            }
          }}
        >
          {['/', '/dashboard', '/about'].map((path) => {
            const label = path === '/' ? 'Home' : path.substring(1).charAt(0).toUpperCase() + path.substring(2);
            return (
              <MenuItem 
                key={path} 
                onClick={() => navigateTo(path)}
                sx={{
                  fontWeight: 500,
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '1px',
                    background: 'transparent',
                    transition: 'background 0.3s ease',
                  },
                  '&:hover::after': {
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  }
                }}
              >
                {label}
              </MenuItem>
            );
          })}
          
          {/* Ссылка на админ-панель в мобильном меню (только для администраторов) */}
          {user?.isAdmin && (
            <MenuItem 
              onClick={() => navigateTo('/admin')}
              sx={{
                fontWeight: 500,
                color: '#FF5722',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: '1px',
                  background: 'transparent',
                  transition: 'background 0.3s ease',
                },
                '&:hover::after': {
                  background: `linear-gradient(90deg, #FF5722, #FFC107)`,
                }
              }}
            >
              <AdminPanelSettingsIcon fontSize="small" sx={{ mr: 1 }} />
              Admin Panel
            </MenuItem>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;