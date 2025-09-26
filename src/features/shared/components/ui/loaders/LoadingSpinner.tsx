// src/components/ui/loaders/LoadingSpinner.tsx
import React from 'react';
import { Box, CircularProgress, Typography, alpha } from '@mui/material';
import { motion } from 'framer-motion';

const LoadingSpinner: React.FC = () => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        background: `linear-gradient(135deg, #0a192f 0%, #000000 100%)`,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Неоновые элементы фона */}
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${alpha('#00BCD4', 0.1)} 0%, transparent 70%)`,
        filter: 'blur(40px)',
        zIndex: 0
      }} />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ zIndex: 1 }}
      >
        <CircularProgress 
          size={60} 
          thickness={4}
          sx={{
            color: '#00BCD4',
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            },
          }}
        />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{ zIndex: 1 }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            mt: 2, 
            color: '#00BCD4',
            fontWeight: 600,
            textShadow: `0 0 10px ${alpha('#00BCD4', 0.5)}`
          }}
        >
          Loading...
        </Typography>
      </motion.div>
    </Box>
  );
};

export default LoadingSpinner;