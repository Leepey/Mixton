// features/home/services/homeService.ts
import type { HomeStats } from '../types/home.types';

export class HomeService {
  static async getHomeStats(): Promise<HomeStats> {
    // Здесь будет логика получения статистики для главной страницы
    return {
      totalParticipants: 0,
      totalVolume: 0,
      totalPools: 0
    };
  }

  static async getFeatureCards(): Promise<any[]> {
    // Здесь будет логика получения карточек функций
    return [
      {
        icon: "Security",
        title: "Zero-Knowledge Proofs",
        description: "Your transactions are completely private with cryptographic guarantees that ensure your financial privacy"
      },
      {
        icon: "Speed",
        title: "Multi-Hop Mixing",
        description: "Funds pass through multiple nodes and randomized paths to ensure maximum anonymity and unlinkability"
      },
      {
        icon: "PrivacyTip",
        title: "No KYC Required",
        description: "No personal information needed - complete privacy from start to finish with no registration required"
      }
    ];
  }
}