// src/features/shared/types/common.types.ts
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
export interface ErrorPageProps {
  code?: number;
  title?: string;
  message?: string;
  showHomeButton?: boolean;
  customAction?: {
    label: string;
    onClick: () => void;
  };
}