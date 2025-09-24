// src/pages/About.tsx
import React from 'react';
import { Container, Typography } from '@mui/material';

const About: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Typography variant="h2" gutterBottom>
        About TON Mixer
      </Typography>
      <Typography variant="body1">
        Information about our service.
      </Typography>
    </Container>
  );
};

export default About;