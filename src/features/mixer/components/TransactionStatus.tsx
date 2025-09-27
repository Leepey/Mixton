// src/components/TransactionStatus.tsx
import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';

interface TransactionStatusProps {
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

const TransactionStatus: React.FC<TransactionStatusProps> = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'completed': return '#4caf50';
      case 'processing': return '#2196f3';
      case 'failed': return '#f44336';
      default: return '#ff9800';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'processing': return 'Processing';
      case 'failed': return 'Failed';
      default: return 'Pending';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'processing':
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <CircularProgress size={16} sx={{ color: getStatusColor() }} />
          </motion.div>
        );
      case 'completed':
        return (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ 
              width: 16, 
              height: 16, 
              borderRadius: '50%', 
              bgcolor: getStatusColor() 
            }} />
          </motion.div>
        );
      case 'failed':
        return (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ 
              width: 16, 
              height: 16, 
              borderRadius: '50%', 
              bgcolor: getStatusColor() 
            }} />
          </motion.div>
        );
      default:
        return (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Box sx={{ 
              width: 16, 
              height: 16, 
              borderRadius: '50%', 
              bgcolor: getStatusColor() 
            }} />
          </motion.div>
        );
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {getStatusIcon()}
      <Typography 
        variant="body2" 
        sx={{ 
          color: getStatusColor(),
          fontWeight: 600
        }}
      >
        {getStatusText()}
      </Typography>
    </Box>
  );
};

export default TransactionStatus;