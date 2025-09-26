// features/about/components/TechnologyCard.tsx
import React from 'react';
import { Paper, Typography, Box, List, ListItem, ListItemIcon, ListItemText, alpha } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { CheckCircle } from '@mui/icons-material';
import { Feature } from '../types/about.types';

interface TechnologyCardProps extends Feature {}

export const TechnologyCard: React.FC<TechnologyCardProps> = ({ 
  title, 
  description, 
  icon, 
  details 
}) => {
  const theme = useTheme();

  return (
    <Paper 
      elevation={0}
      sx={{
        p: 4,
        borderRadius: '16px',
        height: '100%',
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
      <Box sx={{ 
        display: 'inline-flex',
        p: 2,
        borderRadius: '12px',
        bgcolor: alpha(theme.palette.primary.main, 0.1),
        color: theme.palette.primary.main,
        mb: 3,
        fontSize: '2rem'
      }}>
        {icon}
      </Box>
      
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        {title}
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {description}
      </Typography>
      
      <List dense>
        {details.map((detail, index) => (
          <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 24, mr: 1 }}>
              <CheckCircle sx={{ color: theme.palette.success.main, fontSize: 16 }} />
            </ListItemIcon>
            <ListItemText 
              primary={detail} 
              primaryTypographyProps={{ 
                variant: 'body2',
                sx={{ color: theme.palette.text.secondary }
              }}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};