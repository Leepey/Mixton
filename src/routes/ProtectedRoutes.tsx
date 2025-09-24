// src/routes/ProtectedRoutes.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTonConnect } from '../features/shared/hooks/useTonConnect';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  adminOnly = false 
}) => {
  const { isAuthenticated } = useAuth();
  const { connected, address } = useTonConnect();
  const adminAddress = import.meta.env.VITE_ADMIN_ADDRESS;

  if (!isAuthenticated || !connected) {
    return <Navigate to="/" replace />;
  }

  if (adminOnly && address !== adminAddress) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;