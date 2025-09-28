// src/pages/AdminPanel.tsx
import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  Button,
  useTheme,
  alpha,
  Tab,
  Tabs,
  IconButton,
  Tooltip,
  Alert,
  Snackbar
} from '@mui/material';
import { 
  Security,
  Refresh,
  ArrowBack,
  ArrowForward,
  Dashboard,
  Settings,
  Group,
  History,
  Warning,
  CheckCircle,
  Info
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  AdminPanelLayout,
  AnalyticsPanel,
  ContractSettings,
  ContractSettingsComponent,
  SecuritySettingsComponent,
  UserManagement,
  useAdminAuth,
  useContractManagement,
  useAdminTabs,
  getAdminTabs,
  AdminTabValue
} from '../features/admin';
import { useMixerContext } from '../features/shared/context/MixerContext';
import { TransactionLoader } from '../features/shared/components/ui/loaders/TransactionLoader';
import { TransactionTable } from '../features/admin/components/TransactionTable';
import { ErrorBoundary } from '../features/shared/components/ErrorBoundary';

const AdminPanel: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const { 
    activeTab, 
    activeTabId, 
    setActiveTab, 
    setActiveTabById,
    nextTab,
    previousTab,
    isValidTab
  } = useAdminTabs('overview');
  
  const { isAdmin, debugInfo } = useAdminAuth();
  const { loading, handleRefresh } = useContractManagement();
  const { mixHistory, contractBalance, stats } = useMixerContext();
  
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info' as 'success' | 'error' | 'info' | 'warning'
  });

  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const showNotification = (message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setNotification({ open: true, message, severity });
  };

  const handleRefreshData = async () => {
    try {
      await handleRefresh();
      setLastRefresh(new Date());
      showNotification('Data refreshed successfully', 'success');
    } catch (error) {
      showNotification('Failed to refresh data', 'error');
    }
  };

  React.useEffect(() => {
    if (!autoRefresh || !isAdmin) return;
    const interval = setInterval(handleRefreshData, 30000);
    return () => clearInterval(interval);
  }, [autoRefresh, isAdmin]);

  if (!isAdmin) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        background: `linear-gradient(135deg, #0a192f 0%, #000000 100%)`,
        color: theme.palette.text.primary,
        pt: 8,
        pb: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Container maxWidth="md">
          <Paper 
            elevation={0}
            sx={{
              p: 4,
              borderRadius: '16px',
              background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.grey[900], 0.6)})`,
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
              textAlign: 'center'
            }}
          >
            <Security sx={{ fontSize: 64, color: theme.palette.error.main, mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
              Access Denied
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              You don't have permission to access the admin panel.
            </Typography>
            
            <Box sx={{ 
              p: 2, 
              borderRadius: '8px',
              bgcolor: alpha(theme.palette.background.paper, 0.5),
              mt: 2,
              textAlign: 'left'
            }}>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', mb: 1 }}>
                <strong>Debug Information:</strong>
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', mb: 1 }}>
                Current Address: {debugInfo?.currentAddress || 'Not connected'}
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', mb: 1 }}>
                Admin Address: {debugInfo?.adminAddress || 'Not configured'}
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', mb: 1 }}>
                Match: {debugInfo?.match ? '✓' : '✗'}
              </Typography>
              
              <Typography variant="body2" sx={{ fontFamily: 'monospace', mt: 2, mb: 1 }}>
                <strong>Normalized Addresses:</strong>
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', mb: 1 }}>
                Current: {debugInfo?.normalizedCurrentAddress || 'Not connected'}
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', mb: 1 }}>
                Admin: {debugInfo?.normalizedAdminAddress || 'Not configured'}
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                Normalized Match: {debugInfo?.normalizedMatch ? '✓' : '✗'}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
              <Button 
                variant="contained" 
                onClick={() => navigate('/')}
                startIcon={<ArrowBack />}
                sx={{ 
                  borderRadius: '8px',
                  background: `linear-gradient(45deg, #00BCD4, #2196F3)`,
                }}
              >
                Back to Home
              </Button>
              
              <Button 
                variant="outlined"
                onClick={() => window.location.reload()}
                startIcon={<Refresh />}
                sx={{ 
                  borderRadius: '8px',
                  borderColor: alpha(theme.palette.primary.main, 0.5),
                  color: theme.palette.primary.main,
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: alpha(theme.palette.primary.main, 0.1)
                  }
                }}
              >
                Refresh
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    );
  }
  
  const adminTabs = getAdminTabs();
  
  const getActiveTabIcon = () => {
    switch (activeTab) {
      case 'overview': return <Dashboard />;
      case 'settings': return <Settings />;
      case 'pools': return <Group />;
      case 'transactions': return <History />;
      default: return <Dashboard />;
    }
  };

  const renderTabContent = () => {
    return (
      <ErrorBoundary>
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          {activeTab === 'overview' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <AnalyticsPanel />
              <SecuritySettingsComponent />
              <ContractSettingsComponent />
            </Box>
          )}
          
          {activeTab === 'settings' && (
            <ContractSettings 
              onSettingsUpdate={(settings) => {
                showNotification('Settings updated successfully', 'success');
              }}
            />
          )}
          
          {activeTab === 'pools' && <UserManagement />}
          
          {activeTab === 'transactions' && (
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                Transaction History
              </Typography>
              <TransactionTable 
                transactions={mixHistory} 
                loading={loading}
              />
            </Box>
          )}
        </motion.div>
      </ErrorBoundary>
    );
  };

  return (
    <AdminPanelLayout 
      onRefresh={handleRefreshData} 
      loading={loading}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          {getActiveTabIcon()}
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Admin Panel
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {adminTabs.find(tab => tab.id === activeTabId)?.description}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Tooltip title={autoRefresh ? 'Auto-refresh enabled' : 'Auto-refresh disabled'}>
            <IconButton 
              onClick={() => setAutoRefresh(!autoRefresh)}
              color={autoRefresh ? 'success' : 'default'}
            >
              {autoRefresh ? <CheckCircle /> : <Info />}
            </IconButton>
          </Tooltip>
          
          <Typography variant="body2" color="text.secondary">
            Last update: {lastRefresh.toLocaleTimeString()}
          </Typography>
          
          <Tooltip title="Refresh data">
            <IconButton 
              onClick={handleRefreshData}
              disabled={loading}
              sx={{ 
                color: theme.palette.primary.main,
                '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.1) }
              }}
            >
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      <Box sx={{ mb: 4 }}>
        <Tabs 
          value={activeTabId} 
          onChange={(_, newValue) => setActiveTabById(newValue)}
          sx={{
            '& .MuiTab-root': {
              color: alpha(theme.palette.text.primary, 0.7),
              '&.Mui-selected': {
                color: '#FF5722',
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#FF5722',
            }
          }}
        >
          {adminTabs.map((tab) => (
            <Tab 
              key={tab.id} 
              label={tab.name} 
              icon={tab.icon}
              title={tab.description}
              disabled={loading}
            />
          ))}
        </Tabs>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Button 
          onClick={previousTab}
          startIcon={<ArrowBack />}
          disabled={activeTabId === 0}
          sx={{
            borderRadius: '8px',
            borderColor: alpha(theme.palette.primary.main, 0.5),
            color: theme.palette.primary.main,
          }}
        >
          Previous
        </Button>
        
        <Button 
          onClick={nextTab}
          endIcon={<ArrowForward />}
          disabled={activeTabId === adminTabs.length - 1}
          sx={{
            borderRadius: '8px',
            borderColor: alpha(theme.palette.primary.main, 0.5),
            color: theme.palette.primary.main,
          }}
        >
          Next
        </Button>
      </Box>
      
      {renderTabContent()}
      
      <Box sx={{ mt: 6, pt: 4, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Contract Balance: {contractBalance || '0'} TON
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Transactions: {mixHistory.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Active Users: {stats?.totalUsers || 0}
          </Typography>
        </Box>
      </Box>
      
      <TransactionLoader 
        open={loading} 
        message="Processing..." 
        submessage="Please wait while we process your request"
      />
      
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </AdminPanelLayout>
  );
};

export default AdminPanel;