// features/about/types/about.types.ts
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
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  details: string[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface ContactInfo {
  email: string;
  telegram?:?: string;
  github?: string;
  discord string;
}

export interface AboutStats {
  totalUsers: number;
  totalTransactions: number;
  totalVolume: number;
  uptime: number;
}