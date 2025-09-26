// src/components/layout/Layout.tsx
import React, { type ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import Navbar from '../../features/shared/components/ui/layout/Navbar';
import Footer from '../../features/shared/components/ui/layout/Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0e1a 0%, #151a2e 100%)',
      }}
    >
      <Navbar />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 4,
          px: 2,
        }}
      >
        <Outlet />
        {children}
      </Box>
      
      <Footer />
    </Box>
  );
};

export default Layout;