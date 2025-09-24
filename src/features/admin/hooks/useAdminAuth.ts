// src/features/admin/hooks/useAdminAuth.ts
import { useAuth } from '@/features/auth/hooks/useAuth';

export const useAdminAuth = () => {
  const { user } = useAuth();
  
  return {
    isAdmin: user?.role === 'admin',
    user,
  };
};