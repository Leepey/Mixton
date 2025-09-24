// src/components/ui/cards/NeonCard.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import type { BoxProps } from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material';

interface NeonCardProps extends Omit<BoxProps, 'content'> {
  title?: string;
  icon?: React.ReactNode;
  body?: React.ReactNode;
  children?: React.ReactNode;
  glowColor?: string;
}

const NeonCard: React.FC<NeonCardProps> = ({ 
  title, 
  icon, 
  body, 
  children, 
  glowColor = '#00BCD4',
  sx = {},
  ...props 
}) => {
  const theme = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.3 }
      }}
    >
      <Box
        sx={{
          p: 3,
          borderRadius: '16px',
          background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.grey[900], 0.6)})`,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(glowColor, 0.3)}`,
          boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.2)}`,
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: alpha(glowColor, 0.8),
            boxShadow: `0 12px 40px ${alpha(glowColor, 0.4)}`,
            transform: 'translateY(-5px)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: '16px',
            padding: '1px',
            background: `linear-gradient(45deg, ${glowColor}33, transparent)`,
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            zIndex: -1,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: '16px',
            boxShadow: `0 0 20px ${glowColor}33`,
            zIndex: -2,
            opacity: 0,
            transition: 'opacity 0.3s ease',
          },
          '&:hover::after': {
            opacity: 1,
          },
          ...sx,
        }}
        {...props}
      >
        {title && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            {icon && (
              <Box 
                sx={{ 
                  mr: 1.5, 
                  color: glowColor,
                  filter: `drop-shadow(0 0 8px ${alpha(glowColor, 0.6)})`,
                  transition: 'all 0.3s ease'
                }}
              >
                {icon}
              </Box>
            )}
            <Typography 
              variant="h6" 
              component="h3" 
              sx={{ 
                fontWeight: 600,
                background: `linear-gradient(45deg, ${glowColor}, ${alpha(glowColor, 0.7)})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: `0 0 10px ${alpha(glowColor, 0.5)}`,
                transition: 'all 0.3s ease'
              }}
            >
              {title}
            </Typography>
          </Box>
        )}
        {body && (
          <Box sx={{ mt: 1, color: 'text.secondary' }}>
            {body}
          </Box>
        )}
        {children}
      </Box>
    </motion.div>
  );
};

export default NeonCard;