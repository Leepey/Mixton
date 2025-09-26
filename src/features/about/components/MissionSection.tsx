// features/about/components/MissionSection.tsx
import React from 'react';
import { Box, Container, Typography, Paper, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import { Shield, Users, Zap, Globe } from '@mui/icons-material';

export const MissionSection: React.FC = () => {
  const theme = useTheme();

  const missionPoints = [
    {
      icon: <Shield />,
      title: 'Privacy First',
      description: 'We believe financial privacy is a fundamental right. Our mission is to provide accessible, secure, and user-friendly privacy tools for everyone in the TON ecosystem.'
    },
    {
      icon: <Users />,
      title: 'Community Driven',
      description: 'Built by the community, for the community. We actively engage with users and developers to continuously improve our services.'
    },
    {
      icon: <Zap />,
      title: 'Innovation',
      description: 'Pushing the boundaries of privacy technology with cutting-edge cryptographic solutions and innovative mixing algorithms.'
    },
    {
      icon: <Globe />,
      title: 'Accessibility',
      description: 'Making privacy tools accessible to everyone, regardless of technical expertise or financial resources.'
    }
  ];

  return (
    <Box sx={{ py: 12 }}>
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
            Our Mission
          </Typography>
          
          <Typography 
            variant="h6" 
            color="text.secondary"
            textAlign="center" 
            sx={{ mb: 8, maxWidth: '600px', mx: 'auto' }}
          >
            Empowering individuals with financial privacy through innovative blockchain solutions
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 2fr' }, gap: 4 }}>
            <Paper 
              elevation={0}
              sx={{
                p: 6,
                borderRadius: '20px',
                background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.grey[900], 0.6)})`,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                gridColumn: { xs: '1', md: '1 / -1' }
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, textAlign: 'center' }}>
                Why We Exist
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8, textAlign: 'center', fontSize: '1.1rem' }}>
                In an increasingly transparent world, financial privacy has become more important than ever. 
                Mixton was founded to address the growing need for privacy solutions in the TON ecosystem. 
                We combine cutting-edge cryptography with user-friendly design to make privacy accessible to everyone.
              </Typography>
            </Paper>
            
            {missionPoints.map((point, index) => (
              <Paper 
                key={point.title}
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: '16px',
                  background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.grey[900], 0.6)})`,
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: `0 10px 30px ${alpha(theme.palette.primary.main, 0.1)}`
                  }
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Box sx={{ 
                    display: 'inline-flex',
                    p: 2,
                    borderRadius: '12px',
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    mb: 3
                  }}>
                    {point.icon}
                  </Box>
                  
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    {point.title}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {point.description}
                  </Typography>
                </motion.div>
              </Paper>
            ))}
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};