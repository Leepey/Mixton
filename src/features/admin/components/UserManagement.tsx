// features/admin/components/UserManagement.tsx
import React from 'react';
import { Grid, Card, CardContent, Typography, Box, Chip, IconButton, Tooltip, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useMixerContext } from '../../../context/MixerContext';

export const UserManagement: React.FC = () => {
  const theme = useTheme();
  const { availablePools } = useMixerContext();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Mixing Pools
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{
            borderRadius: '8px',
            background: `linear-gradient(45deg, #FF5722, #FFC107)`,
          }}
        >
          Add Pool
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        {availablePools.map((pool) => (
          <Grid size={{ xs: 12, md: 6, lg: 4 }} key={pool.id}>
            <Card 
              elevation={0}
              sx={{
                borderRadius: '16px',
                background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.grey[900], 0.6)})`,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha('#FF5722', 0.2)}`,
                height: '100%',
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  {pool.name}
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Fee Rate
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {pool.fee * 100}%
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Amount Range
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {pool.minAmount} - {pool.maxAmount} TON
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Min Delay
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {pool.minDelayHours} hours
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip 
                    label={pool.isActive ? 'Active' : 'Inactive'} 
                    size="small"
                    sx={{
                      bgcolor: pool.isActive 
                        ? alpha(theme.palette.success.main, 0.2) 
                        : alpha(theme.palette.error.main, 0.2),
                      color: pool.isActive 
                        ? theme.palette.success.main 
                        : theme.palette.error.main,
                    }}
                  />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Tooltip title="Edit">
                    <IconButton size="small" sx={{ mr: 1 }}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" color="error">
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </motion.div>
  );
};