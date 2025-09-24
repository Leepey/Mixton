// src/components/Footer.tsx
import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  Grid,
  IconButton
} from '@mui/material';
import {
  GitHub,
  Twitter,
  Telegram,
  Description
} from '@mui/icons-material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'rgba(20, 20, 20, 0.7)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        py: 4,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Box 
                sx={{ 
                  width: 32, 
                  height: 32, 
                  bgcolor: 'primary.main',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Box 
                  component="span" 
                  sx={{ 
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}
                >
                  T
                </Box>
              </Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(to right, #018d8dff, #067a9aff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                TON Mixer
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Secure and anonymous TON transactions. Mix your coins with other transactions to enhance privacy.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton 
                color="primary" 
                aria-label="github"
                href="#"
                sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' }
                }}
              >
                <GitHub />
              </IconButton>
              <IconButton 
                color="primary" 
                aria-label="twitter"
                href="#"
                sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' }
                }}
              >
                <Twitter />
              </IconButton>
              <IconButton 
                color="primary" 
                aria-label="telegram"
                href="#"
                sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' }
                }}
              >
                <Telegram />
              </IconButton>
              <IconButton 
                color="primary" 
                aria-label="docs"
                href="#"
                sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' }
                }}
              >
                <Description />
              </IconButton>
            </Box>
          </Grid>

          <Grid size={{ xs: 6, md: 2 }}>
            <Typography variant="h6" gutterBottom>
              Product
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="#" color="text.secondary" underline="hover">
                Features
              </Link>
              <Link href="#" color="text.secondary" underline="hover">
                How it works
              </Link>
              <Link href="#" color="text.secondary" underline="hover">
                Security
              </Link>
              <Link href="#" color="text.secondary" underline="hover">
                Pricing
              </Link>
            </Box>
          </Grid>

          <Grid size={{ xs: 6, md: 2 }}>
            <Typography variant="h6" gutterBottom>
              Resources
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="#" color="text.secondary" underline="hover">
                Documentation
              </Link>
              <Link href="#" color="text.secondary" underline="hover">
                API
              </Link>
              <Link href="#" color="text.secondary" underline="hover">
                Blog
              </Link>
              <Link href="#" color="text.secondary" underline="hover">
                Support
              </Link>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" gutterBottom>
              Legal
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="#" color="text.secondary" underline="hover">
                Terms of Service
              </Link>
              <Link href="#" color="text.secondary" underline="hover">
                Privacy Policy
              </Link>
              <Link href="#" color="text.secondary" underline="hover">
                Compliance
              </Link>
              <Link href="#" color="text.secondary" underline="hover">
                Contact
              </Link>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', mt: 4, pt: 3 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} TON Mixer. All rights reserved. This service is for educational purposes only. Use responsibly and in compliance with local laws.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;