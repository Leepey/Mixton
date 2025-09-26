// pages/Dashboard.tsx
import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { useAuth } from '../app/AuthContext';
import { useMixerContext } from '../context/MixerContext';
import { 
  useDashboardState,
  StatsModule,
  PoolsModule,
  TransactionsModule,
  SettingsModule,
  DashboardTabs
} from '../features/dashboard';
import { MixForm } from '../features/mixer/components/MixForm';
import { TransactionLoader } from '../features/shared/components/ui/loaders/TransactionLoader';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { mixTons, availablePools, mixHistory } = useMixerContext();
  const {
    activeTab,
    setActiveTab,
    showForm,
    setShowForm,
    transactionPending,
    selectedPool,
    handlePoolSelect,
    handleMix
  } = useDashboardState();

  const handleMixSubmit = async (data: any) => {
    await handleMix(data, mixTons);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <StatsModule />;
      case 'mixing':
        return <PoolsModule onPoolSelect={handlePoolSelect} />;
      case 'history':
        return <TransactionsModule />;
      case 'settings':
        return <SettingsModule />;
      default:
        return <StatsModule />;
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: `linear-gradient(135deg, #0a192f 0%, #000000 100%)`,
      color: 'text.primary',
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

        <DashboardTabs 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />

        {renderTabContent()}
      </Container>

      <MixForm
        open={showForm}
        onClose={() => setShowForm(false)}
        poolId={selectedPool}
        initialData={{
          amount: selectedPool ? availablePools.find(p => p.id === selectedPool)?.minAmount : undefined,
          mixingOption: 'standard',
          outputAddresses: [''],
          note: '',
          inputAddress: ''
        }}
        transactionPending={transactionPending}
        onSubmit={handleMixSubmit}
        userConnected={user.connected}
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