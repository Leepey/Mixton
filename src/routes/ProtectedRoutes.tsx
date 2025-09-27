// src/routes/ProtectedRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuthContext } from '../features/auth';
import { ErrorBoundary } from '../features/shared/components/ErrorBoundary';
import { MainLayout } from '../features/shared/components/ui/layout/MainLayout';
import Dashboard from '../pages/Dashboard';
import AdminPanel from '../pages/AdminPanel';
import NotFound from '../pages/NotFound';
import Unauthorized from '../pages/Unauthorized';
import ServerError from '../pages/ServerError';

/**
 * Защищенные маршруты - требуют аутентификации
 */
export const ProtectedRoutes: React.FC = () => {
  const { user, loading } = useAuthContext();

  // Показываем индикатор загрузки при проверке аутентификации
  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '100vh',
          background: `linear-gradient(135deg, #0a192f 0%, #000000 100%)`
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={60} thickness={4} sx={{ mb: 3 }} />
            <Typography variant="h6" color="text.secondary">
              Loading...
            </Typography>
          </Box>
        </motion.div>
      </Box>
    );
  }

  // Если пользователь не аутентифицирован, перенаправляем на страницу входа
  if (!user.connected) {
    return <Navigate to="/auth/login" replace state={{ from: location.pathname }} />;
  }

  return (
    <ErrorBoundary>
      <MainLayout>
        <Box sx={{ minHeight: '100vh' }}>
          <Routes>
            {/* Дашборд пользователя */}
            <Route 
              path="/dashboard" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Dashboard />
                </motion.div>
              }
            />
            
            {/* Админ панель */}
            <Route 
              path="/admin/*" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <AdminPanel />
                </motion.div>
              }
            />
            
            {/* Профиль пользователя */}
            <Route 
              path="/profile" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Здесь будет компонент профиля */}
                  <Box sx={{ p: 4 }}>
                    <Typography variant="h4">User Profile</Typography>
                  </Box>
                </motion.div>
              }
            />
            
            {/* Настройки пользователя */}
            <Route 
              path="/settings" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Здесь будет компонент настроек */}
                  <Box sx={{ p: 4 }}>
                    <Typography variant="h4">User Settings</Typography>
                  </Box>
                </motion.div>
              }
            />
            
            {/* История транзакций */}
            <Route 
              path="/transactions" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Здесь будет компонент истории транзакций */}
                  <Box sx={{ p: 4 }}>
                    <Typography variant="h4">Transaction History</Typography>
                  </Box>
                </motion.div>
              }
            />
            
            {/* Статистика и аналитика */}
            <Route 
              path="/analytics" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Здесь будет компонент аналитики */}
                  <Box sx={{ p: 4 }}>
                    <Typography variant="h4">Analytics</Typography>
                  </Box>
                </motion.div>
              }
            />
            
            {/* Помощь и поддержка */}
            <Route 
              path="/support" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Здесь будет компонент поддержки */}
                  <Box sx={{ p: 4 }}>
                    <Typography variant="h4">Support</Typography>
                  </Box>
                </motion.div>
              }
            />
            
            {/* API документация */}
            <Route 
              path="/api-docs" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Здесь будет компонент документации API */}
                  <Box sx={{ p: 4 }}>
                    <Typography variant="h4">API Documentation</Typography>
                  </Box>
                </motion.div>
              }
            />
            
            {/* Страница "Доступ запрещен" (защищенная версия) */}
            <Route 
              path="/unauthorized" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Unauthorized />
                </motion.div>
              }
            />
            
            {/* Страница ошибки сервера (защищенная версия) */}
            <Route 
              path="/server-error" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <ServerError />
                </motion.div>
              }
            />
            
            {/* Страница не найдена */}
            <Route 
              path="*" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <NotFound />
                </motion.div>
              }
            />
          </Routes>
        </Box>
      </MainLayout>
    </ErrorBoundary>
  );
};