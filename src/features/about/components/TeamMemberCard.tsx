// features/about/components/TeamMemberCard.tsx
import React from 'react';
import { Paper, Typography, Box, IconButton, alpha } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { GitHub, Twitter, LinkedIn } from '@mui/icons-material';
import { TeamMember } from '../types/about.types';

interface TeamMemberCardProps extends TeamMember {}

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ 
  name, 
  role, 
  bio, 
  avatar, 
  socialLinks 
}) => {
  const theme = useTheme();

  return (
    <Paper 
      elevation={0}
      sx={{
        p: 4,
        borderRadius: '16px',
        height: '100%',
        background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.grey[900], 0.6)})`,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: `0 10px 30px ${alpha(theme.palette.primary.main, 0.1)}`
        },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }}
    >
      <Avatar
        src={avatar}
        alt={name}
        sx={{ 
          width: 100, 
          height: 100, 
          mb: 3,
          border: `3px solid ${alpha(theme.palette.primary.main, 0.2)}`
        }}
      />
      
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
        {name}
      </Typography>
      
      <Typography variant="body1" sx={{ fontWeight: 600, mb: 2, color: theme.palette.primary.main }}>
        {role}
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flexGrow: 1 }}>
        {bio}
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 1 }}>
        {socialLinks.github && (
          <IconButton 
            href={socialLinks.github} 
            target="_blank"
            sx={{ 
              color: theme.palette.text.secondary,
              '&:hover': { color: '#333' }
            }}
          >
            <GitHub />
          </IconButton>
        )}
        {socialLinks.twitter && (
          <IconButton 
            href={socialLinks.twitter} 
            target="_blank"
            sx={{ 
              color: theme.palette.text.secondary,
              '&:hover': { color: '#1DA1F2' }
            }}
          >
            <Twitter />
          </IconButton>
        )}
        {socialLinks.linkedin && (
          <IconButton 
            href={socialLinks.linkedin} 
            target="_blank"
            sx={{ 
              color: theme.palette.text.secondary,
              '&:hover': { color: '#0077B5' }
            }}
          >
            <LinkedIn />
          </IconButton>
        )}
      </Box>
    </Paper>
  );
};