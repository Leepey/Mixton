// src/features/home/components/FeatureCard.tsx

import React from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  alpha, 
  useTheme,
  CardActionArea,
  Grow
} from '@mui/material';
import { motion } from 'framer-motion';

// Полностью определяем интерфейс без наследования
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
  style?: React.CSSProperties;
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
  style
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
    <Paper 
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '12px',
        height: '100%',
        background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.grey[900], 0.6)})`,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${alpha(cardGlowColor, 0.1)}`,
        transition: 'transform 0.3s, box-shadow 0.3s',
        cursor: onClick ? 'pointer' : 'default',
        transform: isHovered ? 'translateY(-4px)' : 'none',
        boxShadow: isHovered && onClick ? `0 8px 25px ${alpha(cardGlowColor, 0.2)}` : 'none',
        borderColor: isHovered && onClick ? alpha(cardGlowColor, 0.3) : alpha(cardGlowColor, 0.1)
      }}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={style}
      data-feature-id={cardId}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
        <Box sx={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 48,
          height: 48,
          borderRadius: '12px',
          background: alpha(cardGlowColor, 0.1),
          color: cardGlowColor,
          fontSize: '1.5rem',
          flexShrink: 0,
          transition: 'all 0.3s ease',
          transform: isHovered ? 'scale(1.1)' : 'none'
        }}>
          {icon}
        </Box>
        
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h6" sx={{ 
            fontWeight: 600, 
            mb: 1,
            color: cardGlowColor,
            fontSize: '1rem',
            transition: 'color 0.3s ease'
          }}>
            {title}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ 
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {description}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );

  const renderDefault = () => (
    <Paper 
      elevation={0}
      sx={{
        p: 4,
        borderRadius: '16px',
        height: '100%',
        background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.grey[900], 0.6)})`,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${alpha(cardGlowColor, 0.1)}`,
        transition: 'transform 0.3s, box-shadow 0.3s',
        cursor: onClick ? 'pointer' : 'default',
        transform: isHovered ? 'translateY(-6px)' : 'none',
        boxShadow: isHovered && onClick ? `0 12px 35px ${alpha(cardGlowColor, 0.25)}` : 'none',
        borderColor: isHovered && onClick ? alpha(cardGlowColor, 0.3) : alpha(cardGlowColor, 0.1)
      }}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={style}
      data-feature-id={cardId}
    >
      <Box sx={{ 
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        borderRadius: '16px',
        bgcolor: alpha(cardGlowColor, 0.1),
        color: cardGlowColor,
        mb: 3,
        fontSize: '2.5rem',
        width: 80,
        height: 80,
        transition: 'all 0.3s ease',
        transform: isHovered ? 'scale(1.1)' : 'none'
      }}>
        {icon}
      </Box>
      
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: cardGlowColor }}>
        {title}
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ 
        lineHeight: 1.6,
        mb: details && details.length > 0 ? 3 : 0
      }}>
        {description}
      </Typography>
      
      {details && details.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {details.slice(0, 3).map((detail, index) => (
            <Box 
              key={index} 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5,
                p: 1,
                borderRadius: '6px',
                bgcolor: alpha(cardGlowColor, 0.05),
                transition: 'background-color 0.2s',
                '&:hover': {
                  bgcolor: alpha(cardGlowColor, 0.08)
                }
              }}
            >
              <Box 
                sx={{ 
                  width: 6, 
                  height: 6, 
                  borderRadius: '50%',
                  bgcolor: cardGlowColor,
                  flexShrink: 0 
                }} 
              />
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                {detail}
              </Typography>
            </Box>
          ))}
          {details.length > 3 && (
            <Typography variant="body2" sx={{ 
              color: alpha(cardGlowColor, 0.7),
              fontSize: '0.75rem',
              mt: 1,
              fontStyle: 'italic'
            }}>
              +{details.length - 3} more features
            </Typography>
          )}
        </Box>
      )}
    </Paper>
  );

  const renderDetailed = () => (
    <Paper 
      elevation={0}
      sx={{
        p: 5,
        borderRadius: '20px',
        height: '100%',
        background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.grey[900], 0.6)})`,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${alpha(cardGlowColor, 0.1)}`,
        transition: 'transform 0.3s, box-shadow 0.3s',
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden',
        transform: isHovered ? 'translateY(-8px)' : 'none',
        boxShadow: isHovered && onClick ? `0 20px 40px ${alpha(cardGlowColor, 0.3)}` : 'none',
        borderColor: isHovered && onClick ? alpha(cardGlowColor, 0.3) : alpha(cardGlowColor, 0.1),
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${cardGlowColor}, ${alpha(cardGlowColor, 0.6)})`,
          opacity: isHovered ? 1 : 0.8,
          transition: 'opacity 0.3s ease'
        }
      }}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={style}
      data-feature-id={cardId}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', mb: 4 }}>
        <Box sx={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
          borderRadius: '20px',
          background: `linear-gradient(135deg, ${alpha(cardGlowColor, 0.15)}, ${alpha(cardGlowColor, 0.05)})`,
          color: cardGlowColor,
          mb: 3,
          fontSize: '3rem',
          width: 100,
          height: 100,
          boxShadow: `0 8px 25px ${alpha(cardGlowColor, 0.2)}`,
          transition: 'all 0.3s ease',
          transform: isHovered ? 'scale(1.1)' : 'none'
        }}>
          {icon}
        </Box>
        
        <Typography variant="h4" sx={{ 
          fontWeight: 800, 
          mb: 2, 
          background: `linear-gradient(45deg, ${cardGlowColor}, ${alpha(cardGlowColor, 0.7)})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          transition: 'all 0.3s ease'
        }}>
          {title}
        </Typography>
      </Box>
      
      <Typography variant="body1" color="text.secondary" sx={{ 
        lineHeight: 1.7,
        mb: details && details.length > 0 ? 4 : 0,
        textAlign: 'center',
        fontSize: '1.1rem'
      }}>
        {description}
      </Typography>
      
      {details && details.length > 0 && (
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 2,
          mt: 3
        }}>
          {details.map((detail, index) => (
            <Box 
              key={index} 
              sx={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: 2,
                p: 2.5,
                borderRadius: '12px',
                bgcolor: alpha(cardGlowColor, 0.05),
                border: `1px solid ${alpha(cardGlowColor, 0.1)}`,
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: alpha(cardGlowColor, 0.08),
                  transform: 'translateY(-2px)',
                  boxShadow: `0 4px 15px ${alpha(cardGlowColor, 0.15)}`
                }
              }}
            >
              <Box 
                sx={{ 
                  width: 8, 
                  height: 8, 
                  borderRadius: '50%',
                  bgcolor: cardGlowColor,
                  flexShrink: 0,
                  mt: '6px'
                }} 
              />
              <Typography variant="body2" color="text.secondary" sx={{ 
                lineHeight: 1.5,
                fontSize: '0.9rem'
              }}>
                {detail}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
      
      {onClick && (
        <Box sx={{ 
          mt: 4, 
          textAlign: 'center',
          pt: 3,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`
        }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: cardGlowColor,
              fontWeight: 600,
              fontSize: '0.875rem',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              transition: 'all 0.3s ease',
              opacity: isHovered ? 1 : 0.8
            }}
          >
            Learn More →
          </Typography>
        </Box>
      )}
    </Paper>
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
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: onClick ? 1.02 : 1 }}
      style={{ height: '100%' }}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-feature-id={cardId}
    >
      {renderContent()}
    </motion.div>
  );
};