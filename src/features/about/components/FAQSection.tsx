// features/about/components/FAQSection.tsx
import React from 'react';
import {Box, Container, Typography, Paper, alpha, Chip, Button} from '@mui/material';
import {motion} from 'framer-motion';
import {useTheme} from '@mui/material/styles';
import {useAboutData} from '../hooks/useAboutData';
import {useFAQ} from '../hooks/useFAQ';
import {FAQItemComponent} from './FAQItem';

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
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading FAQ...</Typography>
      </Box>
    );
  }

  return (
    <Box
      component={motion.section}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        py: 8,
        background: alpha(theme.palette.background.default, 0.5),
        borderRadius: '24px',
        mb: 4
      }}
    >
      <Container maxWidth="lg">
        <Box textAlign="center" mb={6}>
          <Typography
            variant="h2"
            fontWeight={700}
            gutterBottom
            sx={{
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Frequently Asked Questions
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Find answers to common questions about Mixton and our services
          </Typography>
        </Box>

        {/* Category filters */}
        <Box display="flex" justifyContent="center" flexWrap="wrap" gap={2} mb={6}>
          {categories.map((category) => (
            <Chip
              key={category}
              label={category}
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
        <Box maxWidth="800px" mx="auto">
          {filteredFAQ.map((item, index) => (
            <FAQItemComponent key={index} {...item} />
          ))}
        </Box>

        {/* Contact CTA */}
        <Box textAlign="center" mt={6}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Still Have Questions?
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              borderRadius: '20px',
              px: 4,
              py: 1.5,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              '&:hover': {
                background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`
              }
            }}
          >
            Contact Support
          </Button>
        </Box>
      </Container>
    </Box>
  );
};