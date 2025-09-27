// features/home/components/CTASection.tsx
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { Shuffle } from '@mui/icons-material';

interface CTASectionProps {
  userConnected: boolean;
  onMixClick: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ userConnected, onMixClick }) => {
  return (
    <Box sx={{ py: 8, textAlign: 'center' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 3 }}>
          Ready to Mix Your TON?
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: '600px', mx: 'auto' }}>
          Join thousands of users who trust our platform for secure and anonymous TON transactions. 
          Get started now with just a few clicks.
        </Typography>
        
        {userConnected ? (
          <Button
            variant="contained"
            size="large"
            startIcon={<Shuffle />}
            onClick={onMixClick}
            sx={{
              borderRadius: '30px',
              px: 4,
              py: 1.5,
              background: 'linear-gradient(45deg, #8BC34A, #2196F3)',
              boxShadow: `0 4px 20px rgba(139, 195, 74, 0.4)`,
              '&:hover': {
                background: 'linear-gradient(45deg, #7CB342, #1976D2)',
              }
            }}
          >
            Start Mixing Now
          </Button>
        ) : (
          <Button
            variant="contained"
            size="large"
            sx={{
              borderRadius: '30px',
              px: 4,
              py: 1.5,
              background: 'linear-gradient(45deg, #8BC34A, #2196F3)',
              boxShadow: `0 4px 20px rgba(139, 195, 74, 0.4)`,
              '&:hover': {
                background: 'linear-gradient(45deg, #7CB342, #1976D2)',
              }
            }}
          >
            Connect Wallet
          </Button>
        )}
      </motion.div>
    </Box>
  );
};