// features/dashboard/components/DashboardTabs.tsx
import React from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { AccountBalanceWallet, Shuffle, History, Settings } from '@mui/icons-material';
import { DashboardTab } from '../types/dashboard.types';

interface DashboardTabsProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
}

export const DashboardTabs: React.FC<DashboardTabsProps> = ({ activeTab, onTabChange }) => {
  const theme = useTheme();
  const { alpha } = require('@mui/material');

  return (
    <Box sx={{ mb: 4 }}>
      <Tabs 
        value={activeTab} 
        onChange={(_, newValue) => onTabChange(newValue as DashboardTab)}
        centered
        sx={{
          '& .MuiTab-root': {
            color: alpha(theme.palette.text.primary, 0.7),
            '&.Mui-selected': {
              color: '#00BCD4',
            }
          },
          '& .MuiTabs-indicator': {
            backgroundColor: '#00BCD4',
          }
        }}
      >
        <Tab label="Overview" icon={<AccountBalanceWallet />} value="overview" />
        <Tab label="Mixing" icon={<Shuffle />} value="mixing" />
        <Tab label="History" icon={<History />} value="history" />
        <Tab label="Settings" icon={<Settings />} value="settings" />
      </Tabs>
    </Box>
  );
};