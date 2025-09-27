// src/features/about/constants/aboutConstants.ts

// Категории FAQ
export const FAQ_CATEGORIES = [
  'General',
  'Security', 
  'Usage',
  'Fees'
] as const;

export type FAQCategory = typeof FAQ_CATEGORIES[number];

// Типы событий таймлайна
export const TIMELINE_EVENT_TYPES = [
  'inception',
  'release',
  'audit',
  'launch'
] as const;

export type TimelineEventType = typeof TIMELINE_EVENT_TYPES[number];

// Социальные платформы
export const SOCIAL_PLATFORMS = [
  'github',
  'twitter',
  'linkedin',
  'telegram',
  'discord'
] as const;

export type SocialPlatform = typeof SOCIAL_PLATFORMS[number];

// Правила валидации контактов
export const CONTACT_VALIDATION_RULES = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    minLength: 5,
    maxLength: 100
  },
  telegram: {
    required: false,
    pattern: /^[a-zA-Z0-9_]{5,32}$/,
    minLength: 5,
    maxLength: 32
  },
  github: {
    required: false,
    pattern: /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/,
    minLength: 1,
    maxLength: 39
  },
  discord: {
    required: false,
    pattern: /^https:\/\/discord\.gg\/[a-zA-Z0-9]+$/,
    minLength: 19,
    maxLength: 100
  }
} as const;

// Цвета для категорий
export const CATEGORY_COLORS = {
  General: 'primary',
  Security: 'success',
  Usage: 'info',
  Fees: 'warning'
} as const;

// Иконки для социальных платформ
export const SOCIAL_ICONS = {
  github: 'GitHub',
  twitter: 'Twitter',
  linkedin: 'LinkedIn',
  telegram: 'Telegram',
  discord: 'Discord'
} as const;