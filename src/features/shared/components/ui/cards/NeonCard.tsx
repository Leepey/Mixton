// features/shared/components/ui/cards/NeonCard.tsx
import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material';
import { StatusChip } from '../StatusChip';
import type { AppStatus } from '../../../types/status.types';

export interface NeonCardProps {
  title: string;
  icon?: React.ReactNode;
  glowColor?: string;
  value?: string | number;
  description?: string;
  statusChip?: {
    label: string;
    color: AppStatus;
    icon?: React.ReactNode;
  };
  children?: React.ReactNode;
  onClick?: () => void;
  sx?: React.ComponentProps<typeof Paper>['sx'];
  className?: string;
}

/**
 * Неоновая карточка с подсветкой и анимациями
 */
export const NeonCard: React.FC<NeonCardProps> = ({ 
  title, 
  icon, 
  glowColor = '#00BCD4', 
  value, 
  description, 
  statusChip,
  children,
  onClick,
  sx = {},
  className = ''
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
        border: `1px solid ${alpha(glowColor, 0.2)}`,
        transition: 'transform 0.3s, box-shadow 0.3s',
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 20% 50%, ${alpha(glowColor, 0.1)} 0%, transparent 50%)`,
          pointerEvents: 'none',
          zIndex: 1
        },
        '&:hover': onClick ? {
          transform: 'translateY(-5px)',
          boxShadow: `0 10px 30px ${alpha(glowColor, 0.2)}`,
          '&::before': {
            background: `radial-gradient(circle at 20% 50%, ${alpha(glowColor, 0.15)} 0%, transparent 50%)`
          }
        } : {},
        ...sx
      }}
      onClick={onClick}
      className={className}
    >
      {/* Неоновый эффект */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: `linear-gradient(90deg, ${glowColor}, ${alpha(glowColor, 0.3)}, transparent)`,
        zIndex: 2
      }} />
      
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'flex-start', 
        gap: 2, 
        mb: 2,
        position: 'relative',
        zIndex: 3
      }}>
        {icon && (
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 1.5,
            borderRadius: '12px',
            background: alpha(glowColor, 0.1),
            color: glowColor,
            flexShrink: 0,
            boxShadow: `0 0 20px ${alpha(glowColor, 0.2)}`,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.1)',
              boxShadow: `0 0 30px ${alpha(glowColor, 0.3)}`
            }
          }}>
            {icon}
          </Box>
        )}
        
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600, 
              mb: 0.5,
              color: theme.palette.text.primary
            }}
          >
            {title}
          </Typography>
          
          {value !== undefined && (
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700, 
                mb: 1,
                background: `linear-gradient(45deg, ${glowColor}, ${alpha(glowColor, 0.7)})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {value}
            </Typography>
          )}
          
          {description && (
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                mb: 1,
                lineHeight: 1.4
              }}
            >
              {description}
            </Typography>
          )}
          
          {statusChip && (
            <Box sx={{ mt: 1 }}>
              <StatusChip 
                status={statusChip.color}
                label={statusChip.label}
                icon={statusChip.icon}
                size="small"
              />
            </Box>
          )}
        </Box>
      </Box>
      
      {children && (
        <Box sx={{ 
          mt: 2,
          pt: 2,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          position: 'relative',
          zIndex: 3
        }}>
          {children}
        </Box>
      )}
      
      {/* Декоративные углы */}
      <Box sx={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        width: '20px',
        height: '20px',
        borderTop: `2px solid ${alpha(glowColor, 0.5)}`,
        borderRight: `2px solid ${alpha(glowColor, 0.5)}`,
        borderRadius: '0 0 4px 0',
        zIndex: 2
      }} />
      
      <Box sx={{
        position: 'absolute',
        bottom: '8px',
        left: '8px',
        width: '20px',
        height: '20px',
        borderBottom: `2px solid ${alpha(glowColor, 0.5)}`,
        borderLeft: `2px solid ${alpha(glowColor, 0.5)}`,
        borderRadius: '0 4px 0 0',
        zIndex: 2
      }} />
    </Paper>
  );
};