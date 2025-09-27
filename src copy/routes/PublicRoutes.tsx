// src/routes/PublicRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Box, Typography } from '@mui/material';
import { useAuthContext } from '../features/auth';
import { ErrorBoundary } from '../features/shared/components/ErrorBoundary';
import { MainLayout } from '../features/shared/components/ui/layout/MainLayout';
import { LoginPage, RegisterPage, ForgotPasswordPage } from '../features/auth/components/PublicAuthPages';
import Home from '../pages/Home';
import About from '../pages/About';
import NotFound from '../pages/NotFound';
import Unauthorized from '../pages/Unauthorized';
import ServerError from '../pages/ServerError';

export const PublicRoutes: React.FC = () => {
  const { user } = useAuthContext();

  // Если пользователь уже аутентифицирован, перенаправляем на дашборд
  if (user.connected) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <ErrorBoundary>
      <MainLayout>
        <Box sx={{ minHeight: '100vh' }}>
          <Routes>
            {/* Главная страница */}
            <Route 
              path="/" 
              element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Home />
                </motion.div>
              }
            />
            
            {/* Страница "О нас" */}
            <Route 
              path="/about" 
              element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <About />
                </motion.div>
              }
            />
            
            {/* Страница входа */}
            <Route 
              path="/auth/login" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <LoginPage />
                </motion.div>
              }
            />
            
            {/* Страница регистрации */}
            <Route 
              path="/auth/register" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <RegisterPage />
                </motion.div>
              }
            />
            
            {/* Страница восстановления пароля */}
            <Route 
              path="/auth/forgot-password" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <ForgotPasswordPage />
                </motion.div>
              }
            />
            
            {/* Публичные страницы с информацией */}
            <Route 
              path="/privacy" 
              element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Box sx={{ p: 4 }}>
                    <Typography variant="h4">Privacy Policy</Typography>
                  </Box>
                </motion.div>
              }
            />
            
            <Route 
              path="/terms" 
              element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Box sx={{ p: 4 }}>
                    <Typography variant="h4">Terms of Service</Typography>
                  </Box>
                </motion.div>
              }
            />
            
            <Route 
              path="/faq" 
              element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Box sx={{ p: 4 }}>
                    <Typography variant="h4">FAQ</Typography>
                  </Box>
                </motion.div>
              }
            />
            
            {/* Страницы ошибок */}
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