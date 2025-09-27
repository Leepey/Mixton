// src/features/about/services/aboutService.ts
import type { 
  TeamMember, 
  TimelineEvent, 
  Feature, 
  FAQItem, 
  AboutStats,
  ContactInfo 
} from '../types/about.types';

export class AboutService {
  // Получение информации о команде
  static async getTeamMembers(): Promise<TeamMember[]> {
    try {
      // Mock данные для разработки с новыми полями
      return [
        {
          id: '1',
          name: 'Alex Johnson',
          role: 'Lead Developer',
          bio: 'Blockchain developer with 5+ years of experience in TON ecosystem',
          avatar: '/avatars/alex.jpg',
          socialLinks: {
            github: 'https://github.com/alexj',
            twitter: 'https://twitter.com/alexj'
          },
          joinDate: '2023-01-15',
          skills: ['React', 'TypeScript', 'TON Blockchain', 'Smart Contracts'],
          isActive: true
        },
        {
          id: '2',
          name: 'Sarah Chen',
          role: 'Security Expert',
          bio: 'Cryptography specialist focused on privacy solutions',
          avatar: '/avatars/sarah.jpg',
          socialLinks: {
            github: 'https://github.com/sarahc',
            linkedin: 'https://linkedin.com/in/sarahc'
          },
          joinDate: '2023-02-20',
          skills: ['Cryptography', 'Security Auditing', 'Zero-Knowledge Proofs', 'Rust'],
          isActive: true
        },
        {
          id: '3',
          name: 'Mike Rodriguez',
          role: 'Product Manager',
          bio: 'Building user-friendly privacy tools for Web3',
          avatar: '/avatars/mike.jpg',
          socialLinks: {
            twitter: 'https://twitter.com/miker',
            linkedin: 'https://linkedin.com/in/miker'
          },
          joinDate: '2023-03-10',
          skills: ['Product Management', 'UX Design', 'Blockchain', 'Agile'],
          isActive: true
        }
      ];
    } catch (error) {
      console.error('Error fetching team members:', error);
      return [];
    }
  }

  // Получение истории проекта
  static async getTimeline(): Promise<TimelineEvent[]> {
    try {
      // Mock данные для разработки
      return [
        {
          id: '1',
          date: 'Q1 2024',
          title: 'Project Inception',
          description: 'Started development of Mixton with focus on TON privacy',
          icon: '🚀'
        },
        {
          id: '2',
          date: 'Q2 2024',
          title: 'Alpha Release',
          description: 'Launched alpha version with basic mixing functionality',
          icon: '🔬'
        },
        {
          id: '3',
          date: 'Q3 2024',
          title: 'Security Audit',
          description: 'Completed comprehensive security audit by third-party experts',
          icon: '🔒'
        },
        {
          id: '4',
          date: 'Q4 2024',
          title: 'Public Launch',
          description: 'Official launch with advanced features and multi-pool support',
          icon: '🎉'
        }
      ];
    } catch (error) {
      console.error('Error fetching timeline:', error);
      return [];
    }
  }

  // Получение информации о функциях
  static async getFeatures(): Promise<Feature[]> {
    try {
      // Mock данные для разработки
      return [
        {
          id: '1',
          title: 'Advanced Mixing Algorithm',
          description: 'State-of-the-art transaction mixing technology',
          icon: '🔀',
          details: [
            'Multi-layer obfuscation',
            'Random delay distribution',
            'Cross-pool transactions',
            'Zero-knowledge proofs integration'
          ]
        },
        {
          id: '2',
          title: 'Multi-Pool System',
          description: 'Choose your preferred privacy level',
          icon: '🏊',
          details: [
            'Basic Pool: Fast and affordable',
            'Standard Pool: Balanced privacy',
            'Premium Pool: Maximum anonymity',
            'Custom pool configurations'
          ]
        },
        {
          id: '3',
          title: 'Smart Contract Security',
          description: 'Audited and secure smart contracts',
          icon: '🛡️',
          details: [
            'Formal verification',
            'Multi-signature controls',
            'Emergency pause functionality',
            'Regular security updates'
          ]
        }
      ];
    } catch (error) {
      console.error('Error fetching features:', error);
      return [];
    }
  }

  // Получение FAQ
  static async getFAQ(): Promise<FAQItem[]> {
    try {
      // Mock данные для разработки
      return [
        {
          id: '1',
          question: 'What is TON mixing?',
          answer: 'TON mixing is a privacy-enhancing technique that obscures the origin of transactions by combining them with others, making it difficult to trace the flow of funds.',
          category: 'General'
        },
        {
          id: '2',
          question: 'Is Mixton safe to use?',
          answer: 'Yes, Mixton has undergone rigorous security audits and uses industry-standard encryption and privacy techniques. Our smart contracts are open-source and verifiable.',
          category: 'Security'
        },
        {
          id: '3',
          question: 'How long does mixing take?',
          answer: 'Mixing time depends on the selected pool. Basic pool takes 1-2 hours, Standard pool 2-4 hours, and Premium pool 4-8 hours for maximum privacy.',
          category: 'Usage'
        },
        {
          id: '4',
          question: 'What are the fees?',
          answer: 'Fees vary by pool: Basic (0.1%), Standard (0.3%), Premium (0.5%). These fees help maintain the service and provide liquidity.',
          category: 'Fees'
        }
      ];
    } catch (error) {
      console.error('Error fetching FAQ:', error);
      return [];
    }
  }

  // Получение статистики
  static async getStats(): Promise<AboutStats> {
    try {
      // Mock данные для разработки
      return {
        totalUsers: 15420,
        totalTransactions: 89340,
        totalVolume: 2560000,
        uptime: 99.9
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      return {
        totalUsers: 0,
        totalTransactions: 0,
        totalVolume: 0,
        uptime: 0
      };
    }
  }

  // Получение контактной информации
  static async getContactInfo(): Promise<ContactInfo> {
    try {
      // Mock данные для разработки
      return {
        email: 'support@mixton.ton',
        telegram: 'mixton_support',
        discord: 'https://discord.gg/mixton',
        github: 'https://github.com/Leepey/Mixton'
      };
    } catch (error) {
      console.error('Error fetching contact info:', error);
      return {
        email: '',
        telegram: '',
        discord: '',
        github: ''
      };
    }
  }

  // Получение всех данных о странице About (для оптимизации запросов)
  static async getAboutPageData(): Promise<{
    team: TeamMember[];
    timeline: TimelineEvent[];
    features: Feature[];
    faq: FAQItem[];
    stats: AboutStats;
    contact: ContactInfo;
  }> {
    try {
      const [team, timeline, features, faq, stats, contact] = await Promise.all([
        this.getTeamMembers(),
        this.getTimeline(),
        this.getFeatures(),
        this.getFAQ(),
        this.getStats(),
        this.getContactInfo()
      ]);

      return {
        team,
        timeline,
        features,
        faq,
        stats,
        contact
      };
    } catch (error) {
      console.error('Error fetching about page data:', error);
      return {
        team: [],
        timeline: [],
        features: [],
        faq: [],
        stats: {
          totalUsers: 0,
          totalTransactions: 0,
          totalVolume: 0,
          uptime: 0
        },
        contact: {
          email: '',
          telegram: '',
          discord: '',
          github: ''
        }
      };
    }
  }
}