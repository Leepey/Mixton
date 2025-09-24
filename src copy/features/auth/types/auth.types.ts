export interface User {
  id: string;
  address: string;
  balance: number;
  connected: boolean;
  role: 'user' | 'admin' | 'moderator';
  joinDate: number;
  lastActive: number;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  address: string;
  signature?: string;
}

export interface WalletConnection {
  address: string;
  publicKey: string;
  version: number;
  walletType: 'tonkeeper' | 'tonhub' | 'mytonwallet' | 'other';
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  updateUserBalance: (balance: number) => void;
  clearError: () => void;
}

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error';