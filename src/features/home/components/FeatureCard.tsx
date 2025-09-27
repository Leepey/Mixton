// src/features/home/components/FeatureCard.tsx
import React from 'react';
import {
  Paper,
  Typography,
  Box,
  alpha,
  useTheme,
  CardActionArea,
  IconButton,
  Chip,
  Tooltip
} from '@mui/material';
import { motion } from 'framer-motion';
import { Info, Star, ArrowForward } from '@mui/icons-material';

interface FeatureCardProps {
  id?: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  details?: string[];
  category?: string;
  badge?: string;
  featured?: boolean;
  onClick?: () => void;
  delay?: number;
  variant?: 'default' | 'compact' | 'detailed';
  glowColor?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  className?: string;
  sx?: React.CSSProperties;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  id,
  title,
  description,
  icon,
  details,
  category,
  badge,
  featured,
  onClick,
  delay = 0,
  variant = 'default',
  glowColor,
  onMouseEnter,
  onMouseLeave,
  className,
  sx
}) => {
  const theme = useTheme();
  const defaultGlowColor = theme.palette.primary.main;
  const cardGlowColor = glowColor || defaultGlowColor;
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    onMouseEnter?.();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onMouseLeave?.();
  };

  // Генерируем уникальный id если он не предоставлен
  const cardId = id || `feature-${title.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`;

  const renderCompact = () => (
    <CardActionArea onClick={onClick} sx={{ p: 2 }}>
      <Box display="flex" alignItems="center" gap={2}>
        <Box
          sx={{
            fontSize: '2rem',
            color: theme.palette.primary.main,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Box>
      </Box>
    </CardActionArea>
  );

  const renderDefault = () => (
    <CardActionArea onClick={onClick} sx={{ p: 3 }}>
      <Box textAlign="center" mb={2}>
        <Box
          sx={{
            fontSize: '3rem',
            color: theme.palette.primary.main,
            mb: 2,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {icon}
        </Box>
        {featured && (
          <Chip
            icon={<Star />}
            label="Featured"
            size="small"
            color="secondary"
            sx={{ mb: 1 }}
          />
        )}
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {title}
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            minHeight: details && details.length > 0 ? '4.5em' : 'auto',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {description}
        </Typography>
      </Box>
      
      {details && details.length > 0 && (
        <Box mt={2}>
          {details.slice(0, 3).map((detail, index) => (
            <Typography 
              key={index} 
              variant="caption" 
              color="text.secondary"
              display="block"
              sx={{ mb: 0.5 }}
            >
              • {detail}
            </Typography>
          ))}
          {details.length > 3 && (
            <Typography variant="caption" color="primary">
              +{details.length - 3} more features
            </Typography>
          )}
        </Box>
      )}
    </CardActionArea>
  );

  const renderDetailed = () => (
    <Box sx={{ p: 3 }}>
      <Box textAlign="center" mb={3}>
        <Box
          sx={{
            fontSize: '4rem',
            color: theme.palette.primary.main,
            mb: 2,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {icon}
        </Box>
        {badge && (
          <Chip
            label={badge}
            size="small"
            sx={{ 
              mb: 2,
              background: alpha(theme.palette.secondary.main, 0.1),
              color: theme.palette.secondary.main,
              border: `1px solid ${alpha(theme.palette.secondary.main, 0.3)}`
            }}
          />
        )}
        {featured && (
          <Chip
            icon={<Star />}
            label="Featured"
            size="small"
            color="secondary"
            sx={{ mb: 2, ml: 1 }}
          />
        )}
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {title}
        </Typography>
        {category && (
          <Typography variant="subtitle2" color="primary" gutterBottom>
            {category}
          </Typography>
        )}
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ 
            mb: 3,
            lineHeight: 1.6
          }}
        >
          {description}
        </Typography>
      </Box>
      
      {details && details.length > 0 && (
        <Box mb={3}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Key Features:
          </Typography>
          {details.map((detail, index) => (
            <Box 
              key={index} 
              display="flex" 
              alignItems="center" 
              gap={1}
              mb={1}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: theme.palette.primary.main,
                  flexShrink: 0
                }}
              />
              <Typography variant="body2" color="text.secondary">
                {detail}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
      
      {onClick && (
        <Box textAlign="center">
          <Tooltip title="Learn more">
            <IconButton
              onClick={onClick}
              sx={{
                color: theme.palette.primary.main,
                '&:hover': {
                  background: alpha(theme.palette.primary.main, 0.1)
                }
              }}
            >
              <ArrowForward />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Box>
  );

  const renderContent = () => {
    switch (variant) {
      case 'compact':
        return renderCompact();
      case 'detailed':
        return renderDetailed();
      default:
        return renderDefault();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ height: '100%' }}
    >
      <Paper
        elevation={isHovered ? 8 : 2}
        sx={{
          height: '100%',
          borderRadius: 3,
          background: alpha(theme.palette.background.paper, 0.05),
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(cardGlowColor, 0.2)}`,
          transition: 'all 0.3s ease',
          overflow: 'hidden',
          position: 'relative',
          '&::before': featured ? {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          } : {},
          ...sx
        }}
        className={className}
      >
        {renderContent()}
      </Paper>
    </motion.div>
  );
};