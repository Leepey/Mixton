/*src/components/ui/loaders/TransactionLoader.tsx*/
import React from 'react';
import { 
  Backdrop, 
  CircularProgress, 
  Typography
} from '@mui/material';

interface TransactionLoaderProps {
  open: boolean;
  message?: string;
}

const TransactionLoader: React.FC<TransactionLoaderProps> = ({ 
  open, 
  message = "Processing transaction..." 
}) => {
  return (
    <Backdrop
      sx={{ 
        color: '#fff', 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        flexDirection: 'column',
        gap: 2
      }}
      open={open}
    >
      <CircularProgress color="primary" size={60} thickness={4} />
      <Typography variant="h6">{message}</Typography>
      <Typography variant="body2" color="text.secondary">
        Please wait and don't close this window
      </Typography>
    </Backdrop>
  );
};

export default TransactionLoader;