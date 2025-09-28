// src/features/home/components/FeatureShowcase.tsx
import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  useTheme,
  alpha
} from '@mui/material';
import { motion } from 'framer-motion';
import { FeatureCard } from './FeatureCard';
import type { Feature } from '../types/home.types';

interface FeatureShowcaseProps {
  features: Feature[];
  title?: string;
  subtitle?: string;
  featuredFeatureId?: string;
}

export const FeatureShowcase: React.FC<FeatureShowcaseProps> = ({
  features,
  title = "Featured Feature",
  subtitle,
  featuredFeatureId
}) => {
  const theme = useTheme();
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(featuredFeatureId || null);

  const featuredFeature = features.find(f => f.id === (hoveredFeature || featuredFeatureId)) || features[0];
  const otherFeatures = features.filter(f => f.id !== featuredFeature?.id);

  return (
    <Box sx={{ py: 12, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {title && (
            <Typography 
              variant="h3" 
              component="h2" 
              textAlign="center" 
              sx={{ mb: 2, fontWeight: 700 }}
            >
              {title}
            </Typography>
          )}
          
          {subtitle && (
            <Typography 
              variant="h6" 
              color="text.secondary"
              textAlign="center" 
              sx={{ mb: 8, maxWidth: '600px', mx: 'auto' }}
            >
              {subtitle}
            </Typography>
          )}
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { md: '2fr 1fr' }, gap: 6, alignItems: 'start' }}>
            {/* Featured Feature */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <FeatureCard
                {...featuredFeature}
                variant="detailed"
                glowColor={theme.palette.primary.main}
              />
            </motion.div>
            
            {/* Other Features */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {otherFeatures.slice(0, 3).map((feature, index) => (
                  <FeatureCard
                    key={feature.id}
                    {...feature}
                    variant="compact"
                    delay={index * 0.1}
                    glowColor={theme.palette.secondary.main}
                    onMouseEnter={() => setHoveredFeature(feature.id)}
                    onMouseLeave={() => setHoveredFeature(featuredFeatureId || null)}
                  />
                ))}
              </Box>
            </motion.div>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};