// features/about/types/about.types.ts

// Базовые типы для команды

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  socialLinks: {
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
  joinDate?: string;
  skills?: string[];     
  isActive?: boolean;   
}

// Социальные ссылки
export interface SocialLinks {
  github?: string;
  twitter?: string;
  linkedin?: string;
  discord?: string;
  telegram?: string;
  website?: string;
}

// Типы для таймлайна
export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  type: TimelineEventType;
  details?: string;
  image?: string;
  links?: TimelineEventLink[];
}

export interface TimelineEventLink {
  title: string;
  url: string;
  type: 'github' | 'external' | 'blog' | 'documentation';
}

export type TimelineEventType = 
  | 'milestone' 
  | 'release' 
  | 'update' 
  | 'partnership' 
  | 'achievement';

// Типы для технологий/фичей
export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  details: string[];
  category: TechnologyCategory;
  isFeatured: boolean;
  documentationUrl?: string;
  githubUrl?: string;
}

export type TechnologyCategory = 
  | 'security' 
  | 'privacy' 
  | 'performance' 
  | 'usability' 
  | 'integration';

// Типы для FAQ
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: FAQCategory;
  tags: string[];
  isPopular: boolean;
  lastUpdated: string;
  relatedQuestions?: string[];
}
export interface FAQItemType {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  socialLinks: {
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
  joinDate?: string;
  skills?: string[];
  isActive?: boolean;
}


export type FAQCategory = 
  | 'general' 
  | 'technical' 
  | 'security' 
  | 'privacy' 
  | 'troubleshooting' 
  | 'fees' 
  | 'limits';

// Типы для контактной информации
export interface ContactInfo {
  email: string;
  telegram?: string;
  github?: string;
  discord: string;
  supportHours: {
    timezone: string;
    hours: string;
  };
  responseTime: string;
}

// Типы для статистики
export interface AboutStats {
  // Project statistics
  totalMixed: string;
  usersCount: string;
  poolsCount: number;
  uptime: number;
  securityAudits: number;
  lastUpdated: string;
  
  // Analytics statistics
  bounceRate: number;
  topSections: Array<{
    section: string;
    views: number;
    percentage: number;
  }>;
  contactFormSubmissions: number;
  faqViews: Record<string, number>;
}

// Типы для данных страницы "О нас"
export interface AboutPageData {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    backgroundImage?: string;
  };
  stats: AboutStats;
  mission: {
    title: string;
    description: string;
    values: string[];
  };
  team: TeamData;
  timeline: TimelineData;
  features: Feature[];
  faq: FAQData;
  contact: ContactInfo;
}

// Типы для данных команды
export interface TeamData {
  title: string;
  description: string;
  members: TeamMember[];
  stats: {
    totalMembers: number;
    countries: number;
    averageExperience: number;
  };
}

// Типы для данных таймлайна
export interface TimelineData {
  title: string;
  description: string;
  events: TimelineEvent[];
  stats: {
    totalEvents: number;
    dateRange: {
      start: string;
      end: string;
    };
  };
}

// Типы для данных FAQ
export interface FAQData {
  title: string;
  description: string;
  categories: FAQCategory[];
  items: FAQItem[];
  stats: {
    totalQuestions: number;
    popularQuestions: number;
    categoriesCount: number;
  };
}

// Типы для контактной формы
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  category: ContactCategory;
}

export interface ContactFormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export type ContactCategory = 
  | 'general' 
  | 'technical' 
  | 'support' 
  | 'partnership' 
  | 'security' 
  | 'feedback';

// Типы для карточки статистики
export interface StatCardData {
  id: string;
  title: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  trend?: {
    value: number;
    isPositive: boolean;
    period: string;
  };
}

// Типы для API ответов
export interface AboutApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface ContactFormResponse {
  success: boolean;
  message: string;
  ticketId?: string;
  estimatedResponseTime?: string;
}

// Типы для пагинации
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: keyof FAQItem | keyof TimelineEvent;
  sortOrder?: 'asc' | 'desc';
  filter?: {
    category?: FAQCategory;
    type?: TimelineEventType;
    search?: string;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Типы для поиска
export interface SearchParams {
  query: string;
  type: 'faq' | 'timeline' | 'team' | 'all';
  filters?: {
    category?: FAQCategory;
    dateRange?: {
      start: string;
      end: string;
    };
  };
}

export interface SearchResult {
  type: 'faq' | 'timeline' | 'team';
  id: string;
  title: string;
  description: string;
  relevance: number;
  url: string;
}

// Типы для метаданных
export interface AboutPageMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  canonicalUrl?: string;
  lastModified: string;
}

// Типы для A/B тестирования
export interface AboutPageVariant {
  id: string;
  name: string;
  description: string;
  components: {
    hero?: 'A' | 'B';
    stats?: 'A' | 'B';
    team?: 'A' | 'B';
  };
  trafficPercentage: number;
}

// Типы для аналитики
export interface AboutPageAnalytics {
  pageViews: number;
  uniqueVisitors: number;
  averageTimeOnPage: number;
  bounceRate: number;
  topSections: Array<{
    section: string;
    views: number;
    percentage: number;
  }>;
  contactFormSubmissions: number;
  faqViews: Record<FAQCategory, number>;
}

// Типы для конфигурации
export interface AboutPageConfig {
  features: {
    showTeam: boolean;
    showTimeline: boolean;
    showFAQ: boolean;
    showContactForm: boolean;
    enableSearch: boolean;
    enableDarkMode: boolean;
  };
  styling: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    borderRadius: string;
    fontFamily: string;
  };
  content: {
    maxTeamMembers: number;
    maxTimelineEvents: number;
    maxFAQItems: number;
    itemsPerPage: number;
  };
}

// Типы для ошибок - замена enum на объект с типами
export type AboutError = 
  | 'TEAM_NOT_FOUND'
  | 'FAQ_NOT_FOUND'
  | 'TIMELINE_NOT_FOUND'
  | 'CONTACT_FORM_ERROR'
  | 'VALIDATION_ERROR'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR';

export interface AboutErrorDetails {
  code: AboutError;
  message: string;
  details?: any;
  timestamp: string;
}

// Типы для событий
export type AboutPageEvent = 
  | { type: 'PAGE_VIEW'; payload: { section?: string } }
  | { type: 'CONTACT_FORM_SUBMIT'; payload: ContactFormData }
  | { type: 'FAQ_VIEW'; payload: { faqId: string; category: FAQCategory } }
  | { type: 'TEAM_MEMBER_VIEW'; payload: { memberId: string } }
  | { type: 'SEARCH'; payload: SearchParams }
  | { type: 'ERROR'; payload: AboutErrorDetails };

// Объект с константами ошибок для удобства использования
export const ABOUT_ERRORS = {
  TEAM_NOT_FOUND: 'TEAM_NOT_FOUND',
  FAQ_NOT_FOUND: 'FAQ_NOT_FOUND',
  TIMELINE_NOT_FOUND: 'TIMELINE_NOT_FOUND',
  CONTACT_FORM_ERROR: 'CONTACT_FORM_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

// Тип для проверки, является ли значение ошибкой AboutError
export type IsAboutError = typeof ABOUT_ERRORS[keyof typeof ABOUT_ERRORS];