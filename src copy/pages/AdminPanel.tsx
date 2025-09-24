// src/pages/AdminPanel.tsx
import React from 'react';
import { useAdminAuth } from '@/features/admin/hooks/useAdminAuth';
import { AdminPanelLayout } from '@/features/admin/components/AdminPanelLayout';

const AdminPanel: React.FC = () => {
  const { isAdmin, loading } = useAdminAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column'
      }}>
        <h1>Access Denied</h1>
        <p>You don't have permission to access this page.</p>
      </div>
    );
  }

  return <AdminPanelLayout />;
};

export default AdminPanel;