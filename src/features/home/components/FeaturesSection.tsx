// src/features/home/components/FeaturesSection.tsx

import React from 'react';
import { Grid, Typography, Box, Container } from '@mui/material';
import { motion } from 'framer-motion';
import { useHomeData } from '../hooks/useHomeData';
import { FeatureCard } from './FeatureCard';

interface FeaturesSectionProps {
  variant?: 'default' | 'compact' | 'detailed';
  columns?: { xs: number; sm?: number; md?: number; lg?: number };
  showTitle?: boolean;
  maxFeatures?: number;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ 
  variant = 'default',
  columns = { xs: 12, sm: 6, md: 3 },
  showTitle = true,
  maxFeatures
}) => {
  const { features, loading } = useHomeData();

  if (loading) {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography>Loading features...</Typography>
      </Box>
    );
  }

  const displayFeatures = maxFeatures ? features.slice(0, maxFeatures) : features;

  return (
    <Box sx={{ py: 12, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {showTitle && (
            <>
              <Typography 
                variant="h3" 
                component="h2" 
                textAlign="center" 
                sx={{ mb: 2, fontWeight: 700 }}
              >
                Why Choose Mixton?
              </Typography>
              
              <Typography 
                variant="h6" 
                color="text.secondary"
                textAlign="center" 
                sx={{ mb: 8, maxWidth: '600px', mx: 'auto' }}
              >
                Experience the most advanced TON mixing service with cutting-edge privacy features
              </Typography>
            </>
          )}
          
          <Grid container spacing={4}>
            {displayFeatures.map((feature, index) => (
              <Grid size={columns} key={feature.id}>
                <FeatureCard 
                  title={feature.title}
                  description={feature.description}
                  icon={feature.icon}
                  details={feature.details}
                  variant={variant}
                  delay={index * 0.1}
                />
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};