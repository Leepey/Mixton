// features/about/components/StatCard.tsx
import React from 'react';
import { Paper, Typography, Box, alpha } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface StatCardProps {
  title: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  unit, 
  icon, 
  color, 
  description 
}) => {
  const theme = useTheme();

  return (
    <Paper 
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '16px',
        background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.grey[900], 0.6)})`,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${alpha(color, 0.2)}`,
        textAlign: 'center',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: `0 10px 30px ${alpha(color, 0.2)}`
        }
      }}
    >
      <Box sx={{ 
        display: 'inline-flex',
        p: 2,
        borderRadius: '12px',
        bgcolor: alpha(color, 0.1),
        color: color,
        mb: 2
      }}>
        {icon}
      </Box>
      
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        {value.toLocaleString()}{unit}
      </Typography>
      
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: color }}>
        {title}
      </Typography>
      
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Paper>
  );
};