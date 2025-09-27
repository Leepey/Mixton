// features/admin/components/AdminPanelLayout.tsx
import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material';

interface AdminPanelLayoutProps {
  children: React.ReactNode;
  onRefresh: () => void;
  loading: boolean;
}

export const AdminPanelLayout: React.FC<AdminPanelLayoutProps> = ({ 
  children, 
  onRefresh, 
  loading 
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: `linear-gradient(135deg, #0a192f 0%, #000000 100%)`,
      color: theme.palette.text.primary,
      pt: 8,
      pb: 4
    }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              background: `linear-gradient(45deg, #FF5722, #FFC107)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Admin Panel
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={onRefresh}
            disabled={loading}
            sx={{
              borderRadius: '8px',
              borderColor: alpha(theme.palette.primary.main, 0.5),
              color: theme.palette.primary.main,
              '&:hover': {
                borderColor: theme.palette.primary.main,
                backgroundColor: alpha(theme.palette.primary.main, 0.1)
              }
            }}
          >
            Refresh Data
          </Button>
        </Box>
        
        {children}
      </Container>
    </Box>
  );
};