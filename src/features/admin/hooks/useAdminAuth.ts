import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';

export const useAdminAuth = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        // В реальном приложении здесь будет проверка прав администратора
        // Например, вызов смарт-контракта или API
        const adminAddresses = [
          'EQD11111111111111111111111111111111111111111',
          'EQD22222222222222222222222222222222222222222',
        ];
        
        const hasAdminRights = adminAddresses.includes(user.address || '');
        setIsAdmin(hasAdminRights);
      } catch (error) {
        console.error('Failed to check admin status:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  return { isAdmin, loading };
};