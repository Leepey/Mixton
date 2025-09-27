// features/auth/index.ts

// Компоненты
export { AuthProvider, useAuthContext } from './components/AuthProvider';

// Хуки
export { useAuth } from './hooks/useAuth';
export { useWalletAuth } from './hooks/useWalletAuth';

// Сервисы
export { AuthService } from './services/authService';
export { WalletAuthService } from './services/walletAuthService';

// Типы
export type { 
  AuthUser,
  LoginCredentials,
  RegisterCredentials,
  ForgotPasswordData,
  ResetPasswordData,
  AuthResponse,
  AuthError,
  UserRole,
  UserPermission,
  UserSession,
  UserProfile,
  SecuritySettings,
  UserActivity,
  UserData,
  UserByAddressResponse
} from './types/auth.types';