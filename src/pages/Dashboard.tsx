// src/pages/Dashboard.tsx
import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  useTheme,
  Tab,
  Tabs,
} from '@mui/material';
import { 
  AccountBalanceWallet, 
  Shuffle, 
  History, 
  Settings,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useMixerContext } from '../context/MixerContext';
import MixForm from '../features/mixer/components/MixForm';
import TransactionLoader from '../features/shared/components/ui/loaders/TransactionLoader';
import { 
  StatsModule, 
  PoolsModule, 
  TransactionsModule, 
  SettingsModule 
} from '../features/dashboard';
import type { MixFormData } from '../features/mixer/types/mixer';

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [transactionPending, setTransactionPending] = useState(false);
  const [selectedPool, setSelectedPool] = useState<string>('');
  
  const { user } = useAuth();
  const { 
    mixTons, 
    availablePools,
    mixHistory 
  } = useMixerContext();

  const handlePoolSelect = (poolId: string) => {
    setSelectedPool(poolId);
    setShowForm(true);
  };

  const handleMix = async (data: MixFormData) => {
    setTransactionPending(true);
    try {
      // Проверка обязательных полей
      if (!data.inputAddress) {
        throw new Error('Input address is required');
      }
      
      // Проверка и обработка amount
      if (data.amount === undefined || data.amount <= 0) {
        throw new Error('Amount must be a positive number');
      }
      
      // Теперь data.amount гарантированно является number
      await mixTons(data.amount, data.note);
      setShowForm(false);
    } catch (error) {
      console.error('Mix transaction failed:', error);
      // Здесь можно добавить отображение ошибки пользователю
    } finally {
      setTransactionPending(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <StatsModule />;
      case 1:
        return <PoolsModule onPoolSelect={handlePoolSelect} />;
      case 2:
        return <TransactionsModule />;
      case 3:
        return <SettingsModule />;
      default:
        return <StatsModule />;
    }
  };

  // Обеспечиваем, что amount всегда имеет значение по умолчанию
  const getInitialAmount = (): number => {
    if (!selectedPool) return 0;
    const pool = availablePools.find(p => p.id === selectedPool);
    return pool?.minAmount || 0;
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: `linear-gradient(135deg, #0a192f 0%, #000000 100%)`,
      color: theme.palette.text.primary,
      pt: 8,
      pb: 4
    }}>
      <Container maxWidth="lg">
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{ 
            textAlign: 'center', 
            mb: 6,
            fontWeight: 700,
            background: `linear-gradient(45deg, #00BCD4, #2196F3)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Dashboard
        </Typography>

        {/* Табы навигации */}
        <Box sx={{ mb: 4 }}>
          <Tabs 
            value={activeTab} 
            onChange={(_, newValue) => setActiveTab(newValue)}
            centered
            sx={{
              '& .MuiTab-root': {
                color: theme.palette.text.secondary,
                '&.Mui-selected': {
                  color: '#00BCD4',
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#00BCD4',
              }
            }}
          >
            <Tab label="Overview" icon={<AccountBalanceWallet />} />
            <Tab label="Mixing" icon={<Shuffle />} />
            <Tab label="History" icon={<History />} />
            <Tab label="Settings" icon={<Settings />} />
          </Tabs>
        </Box>

        {/* Контент табов */}
        {renderTabContent()}
      </Container>

      {/* Mix Form Modal */}
      <MixForm
        open={showForm}
        onClose={() => setShowForm(false)}
        poolId={selectedPool}
        initialData={{
          amount: getInitialAmount(), // Всегда возвращает number
          mixingOption: 'standard',
          outputAddresses: [''],
          note: '',
          inputAddress: ''
        }}
        transactionPending={transactionPending}
        onSubmit={handleMix}
        userConnected={user?.connected || false}
        availablePools={availablePools}
      />
      
      <TransactionLoader 
        open={transactionPending} 
        message="Processing your transaction..."
      />
    </Box>
  );
};

export default Dashboard;