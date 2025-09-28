export interface AdminStats {
  totalUsers: number;
  totalPools: number;
  totalTransactions: number;
  totalVolume: number;
}

export interface SystemInfo {
  version: string;
  uptime: string;
  memory: {
    used: number;
    total: number;
  };
  cpu: number;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'moderator' | 'user';
  createdAt: Date;
  lastLogin: Date;
  isActive: boolean;
}
