// src/features/about/components/TeamMemberCard.tsx
import React from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  IconButton, 
  Avatar, 
  alpha,
  Chip,
  Badge
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { 
  GitHub as GitHubIcon, 
  Twitter as TwitterIcon, 
  LinkedIn as LinkedInIcon 
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import type { TeamMember } from '../types/about.types';

interface TeamMemberCardProps extends TeamMember {}

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ 
  name, 
  role, 
  bio, 
  avatar, 
  socialLinks,
  joinDate,
  skills,
  isActive
}) => {
  const theme = useTheme();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  return (
    <Paper
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        p: 4,
        borderRadius: 3,
        textAlign: 'center',
        height: '100%',
        background: alpha(theme.palette.background.paper, 0.05),
        backdropFilter: 'blur(10px)',
        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          borderColor: alpha(theme.palette.primary.main, 0.4)
        }
      }}
    >
      {/* Avatar с индикатором активности */}
      <Box sx={{ mb: 3, position: 'relative', display: 'inline-block' }}>
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                backgroundColor: isActive ? theme.palette.success.main : theme.palette.error.main,
                border: '2px solid white'
              }}
            />
          }
        >
          <Avatar
            src={avatar}
            alt={name}
            sx={{
              width: 120,
              height: 120,
              border: `3px solid ${alpha(theme.palette.primary.main, 0.3)}`,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                borderColor: theme.palette.primary.main
              }
            }}
          />
        </Badge>
      </Box>

      {/* Name */}
      <Typography 
        variant="h5" 
        component="h3" 
        gutterBottom 
        fontWeight="bold"
        sx={{
          background: 'linear-gradient(45deg, #8BC34A, #2196F3)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 1
        }}
      >
        {name}
      </Typography>

      {/* Role и статус */}
      <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Chip
          label={role}
          color="primary"
          size="small"
          sx={{
            fontWeight: 500,
            px: 2,
            py: 0.5,
            background: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`
          }}
        />
        {joinDate && (
          <Typography variant="caption" color="text.secondary">
            Joined {formatDate(joinDate)}
          </Typography>
        )}
      </Box>

      {/* Skills */}
      {skills && skills.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
            {skills.slice(0, 4).map((skill, index) => (
              <Chip
                key={index}
                label={skill}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: '0.75rem',
                  height: '24px'
                }}
              />
            ))}
            {skills.length > 4 && (
              <Chip
                label={`+${skills.length - 4} more`}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: '0.75rem',
                  height: '24px'
                }}
              />
            )}
          </Box>
        </Box>
      )}

      {/* Bio */}
      <Typography 
        variant="body2" 
        color="text.secondary" 
        sx={{ 
          mb: 3,
          lineHeight: 1.6,
          minHeight: '60px'
        }}
      >
        {bio}
      </Typography>

      {/* Social Links */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        {socialLinks?.github && (
          <IconButton
            href={socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: theme.palette.text.secondary,
              background: alpha(theme.palette.background.paper, 0.5),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                color: '#333',
                background: alpha(theme.palette.background.paper, 0.8),
                transform: 'translateY(-2px)',
                borderColor: '#333'
              }
            }}
          >
            <GitHubIcon />
          </IconButton>
        )}

        {socialLinks?.twitter && (
          <IconButton
            href={socialLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: theme.palette.text.secondary,
              background: alpha(theme.palette.background.paper, 0.5),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                color: '#1DA1F2',
                background: alpha(theme.palette.background.paper, 0.8),
                transform: 'translateY(-2px)',
                borderColor: '#1DA1F2'
              }
            }}
          >
            <TwitterIcon />
          </IconButton>
        )}

        {socialLinks?.linkedin && (
          <IconButton
            href={socialLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: theme.palette.text.secondary,
              background: alpha(theme.palette.background.paper, 0.5),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                color: '#0077B5',
                background: alpha(theme.palette.background.paper, 0.8),
                transform: 'translateY(-2px)',
                borderColor: '#0077B5'
              }
            }}
          >
            <LinkedInIcon />
          </IconButton>
        )}
      </Box>
    </Paper>
  );
};