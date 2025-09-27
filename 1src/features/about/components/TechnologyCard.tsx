// src/features/about/components/TechnologyCard.tsx
import React from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  alpha 
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import type { Feature } from '../types/about.types';

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
      sx={{
        p: 3,
        height: '100%',
        background: alpha(theme.palette.background.paper, 0.05),
        backdropFilter: 'blur(10px)',
        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box 
          sx={{ 
            mr: 2, 
            color: theme.palette.primary.main,
            fontSize: '2rem'
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" component="h3" fontWeight="bold">
          {title}
        </Typography>
      </Box>
      
      <Typography 
        variant="body2" 
        sx={{ 
          color: theme.palette.text.secondary,
          mb: 2,
          lineHeight: 1.6
        }}
      >
        {description}
      </Typography>
      
      {details && details.length > 0 && (
        <List dense>
          {details.map((detail, index) => (
            <ListItem key={index} disablePadding sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <CheckCircleIcon 
                  sx={{ 
                    color: theme.palette.success.main, 
                    fontSize: 18 
                  }} 
                />
              </ListItemIcon>
              <ListItemText 
                primary={detail} 
                primaryTypographyProps={{ 
                  variant: 'body2',
                  sx: { 
                    color: theme.palette.text.secondary 
                  }
                }}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};