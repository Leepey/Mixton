// features/about/components/TeamSection.tsx
import React from 'react';
import { Grid, Typography, Box, Container, Avatar, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import { GitHub, Twitter, LinkedIn } from '@mui/icons-material';
import { useAboutData } from '../hooks/useAboutData';
import { TeamMemberCard } from './TeamMemberCard';

export const TeamSection: React.FC = () => {
  const { team, loading } = useAboutData();

  if (loading) {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography>Loading team information...</Typography>
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
            Meet Our Team
          </Typography>
          
          <Typography 
            variant="h6" 
            color="text.secondary"
            textAlign="center" 
            sx={{ mb: 8, maxWidth: '600px', mx: 'auto' }}
          >
            Passionate individuals working together to build the future of privacy on TON
          </Typography>
          
          <Grid container spacing={4}>
            {team.map((member, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={member.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <TeamMemberCard {...member} />
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};