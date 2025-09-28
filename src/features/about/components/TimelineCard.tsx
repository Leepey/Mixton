// src/features/about/components/TimelineCard.tsx
import React from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  alpha 
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import type { TimelineEvent } from '../types/about.types';

interface TimelineCardProps extends TimelineEvent {}

export const TimelineCard: React.FC<TimelineCardProps> = ({ 
  date, 
  title, 
  description, 
  icon 
}) => {
  const theme = useTheme();

  return (
    <Paper
      component={motion.div}
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        p: 3,
        borderRadius: 2,
        position: 'relative',
        background: alpha(theme.palette.background.paper, 0.05),
        backdropFilter: 'blur(10px)',
        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
        '&::before': {
          content: '""',
          position: 'absolute',
          left: -20,
          top: '50%',
          transform: 'translateY(-50%)',
          width: '40px',
          height: '2px',
          background: alpha(theme.palette.primary.main, 0.5)
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
        {/* Icon */}
        <Box
          sx={{
            fontSize: '2rem',
            minWidth: '60px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            background: alpha(theme.palette.primary.main, 0.1),
            border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`
          }}
        >
          {icon}
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1 }}>
          {/* Date */}
          <Typography 
            variant="caption" 
            component="div"
            sx={{ 
              color: theme.palette.primary.main,
              fontWeight: 'bold',
              mb: 1,
              textTransform: 'uppercase',
              letterSpacing: 1
            }}
          >
            {date}
          </Typography>

          {/* Title */}
          <Typography 
            variant="h6" 
            component="h3"
            gutterBottom
            fontWeight="bold"
            sx={{
              background: 'linear-gradient(45deg, #8BC34A, #2196F3)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            {title}
          </Typography>

          {/* Description */}
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              lineHeight: 1.6
            }}
          >
            {description}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};