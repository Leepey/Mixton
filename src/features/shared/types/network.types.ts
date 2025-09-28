// Типы для сетевых настроек
export type NetworkType = 'mainnet' | 'testnet';

export interface NetworkConfig {
  id: number;
  name: string;
  explorerUrl: string;
  apiUrl: string;
}

// Типы для API запросов
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Типы для WebSocket
export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: Date;
}

export interface WebSocketConfig {
  url: string;
  reconnectInterval: number;
  maxReconnectAttempts: number;
}

// Типы для ошибок
export interface ApiError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}
