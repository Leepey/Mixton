// features/home/components/StatsOverviewSection.tsx
import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { NeonText } from '../../shared/components/ui/typography/NeonText';
import { StatCard } from './StatCard';

interface StatsOverviewSectionProps {
  totalParticipants: number;
  totalVolume: number;
  totalPools: number;
}

export const StatsOverviewSection: React.FC<StatsOverviewSectionProps> = ({
  totalParticipants,
  totalVolume,
  totalPools
}) => {
  return (
    <Box sx={{ py: 8, backgroundColor: 'rgba(0, 0, 0, 0.2)', borderRadius: 2 }}>
      <Typography 
        variant="h2" 
        component="h2" 
        gutterBottom
        sx={{ 
          textAlign: 'center', 
          mb: 6,
          fontSize: { xs: '2rem', md: '2.5rem' },
          fontWeight: 700
        }}
      >
        <NeonText text="Platform Statistics" />
      </Typography>
      
      <Grid container spacing={4} justifyContent="center">
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard 
            title="Total Participants" 
            value={totalParticipants} 
            delay={0.1} 
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard 
            title="Total Volume (TON)" 
            value={totalVolume} 
            delay={0.2} 
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard 
            title="Active Pools" 
            value={totalPools} 
            delay={0.3} 
          />
        </Grid>
      </Grid>
    </Box>
  );
};