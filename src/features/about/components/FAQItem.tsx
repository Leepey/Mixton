// features/about/components/FAQItem.tsx
import React from 'react';
import { Paper, Typography, Box, IconButton, alpha } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { FAQItem as FAQItemType } from '../types/about.types';
import { useFAQ } from '../hooks/useFAQ';

interface FAQItemProps extends FAQItemType {}

export const FAQItem: React.FC<FAQItemProps> = ({ id, question, answer }) => {
  const theme = useTheme();
  const { toggleItem, isExpanded } = useFAQ([]);

  return (
    <Paper 
      elevation={0}
      sx={{
        borderRadius: '12px',
        background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.grey[900], 0.6)})`,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        overflow: 'hidden',
        transition: 'all 0.3s ease'
      }}
    >
      <Box 
        sx={{ 
          p: 3, 
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          '&:hover': {
            background: alpha(theme.palette.primary.main, 0.05)
          }
        }}
        onClick={() => toggleItem(id)}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
          {question}
        </Typography>
        <IconButton>
          {isExpanded(id) ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>
      
      {isExpanded(id) && (
        <Box 
          sx={{ 
            p: 3,
            pt: 0,
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
            {answer}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};