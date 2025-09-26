// features/about/services/aboutService.ts
import { TeamMember, TimelineEvent, Feature, FAQItem, AboutStats } from '../types/about.types';

export class AboutService {
  static async getTeamMembers(): Promise<TeamMember[]> {
    // Здесь будет логика получения информации о команде
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
        }
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
        }
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
        }
      }
    ];
  }

  static async getTimeline(): Promise<TimelineEvent[]> {
    // Здесь будет логика получения истории проекта
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
  }

  static async getFeatures(): Promise<Feature[]> {
    // Здесь будет логика получения информации о функциях
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
  }

  static async getFAQ(): Promise<FAQItem[]> {
    // Здесь будет логика получения FAQ
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
  }

  static async getStats(): Promise<AboutStats> {
    // Здесь будет логика получения статистики
    return {
      totalUsers: 15420,
      totalTransactions: 89340,
      totalVolume: 2560000,
      uptime: 99.9
    };
  }

  static async getContactInfo(): Promise<ContactInfo> {
    // Здесь будет логика получения контактной информации
    return {
      email: 'support@mixton.ton',
      telegram: 'mixton_support',
      discord: 'https://discord.gg/mixton',
      github: 'https://github.com/Leepey/Mixton'
    };
  }
}