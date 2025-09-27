// features/about/hooks/useFAQ.ts
import { useState } from 'react';
import type { FAQItem } from '../types/about.types';

export const useFAQ = (faqItems: FAQItem[]) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const toggleItem = (id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const isExpanded = (id: string) => expandedItems.has(id);

  const categories = ['all', ...Array.from(new Set(faqItems.map(item => item.category)))];

  const filteredFAQ = selectedCategory === 'all' 
    ? faqItems 
    : faqItems.filter(item => item.category === selectedCategory);

  return {
    expandedItems,
    selectedCategory,
    categories,
    filteredFAQ,
    toggleItem,
    isExpanded,
    setSelectedCategory
  };
};