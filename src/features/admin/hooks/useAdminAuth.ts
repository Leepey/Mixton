// features/admin/hooks/useAdminAuth.ts
import { useState, useEffect } from 'react';
import { useTonConnect } from '../../shared/hooks/useTonConnect';
import { SecurityService } from '../services/securityService';

export const useAdminAuth = () => {
  const { address } = useTonConnect();
  const [isAdmin, setIsAdmin] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const adminAddress = import.meta.env.VITE_ADMIN_ADDRESS;

  useEffect(() => {
    const checkAdmin = () => {
      const hasPermission = SecurityService.checkAdminPermission(address, adminAddress);
      setIsAdmin(hasPermission);
      
      const debug = SecurityService.getDebugInfo(address, adminAddress);
      setDebugInfo(debug);
    };

    checkAdmin();
  }, [address, adminAddress]);

  return { isAdmin, debugInfo, adminAddress };
};