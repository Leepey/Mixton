export interface AppState {
  isLoading: boolean;
  error: string | null;
  theme: 'light' | 'dark';
  language: 'en' | 'ru' | 'zh';
}

export interface User {
  id: string;
  address: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppSettings {
  notifications: boolean;
  sound: boolean;
  autoConnect: boolean;
  currency: 'TON' | 'USD' | 'EUR';
}