// src/components/ContactSection.tsx
import React from 'react';
import { Box, Container, Typography, Grid, TextField, Button, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material';
import { motion } from 'framer-motion';
import { Send as SendIcon } from '@mui/icons-material';

const ContactSection: React.FC = () => {
  const theme = useTheme();

  return (
    <Box 
      component="section"
      sx={{ 
        py: 8,
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Container maxWidth="lg">
        <Box textAlign="center" mb={6}>
          <Typography 
            variant="h3" 
            component={motion.h2}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            gutterBottom 
            fontWeight="bold"
            sx={{ 
              color: 'white',
              mb: 2
            }}
          >
            Get In Touch
          </Typography>
          
          <Typography 
            variant="h6" 
            component={motion.p}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            Have questions about Mixton? We'd love to hear from you.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper
              component={motion.div}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              sx={{
                p: 4,
                borderRadius: 3,
                background: alpha(theme.palette.background.paper, 0.05),
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
              }}
            >
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Name"
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: alpha(theme.palette.background.paper, 0.05)
                      }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: alpha(theme.palette.background.paper, 0.05)
                      }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Subject"
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: alpha(theme.palette.background.paper, 0.05)
                      }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Message"
                    multiline
                    rows={4}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: alpha(theme.palette.background.paper, 0.05)
                      }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Button
                    variant="contained"
                    endIcon={<SendIcon />}
                    sx={{
                      borderRadius: 2,
                      py: 1.5,
                      background: 'linear-gradient(45deg, #8BC34A, #2196F3)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #7CB342, #1976D2)',
                      }
                    }}
                  >
                    Send Message
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              component={motion.div}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              sx={{
                p: 4,
                borderRadius: 3,
                height: '100%',
                background: alpha(theme.palette.background.paper, 0.05),
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
              }}
            >
              <Typography variant="h5" gutterBottom fontWeight="bold" color="white">
                Contact Information
              </Typography>
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="rgba(255, 255, 255, 0.7)" gutterBottom>
                  Email
                </Typography>
                <Typography variant="body1" color="white" gutterBottom>
                  support@mixton.io
                </Typography>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="rgba(255, 255, 255, 0.7)" gutterBottom>
                  Discord
                </Typography>
                <Typography variant="body1" color="white" gutterBottom>
                  discord.gg/mixton
                </Typography>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="rgba(255, 255, 255, 0.7)" gutterBottom>
                  GitHub
                </Typography>
                <Typography variant="body1" color="white" gutterBottom>
                  github.com/Leepey/Mixton
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

// Экспортируем компонент (выберите один вариант):

// Вариант А: Только дефолтный экспорт
export default ContactSection;

// Вариант Б: Только именованный экспорт
// export { ContactSection };

// Вариант В: Оба экспорта
// export default ContactSection;
// export { ContactSection };