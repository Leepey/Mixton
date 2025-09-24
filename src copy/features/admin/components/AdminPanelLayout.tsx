// src/features/admin/components/AdminPanelLayout.tsx
import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Tab, 
  Tabs,
  useTheme,
  alpha,
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  People, 
  Settings, 
  Security, 
  Analytics,
  Dashboard,
} from '@mui/icons-material';
import { UserManagement } from './UserManagement';
import { ContractSettingsComponent } from './ContractSettingsComponent';
import { SecuritySettingsComponent } from './SecuritySettingsComponent';
import { AnalyticsPanel } from './AnalyticsPanel';

export const AdminPanelLayout: React.FC = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
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
            background: `linear-gradient(45deg, #FF5722, #FFC107)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Admin Panel
        </Typography>

        {/* Табы навигации */}
        <Box sx={{ mb: 4 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            centered
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
            <Tab label="Dashboard" icon={<Dashboard />} />
            <Tab label="Users" icon={<People />} />
            <Tab label="Contract" icon={<Settings />} />
            <Tab label="Security" icon={<Security />} />
            <Tab label="Analytics" icon={<Analytics />} />
          </Tabs>
        </Box>

        {/* Контент табов */}
        {activeTab === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Paper 
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: '16px',
                    background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.grey[900], 0.6)})`,
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${alpha('#00BCD4', 0.2)}`,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <People sx={{ fontSize: 48, color: '#00BCD4', mb: 2 }} />
                  <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                    1,847
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Users
                  </Typography>
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Paper 
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: '16px',
                    background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.grey[900], 0.6)})`,
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${alpha('#4CAF50', 0.2)}`,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Settings sx={{ fontSize: 48, color: '#4CAF50', mb: 2 }} />
                  <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                    2,847
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Deposits
                  </Typography>
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Paper 
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: '16px',
                    background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.grey[900], 0.6)})`,
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${alpha('#FFC107', 0.2)}`,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Analytics sx={{ fontSize: 48, color: '#FFC107', mb: 2 }} />
                  <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                    $31,419
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Fees Collected
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </motion.div>
        )}

        {activeTab === 1 && <UserManagement />}
        {activeTab === 2 && <ContractSettingsComponent />}
        {activeTab === 3 && <SecuritySettingsComponent />}
        {activeTab === 4 && <AnalyticsPanel />}
      </Container>
    </Box>
  );
};