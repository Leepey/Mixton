// features/shared/components/ui/typography/NeonText.tsx
import React from 'react';
import { Typography, type TypographyProps, useTheme } from '@mui/material';
import { alpha } from '@mui/material';
import { motion } from 'framer-motion';

export interface NeonTextProps extends Omit<TypographyProps, 'component'> {
  glowColor?: string;
  glowIntensity?: number;
  pulse?: boolean;
  gradientDirection?: 'left' | 'right' | 'top' | 'bottom' | 'diagonal';
  secondaryColor?: string;
  textSize?: string | number;
}

export const NeonText: React.FC<NeonTextProps> = ({
  glowColor = '#00BCD4',
  glowIntensity = 0.8,
  pulse = false,
  gradientDirection = 'diagonal',
  secondaryColor,
  textSize,
  children,
  sx = {},
  ...props
}) => {
  const theme = useTheme();
  
  const getGradient = () => {
    const colors = secondaryColor 
      ? `${glowColor}, ${secondaryColor}`
      : glowColor;
    
    switch (gradientDirection) {
      case 'left':
        return `linear-gradient(90deg, ${colors})`;
      case 'right':
        return `linear-gradient(270deg, ${colors})`;
      case 'top':
        return `linear-gradient(180deg, ${colors})`;
      case 'bottom':
        return `linear-gradient(0deg, ${colors})`;
      case 'diagonal':
      default:
        return `linear-gradient(45deg, ${colors})`;
    }
  };

  const neonStyles = {
    background: getGradient(),
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: `0 0 10px ${alpha(glowColor, glowIntensity)}, 
                 0 0 20px ${alpha(glowColor, glowIntensity * 0.5)},
                 0 0 30px ${alpha(glowColor, glowIntensity * 0.3)}`,
    filter: `drop-shadow(0 0 3px ${alpha(glowColor, glowIntensity)})`,
  };

  const pulseAnimation = pulse ? {
    animation: 'pulse 2s ease-in-out infinite',
    '@keyframes pulse': {
      '0%, 100%': { 
        opacity: 1,
        textShadow: `0 0 10px ${alpha(glowColor, glowIntensity)}, 
                     0 0 20px ${alpha(glowColor, glowIntensity * 0.5)},
                     0 0 30px ${alpha(glowColor, glowIntensity * 0.3)}`
      },
      '50%': { 
        opacity: 0.8,
        textShadow: `0 0 15px ${alpha(glowColor, glowIntensity * 1.2)}, 
                     0 0 30px ${alpha(glowColor, glowIntensity * 0.8)},
                     0 0 45px ${alpha(glowColor, glowIntensity * 0.5)}`
      }
    }
  } : {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={pulseAnimation}
    >
      <Typography
        {...props}
        sx={{
          ...neonStyles,
          ...(textSize ? { fontSize: textSize } : {}),
          fontWeight: 700,
          ...sx
        }}
      >
        {children}
      </Typography>
    </motion.div>
  );
};