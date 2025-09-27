// src/features/about/components/FAQAccordionItem.tsx
import React from 'react';
import {Paper, Typography, Box, IconButton, alpha} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import {ExpandMore, ExpandLess} from '@mui/icons-material';
import type {FAQItem as FAQItemType} from '../types/about.types';

interface FAQAccordionItemProps {
  id: string;
  question: string;
  answer: string;
  expanded: boolean;
  onToggle: () => void;
  category?: FAQItemType['category']; // Сделаем необязательными
  tags?: FAQItemType['tags'];
  isPopular?: FAQItemType['isPopular'];
  lastUpdated?: FAQItemType['lastUpdated'];
}

export const FAQAccordionItem: React.FC<FAQAccordionItemProps> = 
  ({ id, question, answer, expanded, onToggle }) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 2,
        borderRadius: '16px',
        background: alpha(theme.palette.background.paper, 0.8),
        backdropFilter: 'blur(10px)',
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          transform: 'translateY(-2px)',
          boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`
        }
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        onClick={onToggle}
        sx={{ cursor: 'pointer' }}
      >
        <Typography variant="h6" fontWeight={600}>
          {question}
        </Typography>
        <IconButton>
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>
      
      {expanded && (
        <Box mt={2}>
          <Typography variant="body1" color="text.secondary">
            {answer}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};