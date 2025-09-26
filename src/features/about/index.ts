// features/about/index.ts
export { AboutService } from './services/aboutService';
export { useAboutData } from './hooks/useAboutData';
export { useFAQ } from './hooks/useFAQ';
export { HeroSection } from './components/HeroSection';
export { StatsSection } from './components/StatsSection';
export { MissionSection } from './components/MissionSection';
export { TeamSection } from './components/TeamSection';
export { TimelineSection } from './components/TimelineSection';
export { TechnologySection } from './components/TechnologySection';
export { FAQSection } from './components/FAQSection';
export { ContactSection } from './components/ContactSection';
export { formatTimelineDate, getTimelineIcon, formatStatNumber, getFAQCategoryColor } from './utils/aboutUtils';
export type { 
  TeamMember, 
  TimelineEvent, 
  Feature, 
  FAQItem, 
  ContactInfo, 
  AboutStats 
} from './types/about.types';