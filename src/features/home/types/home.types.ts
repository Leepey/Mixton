// features/home/types/home.types.ts
export interface HomeStats {
  totalParticipants: number;
  totalVolume: number;
  totalPools: number;
}

export interface FeatureCard {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface HomeFormData {
  amount: string;
  note: string;
  selectedPool: string;
  amountError: string;
}

export interface HomeUIState {
  showForm: boolean;
  transactionPending: boolean;
  showInfo: boolean;
}

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