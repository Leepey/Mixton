// features/about/index.ts

// Сервисы
export { AboutService } from './services/aboutService';

// Хуки
export { useAboutData } from './hooks/useAboutData';
export { useFAQ } from './hooks/useFAQ';
export { useTeamMembers } from './hooks/useTeamMembers';
export { useTimeline } from './hooks/useTimeline';
export { useContactForm } from './hooks/useContactForm';

// Компоненты
export { HeroSection } from './components/HeroSection';
export { StatsSection } from './components/StatsSection';
export { default as MissionSection } from './components/MissionSection';
export { TeamSection } from './components/TeamSection';
export { TimelineSection } from './components/TimelineSection';
export { TechnologySection } from './components/TechnologySection';
export { default as ContactSection } from './components/ContactSection';

// Дополнительные компоненты
export { TeamMemberCard } from './components/TeamMemberCard';
export { TimelineCard } from './components/TimelineCard';
export { TechnologyCard } from './components/TechnologyCard';
export { FAQAccordion } from './components/FAQAccordion';
export { FAQAccordionItem } from './components/FAQAccordionItem';
export { FAQItemComponent } from './components/FAQItem';
export { FAQSection } from './components/FAQSection';
export { StatCard } from './components/StatCard';

// Утилиты
export { 
  formatTimelineDate, 
  getTimelineIcon, 
  formatStatNumber, 
  getFAQCategoryColor,
  validateEmail,
  formatSocialLink,
  getInitials,
  truncateText
} from './utils/aboutUtils';

// Типы
export type {
  TeamMember,
  TimelineEvent,
  Feature,
  FAQItem,
  ContactInfo,
  AboutStats,
  AboutPageData,
  TimelineData,
  TeamData,
  FAQData,
  ContactFormData,
  ContactFormErrors,
  SocialLinks,
  FAQCategory,
  TimelineEventType,
  StatCardData
} from './types/about.types';

// Константы
export { 
  FAQ_CATEGORIES, 
  TIMELINE_EVENT_TYPES,
  SOCIAL_PLATFORMS,
  CONTACT_VALIDATION_RULES 
} from './constants/aboutConstants';

// Моки (для разработки)
export { 
  mockTeamMembers, 
  mockTimelineEvents, 
  mockFeatures, 
  mockFAQItems, 
  mockAboutStats 
} from './mocks/aboutMocks';