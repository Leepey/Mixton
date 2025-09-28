// features/home/components/QuickMixSection.tsx
import React from 'react';
import { Box, Typography, Fab } from '@mui/material';
import { motion } from 'framer-motion';
import { Zoom } from '@mui/material';
import { Shuffle } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material';

interface QuickMixSectionProps {
  userConnected: boolean;
  onMixClick: () => void;
}

export const QuickMixSection: React.FC<QuickMixSectionProps> = ({ userConnected, onMixClick }) => {
  const theme = useTheme();

  return (
    <>
      {userConnected && (
        <Zoom in={true}>
          <Fab
            color="secondary"
            aria-label="mix"
            sx={{
              position: 'fixed',
              bottom: 30,
              right: 30,
              width: 60,
              height: 60,
              background: 'linear-gradient(45deg, #8BC34A, #2196F3)',
              boxShadow: `0 4px 20px ${alpha('#8BC34A', 0.5)}`,
              zIndex: 1000,
              '&:hover': {
                background: 'linear-gradient(45deg, #7CB342, #1976D2)',
              }
            }}
            onClick={onMixClick}
          >
            <Shuffle fontSize="large" />
          </Fab>
        </Zoom>
      )}
    </>
  );
};