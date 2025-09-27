import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { isAdmin, isModerator } from '../utils/authUtils';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'moderator' | 'admin';
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole = 'user',
  redirectTo = '/login',
  fallback,
}) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Показываем загрузку
  if (loading) {
    return (
      fallback || (
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: '100vh',
            background: `linear-gradient(135deg, #0a192f 0%, #000000 100%)`,
            color: 'text.primary',
          }}
        >
          <CircularProgress size={48} sx={{ mb: 2 }} />
          <Typography variant="h6">
            Checking authentication...
          </Typography>
        </Box>
      )
    );
  }

  // Если пользователь не аутентифицирован
  if (!isAuthenticated || !user) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // Проверка роли
  let hasRequiredRole = false;
  
  switch (requiredRole) {
    case 'admin':
      hasRequiredRole = isAdmin(user);
      break;
    case 'moderator':
      hasRequiredRole = isModerator(user);
      break;
    case 'user':
    default:
      hasRequiredRole = true; // Все аутентифицированные пользователи имеют роль 'user'
      break;
  }

  if (!hasRequiredRole) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '100vh',
          background: `linear-gradient(135deg, #0a192f 0%, #000000 100%)`,
          color: 'text.primary',
          p: 3,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 2, textAlign: 'center' }}>
          Access Denied
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, textAlign: 'center', maxWidth: 400 }}>
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
          Required role: {requiredRole}<br />
          Your role: {user.role}
        </Typography>
      </Box>
    );
  }

  // Если все проверки пройдены, рендерим дочерние компоненты
  return <>{children}</>;
};

// Удобные обертки для разных ролей
export const AdminRoute: React.FC<Omit<ProtectedRouteProps, 'requiredRole'>> = (props) => (
  <ProtectedRoute {...props} requiredRole="admin" />
);

export const ModeratorRoute: React.FC<Omit<ProtectedRouteProps, 'requiredRole'>> = (props) => (
  <ProtectedRoute {...props} requiredRole="moderator" />
);

export const UserRoute: React.FC<Omit<ProtectedRouteProps, 'requiredRole'>> = (props) => (
  <ProtectedRoute {...props} requiredRole="user" />
);