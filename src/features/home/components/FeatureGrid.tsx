// src/features/home/components/FeatureGrid.tsx
import React from 'react';
import {
  Grid,
  Box,
  useTheme,
  alpha,
  Container
} from '@mui/material';
import { motion } from 'framer-motion';
import { FeatureCard } from './FeatureCard';
import type { Feature } from '../types/home.types';

interface FeatureGridProps {
  features: Feature[];
  columns?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  spacing?: number;
  variant?: 'default' | 'compact' | 'detailed';
  showFeatured?: boolean;
  maxFeatures?: number;
  className?: string;
  sx?: React.CSSProperties;
}

export const FeatureGrid: React.FC<FeatureGridProps> = ({
  features,
  columns = { xs: 12, sm: 6, md: 4 },
  spacing = 4,
  variant = 'default',
  showFeatured = true,
  maxFeatures,
  className,
  sx
}) => {
  const theme = useTheme();

  // Фильтруем и сортируем фичи
  const displayFeatures = React.useMemo(() => {
    let filtered = features;
    
    // Показываем только featured, если указано
    if (showFeatured) {
      filtered = features.filter(feature => feature.featured);
    }
    
    // Ограничиваем количество
    if (maxFeatures) {
      filtered = filtered.slice(0, maxFeatures);
    }
    
    return filtered;
  }, [features, showFeatured, maxFeatures]);

  return (
    <Box
      className={className}
      sx={{
        py: spacing * 2,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%238BC34A' fill-opacity='0.03'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
          opacity: 0.5,
          pointerEvents: 'none'
        },
        ...sx
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={spacing}>
          {displayFeatures.map((feature, index) => (
            <Grid
              key={feature.id || index}
              size={columns}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                viewport={{ once: true, margin: "-100px" }}
                style={{ height: '100%' }}
              >
                <FeatureCard
                  id={feature.id}
                  title={feature.title}
                  description={feature.description}
                  icon={feature.icon}
                  details={feature.details}
                  category={feature.category}
                  badge={feature.badge}
                  featured={feature.featured}
                  variant={variant}
                  glowColor={theme.palette.primary.main}
                  sx={{
                    height: '100%',
                  }}
                />
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};