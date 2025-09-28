// features/about/components/TechnologySection.tsx
import React from 'react';
import { Grid, Typography, Box, Container, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { motion } from 'framer-motion';
import { CheckCircle } from '@mui/icons-material';
import { useAboutData } from '../hooks/useAboutData';
import { TechnologyCard } from './TechnologyCard';

export const TechnologySection: React.FC = () => {
  const { features, loading } = useAboutData();

  if (loading) {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography>Loading technology information...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 12, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography 
            variant="h3" 
            component="h2" 
            textAlign="center" 
            sx={{ mb: 2, fontWeight: 700 }}
          >
            Our Technology
          </Typography>
          
          <Typography 
            variant="h6" 
            color="text.secondary"
            textAlign="center" 
            sx={{ mb: 8, maxWidth: '600px', mx: 'auto' }}
          >
            Cutting-edge privacy solutions powered by advanced cryptography
          </Typography>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={feature.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <TechnologyCard {...feature} />
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};