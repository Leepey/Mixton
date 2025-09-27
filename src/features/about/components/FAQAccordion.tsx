// src/features/about/components/FAQAccordion.tsx
import React, { useState } from 'react';
import { Box } from '@mui/material';
import { FAQAccordionItem } from './FAQAccordionItem';
import type { FAQItem as FAQItemType } from '../types/about.types';

interface FAQAccordionProps {
  items: FAQItemType[];
}

export const FAQAccordion: React.FC<FAQAccordionProps> = ({ items }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleToggle = (itemId: string) => {
    setExpandedId(expandedId === itemId ? null : itemId);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {items.map((item) => (
        <FAQAccordionItem
          key={item.id}
          id={item.id}
          question={item.question}
          answer={item.answer}
          category={item.category}
          tags={item.tags}
          isPopular={item.isPopular}
          lastUpdated={item.lastUpdated}
          expanded={expandedId === item.id}
          onToggle={() => handleToggle(item.id)}
        />
      ))}
    </Box>
  );
};