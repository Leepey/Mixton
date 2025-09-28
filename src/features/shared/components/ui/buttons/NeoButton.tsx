// src/features/shared/components/ui/buttons/NeoButton.tsx
import React from 'react';
import { Button, type ButtonProps, CircularProgress, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material';

export interface NeoButtonProps extends ButtonProps {
  loading?: boolean;
  neonColor?: string;
  glowIntensity?: 'low' | 'medium' | 'high';
  pulseEffect?: boolean;
  variant?: 'contained' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
}

export const NeoButton: React.FC<NeoButtonProps> = ({
  children,
  loading = false,
  neonColor = '#00BCD4',
  glowIntensity = 'medium',
  pulseEffect = false,
  variant = 'contained',
  size = 'medium',
  disabled = false,
  ...props
}) => {
  const theme = useTheme();

  // Определение размеров
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          py: 0.6,
          px: 2,
          fontSize: '0.875rem',
          borderRadius: '8px',
        };
      case 'large':
        return {
          py: 1.5,
          px: 4,
          fontSize: '1.125rem',
          borderRadius: '16px',
        };
      default: // medium
        return {
          py: 1,
          px: 3,
          fontSize: '1rem',
          borderRadius: '12px',
        };
    }
  };

  // Определение интенсивности свечения
  const getGlowOpacity = () => {
    switch (glowIntensity) {
      case 'low':
        return 0.1;
      case 'high':
        return 0.3;
      default: // medium
        return 0.2;
    }
  };

  // Базовые стили для кнопки
  const getBaseStyles = () => {
    const sizeStyles = getSizeStyles();
    const glowOpacity = getGlowOpacity();

    return {
      ...sizeStyles,
      fontWeight: 600,
      textTransform: 'none' as const,
      position: 'relative' as const,
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      border: 'none',
      '&:disabled': {
        opacity: 0.6,
        cursor: 'not-allowed',
      },
    };
  };

  // Стили для разных вариантов
  const getVariantStyles = () => {
    const baseStyles = getBaseStyles();
    const glowOpacity = getGlowOpacity();

    switch (variant) {
      case 'contained':
        return {
          ...baseStyles,
          background: `linear-gradient(45deg, ${neonColor}, ${alpha(neonColor, 0.7)})`,
          color: 'white',
          '&:hover:not(:disabled)': {
            background: `linear-gradient(45deg, ${neonColor}, ${alpha(neonColor, 0.8)})`,
            transform: 'translateY(-2px)',
            boxShadow: `0 8px 25px ${alpha(neonColor, glowOpacity)}`,
          },
          '&:active:not(:disabled)': {
            transform: 'translateY(0)',
          },
        };
      
      case 'outlined':
        return {
          ...baseStyles,
          background: 'transparent',
          color: neonColor,
          border: `2px solid ${neonColor}`,
          '&:hover:not(:disabled)': {
            background: alpha(neonColor, 0.1),
            borderColor: neonColor,
            transform: 'translateY(-2px)',
            boxShadow: `0 8px 25px ${alpha(neonColor, glowOpacity * 0.5)}`,
          },
        };
      
      case 'text':
        return {
          ...baseStyles,
          background: 'transparent',
          color: neonColor,
          border: 'none',
          '&:hover:not(:disabled)': {
            background: alpha(neonColor, 0.1),
            transform: 'translateY(-2px)',
          },
        };
      
      default:
        return baseStyles;
    }
  };

  // Стили для свечения
  const getGlowStyles = () => {
    const glowOpacity = getGlowOpacity();
    
    return {
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: getSizeStyles().borderRadius || '12px',
        background: `radial-gradient(circle at center, ${alpha(neonColor, glowOpacity)} 0%, transparent 70%)`,
        animation: pulseEffect ? 'neon-pulse 2s ease-in-out infinite' : 'none',
        zIndex: -1,
      },
      '@keyframes neon-pulse': {
        '0%, 100%': { opacity: glowOpacity },
        '50%': { opacity: glowOpacity * 1.5 },
      },
    };
  };

  // Стили для пульсации
  const getPulseStyles = () => {
    if (!pulseEffect) return {};
    
    return {
      animation: 'neon-pulse-scale 2s ease-in-out infinite',
      '@keyframes neon-pulse-scale': {
        '0%, 100%': { transform: 'scale(1)' },
        '50%': { transform: 'scale(1.05)' },
      },
    };
  };

  // Объединенные стили
  const buttonStyles = {
    ...getVariantStyles(),
    ...getGlowStyles(),
    ...getPulseStyles(),
    ...props.sx
  };

  // Создаем MotionButton с правильными типами
  const MotionButton = motion(Button);

  return (
    <MotionButton
      variant={variant}
      size={size}
      disabled={disabled || loading}
      sx={buttonStyles}
      // Передаем свойства motion отдельно
      whileHover={!disabled && !loading ? { scale: 1.02 } : undefined}
      whileTap={!disabled && !loading ? { scale: 0.98 } : undefined}
    >
      {/* Содержимое кнопки */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: 1,
        position: 'relative',
        zIndex: 1
      }}>
        {loading ? (
          <CircularProgress 
            size={size === 'small' ? 16 : size === 'large' ? 24 : 20} 
            thickness={3} 
            sx={{ color: 'inherit' }} 
          />
        ) : (
          children
        )}
      </Box>

      {/* Декоративный неоновый эффект */}
      {!loading && !disabled && (
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: getSizeStyles().borderRadius || '12px',
            background: `linear-gradient(45deg, ${alpha(neonColor, 0.1)}, transparent)`,
            zIndex: 0,
          }}
          animate={{
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </MotionButton>
  );
};

// Экспорт по умолчанию для совместимости
export default NeoButton;