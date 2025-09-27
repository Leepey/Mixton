// features/dashboard/components/SettingsModule.tsx
import React from 'react';
import { Typography, Paper, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material';

export const SettingsModule: React.FC = () => {
  const theme = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        Settings
      </Typography>
      
      <Paper 
        elevation={0}
        sx={{
          p: 4,
          borderRadius: '16px',
          background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.grey[900], 0.6)})`,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha('#00BCD4', 0.2)}`,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          Privacy Settings
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Default mixing level
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Standard: Good balance between privacy and speed
          </Typography>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Auto-clear history
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Transaction history will be automatically cleared after 30 days
          </Typography>
        </Box>
        
        <Box>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Privacy mode
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Enhanced privacy features are enabled by default
          </Typography>
        </Box>
      </Paper>
    </motion.div>
  );
};