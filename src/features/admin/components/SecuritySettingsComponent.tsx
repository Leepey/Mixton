// features/admin/components/SecuritySettingsComponent.tsx
import React from 'react';
import { Paper, Button, Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material';
import { useContractManagement } from '../hooks/useContractManagement';

export const SecuritySettingsComponent: React.FC = () => {
  const theme = useTheme();
  const { loading, handleProcessQueue } = useContractManagement();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper 
        elevation={0}
        sx={{
          p: 3,
          borderRadius: '16px',
          background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.grey[900], 0.6)})`,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha('#FF5722', 0.2)}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Queue Processing
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manually process the pending transaction queue
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={handleProcessQueue}
          disabled={loading}
          sx={{
            borderRadius: '8px',
            background: `linear-gradient(45deg, #FF5722, #FFC107)`,
          }}
        >
          Process Queue
        </Button>
      </Paper>
    </motion.div>
  );
};