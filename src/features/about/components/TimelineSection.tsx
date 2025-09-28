// features/about/components/TimelineSection.tsx
import React from 'react';
import { Box, Container, Typography, Paper, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import { useAboutData } from '../hooks/useAboutData';

export const TimelineSection: React.FC = () => {
  const theme = useTheme();
  const { timeline, loading } = useAboutData();

  if (loading) {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography>Loading timeline...</Typography>
      </Box>
    );
  }

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
            Our Journey
          </Typography>
          
          <Typography 
            variant="h6" 
            color="text.secondary"
            textAlign="center" 
            sx={{ mb: 8, maxWidth: '600px', mx: 'auto' }}
          >
            Key milestones in our mission to bring privacy to TON
          </Typography>
          
          <Box sx={{ position: 'relative' }}>
            {/* Timeline line */}
            <Box sx={{
              position: 'absolute',
              left: '50%',
              top: 0,
              bottom: 0,
              width: 2,
              background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.3)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
              transform: 'translateX(-50%)'
            }} />
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {timeline.map((event, index) => (
                <Box 
                  key={event.id}
                  sx={{ 
                    display: 'flex',
                    justifyContent: index % 2 === 0 ? 'flex-end' : 'flex-start',
                    position: 'relative'
                  }}
                >
                  <Box sx={{ 
                    width: { xs: '100%', md: '45%' },
                    position: 'relative'
                  }}>
                    {/* Timeline dot */}
                    <Box sx={{
                      position: 'absolute',
                      top: '50%',
                      [index % 2 === 0 ? 'right' : 'left']: { md: '-10%', xs: '-30px' },
                      transform: 'translateY(-50%)',
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: theme.palette.primary.main,
                      border: `4px solid ${theme.palette.background.paper}`,
                      zIndex: 1
                    }} />
                    
                    <motion.div
                      initial={{ opacity: 0, x: index % 2 === 0 ? 30 : -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Paper 
                        elevation={0}
                        sx={{
                          p: 4,
                          borderRadius: '16px',
                          background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.grey[900], 0.6)})`,
                          backdropFilter: 'blur(10px)',
                          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                          textAlign: index % 2 === 0 ? 'right' : 'left'
                        }}
                      >
                        <Box sx={{ 
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 1,
                          mb: 2
                        }}>
                          <Typography variant="h4" sx={{ fontSize: '2rem' }}>
                            {event.icon}
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                            {event.date}
                          </Typography>
                        </Box>
                        
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                          {event.title}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary">
                          {event.description}
                        </Typography>
                      </Paper>
                    </motion.div>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};