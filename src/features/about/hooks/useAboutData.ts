// features/about/hooks/useAboutData.ts
import { useState, useEffect } from 'react';
import { AboutService } from '../services/aboutService';
import { TeamMember, TimelineEvent, Feature, FAQItem, AboutStats, ContactInfo } from '../types/about.types';

export const useAboutData = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [faq, setFaq] = useState<FAQItem[]>([]);
  const [stats, setStats] = useState<AboutStats | null>(null);
  const [contact, setContact] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [teamData, timelineData, featuresData, faqData, statsData, contactData] = await Promise.all([
        AboutService.getTeamMembers(),
        AboutService.getTimeline(),
        AboutService.getFeatures(),
        AboutService.getFAQ(),
        AboutService.getStats(),
        AboutService.getContactInfo()
      ]);

      setTeam(teamData);
      setTimeline(timelineData);
      setFeatures(featuresData);
      setFaq(faqData);
      setStats(statsData);
      setContact(contactData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch about data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    team,
    timeline,
    features,
    faq,
    stats,
    contact,
    loading,
    error,
    refetch: fetchData
  };
};