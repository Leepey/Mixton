// features/about/components/ContactSection.tsx
import React from 'react';
import { Box, Container, Typography, Paper, alpha, Grid, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import { useAboutData } from '../hooks/useAboutData';
import { Email, Telegram, Discord, GitHub } from '@mui/icons-material';

export const ContactSection: React.FC = () => {
  const theme = useTheme();
  const { contact, loading } = useAboutData();

  if (loading) {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography>Loading contact information...</Typography>
      </Box>
    );
  }

  const contactMethods = contact ? [
    {
      icon: <Email />,
      label: 'Email',
      value: contact.email,
      href: `mailto:${contact.email}`,
      color: '#00BCD4'
    },
    {
      icon: <Telegram />,
      label: 'Telegram',
      value: contact.telegram,
      href: `https://t.me/${contact.telegram}`,
      color: '#0088cc'
    },
    {
      icon: <Discord />,
      label: 'Discord',
      value: 'Join our community',
      href: contact.discord,
      color: '#5865F2'
    },
    {
      icon: <GitHub />,
      label: 'GitHub',
      value: 'View source code',
      href: contact.github,
      color: '#333'
    }
  ] : [];

  return (
    <Box sx={{ py: 12, bgcolor: 'background.default' }} id="contact">
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
            Get in Touch
          </Typography>
          
          <Typography 
            variant="h6" 
            color="text.secondary"
            textAlign="center" 
            sx={{ mb: 8, maxWidth: '600px', mx: 'auto' }}
          >
            Have questions or feedback? We'd love to hear from you
          </Typography>
          
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper 
                elevation={0}
                sx={{
                  p: 6,
                  borderRadius: '20px',
                  height: '100%',
                  background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.grey[900], 0.6)})`,
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
                  Contact Information
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {contactMethods.map((method, index) => (
                    <Box 
                      key={method.label}
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 3,
                        p: 3,
                        borderRadius: '12px',
                        background: alpha(theme.palette.background.paper, 0.5),
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: alpha(method.color, 0.1),
                          transform: 'translateX(5px)'
                        }
                      }}
                    >
                      <Box sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 50,
                        height: 50,
                        borderRadius: '12px',
                        background: alpha(method.color, 0.1),
                        color: method.color
                      }}>
                        {method.icon}
                      </Box>
                      
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          {method.label}
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {method.value}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper 
                elevation={0}
                sx={{
                  p: 6,
                  borderRadius: '20px',
                  height: '100%',
                  background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.grey[900], 0.6)})`,
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
                  Community & Support
                </Typography>
                
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
                  Join our growing community of privacy advocates and blockchain enthusiasts. 
                  Get help, share ideas, and stay updated with the latest developments.
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="contained"
                    href={contact?.discord}
                    target="_blank"
                    startIcon={<Discord />}
                    sx={{
                      borderRadius: '12px',
                      py: 1.5,
                      background: `linear-gradient(45deg, #5865F2, #7289DA)`,
                      justifyContent: 'flex-start',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(88, 101, 242, 0.3)'
                      }
                    }}
                  >
                    Join Discord Community
                  </Button>
                  
                  <Button
                    variant="contained"
                    href={contact?.telegram}
                    target="_blank"
                    startIcon={<Telegram />}
                    sx={{
                      borderRadius: '12px',
                      py: 1.5,
                      background: `linear-gradient(45deg, #0088cc, #0099ff)`,
                      justifyContent: 'flex-start',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(0, 136, 204, 0.3)'
                      }
                    }}
                  >
                    Follow on Telegram
                  </Button>
                  
                  <Button
                    variant="outlined"
                    href={contact?.github}
                    target="_blank"
                    startIcon={<GitHub />}
                    sx={{
                      borderRadius: '12px',
                      py: 1.5,
                      borderColor: alpha(theme.palette.text.primary, 0.3),
                      color: theme.palette.text.primary,
                      justifyContent: 'flex-start',
                      '&:hover': {
                        borderColor: theme.palette.text.primary,
                        backgroundColor: alpha(theme.palette.text.primary, 0.1)
                      }
                    }}
                  >
                    Contribute on GitHub
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};