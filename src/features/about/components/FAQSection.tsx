// features/about/components/FAQSection.tsx
import React from 'react';
import { Box, Container, Typography, Paper, alpha, Chip, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import { useAboutData } from '../hooks/useAboutData';
import { useFAQ } from '../hooks/useFAQ';
import { FAQItem } from './FAQItem';

export const FAQSection: React.FC = () => {
  const theme = useTheme();
  const { faq, loading } = useAboutData();
  const { 
    categories, 
    selectedCategory, 
    filteredFAQ, 
    setSelectedCategory 
  } = useFAQ(faq);

  if (loading) {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography>Loading FAQ...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 12 }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography 
            variant="h3" 
            component="h2" 
            textAlign="center" 
            sx={{ mb: 2, fontWeight: 700 }}
          >
            Frequently Asked Questions
          </Typography>
          
          <Typography 
            variant="h6" 
            color="text.secondary"
            textAlign="center" 
            sx={{ mb: 8, maxWidth: '600px', mx: 'auto' }}
          >
            Find answers to common questions about Mixton and our services
          </Typography>
          
          {/* Category filters */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 6 }}>
            {categories.map((category) => (
              <Chip
                key={category}
                label={category.charAt(0).toUpperCase() + category.slice(1)}
                onClick={() => setSelectedCategory(category)}
                sx={{
                  px: 3,
                  py: 1,
                  borderRadius: '20px',
                  background: selectedCategory === category 
                    ? `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                    : alpha(theme.palette.background.paper, 0.8),
                  color: selectedCategory === category ? 'white' : theme.palette.text.primary,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  '&:hover': {
                    background: selectedCategory === category 
                      ? `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                      : alpha(theme.palette.primary.main, 0.1)
                  }
                }}
              />
            ))}
          </Box>
          
          {/* FAQ Items */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {filteredFAQ.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <FAQItem {...item} />
              </motion.div>
            ))}
          </Box>
          
          {/* Contact CTA */}
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Button
              variant="contained"
              size="large"
              href="#contact"
              sx={{
                borderRadius: '12px',
                px: 6,
                py: 1.5,
                background: `linear-gradient(45deg, #00BCD4, #2196F3)`,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(0, 188, 212, 0.3)'
                }
              }}
            >
              Still Have Questions?
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};