// src/features/home/types/home.types.ts (дополнение)

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  details?: string[];
  category?: string;
  badge?: string;
  featured?: boolean;
}

export interface FeatureSectionProps {
  features: Feature[];
  title?: string;
  description?: string;
  variant?: 'default' | 'compact' | 'detailed';
  columns?: number;
  showAll?: boolean;
  maxFeatures?: number;
}