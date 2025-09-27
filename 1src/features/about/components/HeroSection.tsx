// features/about/components/HeroSection.tsx
import React from 'react';
import { Box, Container, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { alpha } from '@mui/material';

export const HeroSection: React.FC = () => {
  const theme = useTheme();

  return (
    <Box sx={{ 
      py: { xs: 8, md: 12 },
      textAlign: 'center',
      position: 'relative',
      background: `linear-gradient(135deg, ${alpha('#00BCD4', 0.1)} 0%, ${alpha('#9C27B0', 0.1)} 100%)`,
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `radial-gradient(circle at 30% 40%, ${alpha('#00BCD4', 0.15)} 0%, transparent 50%)`,
        zIndex: -1
      }
    }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography 
            variant="h1" 
            component="h1" 
            sx={{ 
              fontWeight: 800,
              fontSize: { xs: '2.5rem', md: '4rem' },
              mb: 3,
              background: `linear-gradient(45deg, #00BCD4, #2196F3, #9C27B0)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1.2
            }}
          >
            About Mixton
          </Typography>
          
          <Typography 
            variant="h5" 
            color="text.secondary"
            sx={{ 
              mb: 4,
              maxWidth: '700px',
              mx: 'auto',
              fontSize: { xs: '1.1rem', md: '1.3rem' }
            }}
          >
            We're building the future of privacy on TON blockchain. Learn about our mission, team, and the technology behind our mixing service.
          </Typography>
        </motion.div>
      </Container>
    </Box>
  );
};