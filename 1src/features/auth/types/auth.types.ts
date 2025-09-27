// features/auth/types/auth.types.ts

/**
 * Пользователь аутентификации
 */
export interface AuthUser {
  id: string;
  connected: boolean;
  address: string | null;
  balance: string | null;
  username: string | null;
    isAdmin: boolean;
  email: string | null;
  avatar: string | null;
  roles: string[];
  permissions: string[];
  lastLogin: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  lastActivity?: string;
  preferences?: {
    theme?: 'light' | 'dark';
    language?: string;
    notifications?: boolean;
}
}

export interface AuthCredentials {
  address: string;
  signature?: string;
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
  refreshToken: string;
}

export interface RegisterData {
  address: string;
  connected: boolean;
  balance: string;
  isAdmin?: boolean;
}

export interface AuthActivity {
  id: string;
  userId: string;
  address: string;
  action: 'login' | 'logout' | 'register' | 'update';
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface AuthStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  loginsToday: number;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'ru' | 'zh';
  notifications: {
    email: boolean;
    push: boolean;
    browser: boolean;
  };
  privacy: {
    showBalance: boolean;
    showAddress: boolean;
    twoFactorAuth: boolean;
  };
}

export interface SecuritySettings {
  maxLoginAttempts: number;
  sessionTimeout: number;
  requireEmailVerification: boolean;
  enableTwoFactor: boolean;
  allowedIPs: string[];
  blockedIPs: string[];
}

/**
 * Данные для аутентификации
 */
export interface AuthCredentials {
  email: string;
  password: string;
  twoFactorCode?: string;
}

/**
 * Данные для регистрации
 */
export interface RegisterCredentials extends AuthCredentials {
  username: string;
  firstName?: string;
  lastName?: string;
}

/**
 * Ответ при успешном входе
 */
export interface LoginResponse {
  user: AuthUser;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Ответ при успешной регистрации
 */
export interface RegisterResponse {
  user: AuthUser;
  token: string;
  refreshToken: string;
  expiresIn: number;
  requiresEmailVerification: boolean;
}

/**
 * Ответ при обновлении токена
 */
export interface TokenRefreshResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Ответ при верификации токена
 */
export interface VerifyResponse {
  user: AuthUser;
  isValid: boolean;
}

/**
 * Ошибка аутентификации
 */
export interface AuthError {
  code: string;
  message: string;
  details?: any;
}

/**
 * Контекст аутентификации
 */
export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  login: (credentials: AuthCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<AuthUser>) => Promise<void>;
  deleteAccount: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

/**
 * Состояние аутентификации
 */
export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

/**
 * Опции для сервиса аутентификации
 */
export interface AuthServiceOptions {
  autoRefreshToken: boolean;
  tokenRefreshThreshold: number; // в миллисекундах
  storageType: 'localStorage' | 'sessionStorage';
}

/**
 * События аутентификации
 */
export type AuthEvent = 
  | { type: 'LOGIN_SUCCESS'; payload: AuthUser }
  | { type: 'LOGIN_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'TOKEN_REFRESH'; payload: { token: string; refreshToken: string } }
  | { type: 'USER_UPDATED'; payload: AuthUser }
  | { type: 'AUTH_ERROR'; payload: string };

/**
 * Результат операции аутентификации
 */
export interface AuthResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}


/**
 * Учетные данные для входа
 */
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Данные для регистрации
 */
export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

/**
 * Данные для восстановления пароля
 */
export interface ForgotPasswordData {
  email: string;
}

/**
 * Данные для сброса пароля
 */
export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

/**
 * Ответ от API аутентификации
 */
export interface AuthResponse {
  user: AuthUser;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Ошибка аутентификации
 */
export interface AuthError {
  code: string;
  message: string;
  details?: any;
}

/**
 * Типы ролей пользователей
 */
export type UserRole = 'user' | 'admin' | 'moderator';

/**
 * Типы разрешений
 */
export type UserPermission = 
  'read:dashboard' | 
  'write:dashboard' | 
  'read:transactions' | 
  'write:transactions' |
  'read:admin' | 
  'write:admin' |
  'manage:users' |
  'manage:pools';

/**
 * Сессия пользователя
 */
export interface UserSession {
  id: string;
  userId: string;
  token: string;
  refreshToken: string;
  expiresAt: string;
  createdAt: string;
  lastAccessed: string;
  ipAddress: string;
  userAgent: string;
}

/**
 * Профиль пользователя
 */
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  website?: string;
  location?: string;
  timezone: string;
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisible: boolean;
    showEmail: boolean;
    showTransactions: boolean;
  };
  twoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Настройки безопасности
 */
export interface SecuritySettings {
  twoFactorEnabled: boolean;
  loginNotifications: boolean;
  sessionTimeout: number;
  allowedIPs: string[];
  blockedIPs: string[];
  lastPasswordChange: string;
  activeSessions: UserSession[];
}

/**
 * Активность пользователя
 */
export interface UserActivity {
  id: string;
  userId: string;
  action: string;
  details: any;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
}
// features/auth/types/auth.types.ts

/**
 * Пользователь аутентификации
 */
export interface AuthUser {
  id: string;
  connected: boolean;
  address: string | null;
  balance: string | null;
  username: string | null;
  email: string | null;
  avatar: string | null;
  roles: string[];
  permissions: string[];
  lastLogin: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  isAdmin: boolean;
}

/**
 * Учетные данные для входа
 */
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Данные для регистрации
 */
export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

/**
 * Данные для восстановления пароля
 */
export interface ForgotPasswordData {
  email: string;
}

/**
 * Данные для сброса пароля
 */
export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

/**
 * Ответ от API аутентификации
 */
export interface AuthResponse {
  user: AuthUser;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Ошибка аутентификации
 */
export interface AuthError {
  code: string;
  message: string;
  details?: any;
}
/*
 * Сессия пользователя
 */
export interface UserSession {
  id: string;
  userId: string;
  token: string;
  refreshToken: string;
  expiresAt: string;
  createdAt: string;
  lastAccessed: string;
  ipAddress: string;
  userAgent: string;
}

/**
 * Профиль пользователя
 */
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  website?: string;
  location?: string;
  timezone: string;
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisible: boolean;
    showEmail: boolean;
    showTransactions: boolean;
  };
  twoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Настройки безопасности
 */
export interface SecuritySettings {
  twoFactorEnabled: boolean;
  loginNotifications: boolean;
  sessionTimeout: number;
  allowedIPs: string[];
  blockedIPs: string[];
  lastPasswordChange: string;
  activeSessions: UserSession[];
}

/**
 * Активность пользователя
 */
export interface UserActivity {
  id: string;
  userId: string;
  action: string;
  details: any;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
}

/**
 * Данные пользователя для создания/обновления
 */
export interface UserData {
  username?: string;
  email?: string;
  avatar?: string;
  roles?: UserRole[];
  permissions?: UserPermission[];
}

/**
 * Ответ API для пользователя по адресу
 */
export interface UserByAddressResponse {
  id?: string;
  address: string;
  balance?: string;
  username?: string;
  email?: string;
  avatar?: string;
  roles: UserRole[];
  permissions: UserPermission[];
  isAdmin: boolean;
  createdAt?: string;
  updatedAt?: string;
}