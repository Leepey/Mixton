// src/features/about/utils/aboutUtils.ts
import type { FAQItem } from '../types/about.types';

/**
 * Форматирует дату для таймлайна
 */
export const formatTimelineDate = (date: string): string => {
  return date;
};

/**
 * Возвращает иконку для события таймлайна
 */
export const getTimelineIcon = (type: string): React.ReactNode => {
  const icons: Record<string, React.ReactNode> = {
    'inception': '🚀',
    'release': '🔬',
    'audit': '🔒',
    'launch': '🎉'
  };
  return icons[type] || '📅';
};

/**
 * Форматирует число для статистики
 */
export const formatStatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

/**
 * Возвращает цвет для категории FAQ
 */
export const getFAQCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    'General': 'primary',
    'Security': 'success',
    'Usage': 'info',
    'Fees': 'warning'
  };
  return colors[category] || 'default';
};

/**
 * Валидирует email
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Форматирует социальную ссылку
 */
export const formatSocialLink = (platform: string, username: string): string => {
  const urls: Record<string, string> = {
    'github': `https://github.com/${username}`,
    'twitter': `https://twitter.com/${username}`,
    'linkedin': `https://linkedin.com/in/${username}`,
    'telegram': `https://t.me/${username}`
  };
  return urls[platform.toLowerCase()] || username;
};

/**
 * Получает инициалы из имени
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
};

/**
 * Обрезает текст до указанной длины
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength).trim() + '...';
};

/**
 * Группирует FAQ по категориям
 */
export const groupFAQByCategory = (items: FAQItem[]): Record<string, FAQItem[]> => {
  return items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, FAQItem[]>);
};

/**
 * Форматирует дату в относительный формат (например, "2 days ago")
 */
export const formatRelativeDate = (date: string | Date): string => {
  const now = new Date();
  const pastDate = typeof date === 'string' ? new Date(date) : date;
  const diffMs = now.getTime() - pastDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
};

/**
 * Проверяет, является ли URL валидным
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Форматирует число с разделителями тысяч
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

/**
 * Генерирует случайный ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Проверяет, является ли строка пустой или содержит только пробелы
 */
export const isEmpty = (str: string): boolean => {
  return !str || str.trim().length === 0;
};

/**
 * Капитализирует первую букву строки
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};