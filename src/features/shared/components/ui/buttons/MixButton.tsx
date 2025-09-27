// src/features/shared/components/ui/buttons/MixButton.tsx
import React from 'react';
import { 
  Button, 
  type ButtonProps, 
  CircularProgress, 
  Box,
  useTheme
} from '@mui/material';
import { alpha } from '@mui/material';

export interface MixButtonProps extends ButtonProps {
  loading?: boolean;
  progress?: number;
  showProgress?: boolean;
  variant?: 'contained' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onClick?: () => void;
  type?: 'submit' | 'button';
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
}

export const MixButton: React.FC<MixButtonProps> = ({
  loading = false,
  progress,
  showProgress = false,
  variant = 'contained',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  children,
  startIcon,
  endIcon,
  onClick,
  type = 'button',
  color = 'primary',
  ...props
}) => {
  const theme = useTheme();

  // Определяем цвета в зависимости от состояния
  const getButtonColors = () => {
    if (disabled) {
      return {
        backgroundColor: alpha(theme.palette.action.disabled, 0.1),
        color: theme.palette.action.disabled,
        borderColor: theme.palette.action.disabled,
        '&:hover': {
          backgroundColor: alpha(theme.palette.action.disabled, 0.1),
        }
      };
    }

    if (loading) {
      return {
        backgroundColor: alpha(theme.palette[color].main, 0.8),
        color: theme.palette[color].contrastText,
        borderColor: theme.palette[color].main,
        '&:hover': {
          backgroundColor: alpha(theme.palette[color].main, 0.8),
        }
      };
    }

    switch (variant) {
      case 'contained':
        return {
          background: `linear-gradient(45deg, ${theme.palette[color].main}, ${theme.palette[color].dark})`,
          color: theme.palette[color].contrastText,
          '&:hover': {
            background: `linear-gradient(45deg, ${theme.palette[color].dark}, ${theme.palette[color].main})`,
            transform: 'translateY(-1px)',
            boxShadow: `0 4px 12px ${alpha(theme.palette[color].main, 0.3)}`,
          },
          '&:active': {
            transform: 'translateY(0)',
            boxShadow: `0 2px 8px ${alpha(theme.palette[color].main, 0.2)}`,
          }
        };
      
      case 'outlined':
        return {
          borderColor: theme.palette[color].main,
          color: theme.palette[color].main,
          backgroundColor: 'transparent',
          '&:hover': {
            backgroundColor: alpha(theme.palette[color].main, 0.1),
            borderColor: theme.palette[color].dark,
          }
        };
      
      case 'text':
        return {
          color: theme.palette[color].main,
          backgroundColor: 'transparent',
          '&:hover': {
            backgroundColor: alpha(theme.palette[color].main, 0.1),
          }
        };
      
      default:
        return {};
    }
  };

  const buttonStyles = {
    borderRadius: '8px',
    fontWeight: 600,
    textTransform: 'none' as const,
    position: 'relative' as const,
    overflow: 'hidden',
    transition: 'all 0.2s ease-in-out',
    minWidth: fullWidth ? '100%' : '120px',
    height: size === 'small' ? '32px' : size === 'large' ? '48px' : '40px',
    fontSize: size === 'small' ? '0.875rem' : size === 'large' ? '1.125rem' : '1rem',
    padding: size === 'small' ? '6px 16px' : size === 'large' ? '12px 24px' : '8px 20px',
    ...getButtonColors(),
    ...props.sx
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: 1
        }}>
          <CircularProgress 
            size={size === 'small' ? 16 : size === 'large' ? 24 : 20}
            thickness={2}
            sx={{ color: 'inherit' }}
          />
          <span>{children || 'Processing...'}</span>
        </Box>
      );
    }

    return (
      <>
        {startIcon && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            mr: children ? 1 : 0
          }}>
            {startIcon}
          </Box>
        )}
        
        <span>{children}</span>
        
        {endIcon && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            ml: children ? 1 : 0
          }}>
            {endIcon}
          </Box>
        )}
      </>
    );
  };

  return (
    <Button
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
      color={color}
      startIcon={loading ? undefined : startIcon}
      endIcon={loading ? undefined : endIcon}
      sx={buttonStyles}
      {...props}
    >
      {renderContent()}
      
      {/* Прогресс-бар для кнопки */}
      {showProgress && progress !== undefined && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: '2px',
            backgroundColor: alpha(theme.palette.background.paper, 0.3),
            width: '100%',
            overflow: 'hidden'
          }}
        >
          <Box
            sx={{
              height: '100%',
              backgroundColor: theme.palette[color].main,
              width: `${progress}%`,
              transition: 'width 0.3s ease'
            }}
          />
        </Box>
      )}
    </Button>
  );
};

// Предустановленные стили для разных сценариев
export const MixButtonPresets = {
  primary: {
    variant: 'contained' as const,
    color: 'primary' as const,
    size: 'medium' as const
  },
  secondary: {
    variant: 'outlined' as const,
    color: 'secondary' as const,
    size: 'medium' as const
  },
  success: {
    variant: 'contained' as const,
    color: 'success' as const,
    size: 'medium' as const
  },
  large: {
    variant: 'contained' as const,
    color: 'primary' as const,
    size: 'large' as const
  },
  small: {
    variant: 'outlined' as const,
    color: 'primary' as const,
    size: 'small' as const
  }
};

export default MixButton;