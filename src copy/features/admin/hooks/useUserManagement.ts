import { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import type { AdminUser } from '../types/admin.types';

export const useUserManagement = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId: string, status: AdminUser['status']) => {
    setUpdating(true);
    try {
      await adminService.updateUserStatus(userId, status);
      setUsers(prev => 
        prev.map(user => 
          user.id === userId ? { ...user, status } : user
        )
      );
    } catch (error) {
      console.error('Failed to update user status:', error);
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    updating,
    updateUserStatus,
    refreshUsers: fetchUsers,
  };
};