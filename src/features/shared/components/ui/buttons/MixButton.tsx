import React from 'react';
import { Button } from '@mui/material';
import type { ButtonProps } from '@mui/material';
import { Shuffle as ShuffleIcon } from '@mui/icons-material';

const MixButton: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <Button
      variant="contained"
      color="secondary"
      startIcon={<ShuffleIcon />}
      sx={{
        borderRadius: 2,
        px: 3,
        py: 1,
        fontWeight: 600,
        background: 'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)',
        '&:hover': {
          background: 'linear-gradient(45deg, #f5576c 0%, #f093fb 100%)',
        }
      }}
      {...props}
    >
      {children || 'Mix'}
    </Button>
  );
};

export default MixButton;