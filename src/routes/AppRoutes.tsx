// src/routes/AppRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicRoutes } from './PublicRoutes';
import { ProtectedRoutes } from './ProtectedRoutes';
import { useAuthContext } from '../features/auth';

export const AppRoutes: React.FC = () => {
  const { user } = useAuthContext();

  return (
    <Routes>
      <Route path="/auth/*" element={<PublicRoutes />} />
      <Route 
        path="/*" 
        element={user.connected ? <ProtectedRoutes /> : <Navigate to="/auth" replace />} 
      />
    </Routes>
  );
};