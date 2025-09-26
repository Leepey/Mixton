// features/about/utils/aboutUtils.ts
import { TimelineEvent } from '../types/about.types';

export const formatTimelineDate = (date: string): string => {
  return date;
};

export const getTimelineIcon = (title: string): string => {
  const iconMap: Record<string, string> = {
    'Project Inception': '🚀',
    'Alpha Release': '🔬',
    'Security Audit': '🔒',
    'Public Launch': '🎉',
    'Major Update': '⚡',
    'Partnership': '🤝',
    'Milestone': '🏆'
  };
  return iconMap[title] || '📅';
};

export const formatStatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M+`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K+`;
  return num.toString();
};

export const getFAQCategoryColor = (category: string): string => {
  const colorMap: Record<string, string> = {
    'General': '#00BCD4',
    'Security': '#4CAF50',
    'Usage': '#FFC107',
    'Fees': '#FF5722'
  };
  return colorMap[category] || '#9C27B0';
};