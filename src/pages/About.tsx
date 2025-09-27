// pages/About.tsx
import React from 'react';
import { 
  HeroSection,
  StatsSection,
  MissionSection,
  TeamSection,
  TimelineSection,
  TechnologySection,
  FAQSection,
  ContactSection
} from '../features/about';

const About: React.FC = () => {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <MissionSection />
      <TeamSection />
      <TimelineSection />
      <TechnologySection />
      <FAQSection />
      <ContactSection />
    </>
  );
};

export default About;