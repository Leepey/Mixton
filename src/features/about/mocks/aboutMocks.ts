// src/features/about/mocks/aboutMocks.ts
import type { 
  TeamMember, 
  TimelineEvent, 
  Feature, 
  FAQItem, 
  AboutStats 
} from '../types/about.types';

// Mock данные для команды
export const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    role: 'Lead Developer',
    bio: 'Blockchain developer with 5+ years of experience in TON ecosystem. Passionate about privacy and decentralized technologies.',
    avatar: '/avatars/alex.jpg',
    socialLinks: {
      github: 'https://github.com/alexj',
      twitter: 'https://twitter.com/alexj'
    }
  },
  {
    id: '2',
    name: 'Sarah Chen',// src/features/about/mocks/aboutMocks.ts
import type { 
  TeamMember, 
  TimelineEvent, 
  Feature, 
  FAQItem, 
  AboutStats 
} from '../types/about.types';

// Mock данные для команды
export const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    role: 'Lead Developer',
    bio: 'Blockchain developer with 5+ years of experience in TON ecosystem. Passionate about privacy and decentralized technologies.',
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
    bio: 'Cryptography specialist focused on privacy solutions. PhD in Computer Science with emphasis on blockchain security.',
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
    bio: 'Building user-friendly privacy tools for Web3. 10+ years of experience in product management and blockchain projects.',
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

// ... остальные mock данные остаются без изменений
    role: 'Security Expert',
    bio: 'Cryptography specialist focused on privacy solutions. PhD in Computer Science with emphasis on blockchain security.',
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
    bio: 'Building user-friendly privacy tools for Web3. 10+ years of experience in product management and blockchain projects.',
    avatar: '/avatars/mike.jpg',
    socialLinks: {
      twitter: 'https://twitter.com/miker',
      linkedin: 'https://linkedin.com/in/miker'
    }
  }
];

// Mock данные для таймлайна
export const mockTimelineEvents: TimelineEvent[] = [
  {
    id: '1',
    date: 'Q1 2024',
    title: 'Project Inception',
    description: 'Started development of Mixton with focus on TON privacy solutions and user experience.',
    icon: '🚀'
  },
  {
    id: '2',
    date: 'Q2 2024',
    title: 'Alpha Release',
    description: 'Launched alpha version with basic mixing functionality and initial security audit.',
    icon: '🔬'
  },
  {
    id: '3',
    date: 'Q3 2024',
    title: 'Security Audit',
    description: 'Completed comprehensive security audit by third-party experts with zero critical findings.',
    icon: '🔒'
  },
  {
    id: '4',
    date: 'Q4 2024',
    title: 'Public Launch',
    description: 'Official launch with advanced features and multi-pool support for enhanced privacy.',
    icon: '🎉'
  }
];

// Mock данные для функций
export const mockFeatures: Feature[] = [
  {
    id: '1',
    title: 'Advanced Mixing Algorithm',
    description: 'State-of-the-art transaction mixing technology with multiple privacy layers.',
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
    description: 'Choose your preferred privacy level with different pool options.',
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
    description: 'Audited and secure smart contracts with advanced security features.',
    icon: '🛡️',
    details: [
      'Formal verification',
      'Multi-signature controls',
      'Emergency pause functionality',
      'Regular security updates'
    ]
  }
];

// Mock данные для FAQ
export const mockFAQItems: FAQItem[] = [
  {
    id: '1',
    question: 'What is TON mixing?',
    answer: 'TON mixing is a privacy-enhancing technique that obscures the origin of transactions by combining them with others, making it difficult to trace the flow of funds. Mixton implements this with advanced cryptographic methods.',
    category: 'General'
  },
  {
    id: '2',
    question: 'Is Mixton safe to use?',
    answer: 'Yes, Mixton has undergone rigorous security audits and uses industry-standard encryption and privacy techniques. Our smart contracts are open-source and verifiable on the TON blockchain.',
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
    answer: 'Fees vary by pool: Basic (0.1%), Standard (0.3%), Premium (0.5%). These fees help maintain the service and provide liquidity for smooth mixing operations.',
    category: 'Fees'
  }
];

// Mock данные для статистики
export const mockAboutStats: AboutStats = {
  totalUsers: 15420,
  totalTransactions: 89340,
  totalVolume: 2560000,
  uptime: 99.9
};