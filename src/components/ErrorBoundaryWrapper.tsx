// src/components/ErrorBoundaryWrapper.tsx
import React from 'react';
import { useTheme } from '@mui/material';
import { ErrorBoundary } from './ErrorBoundary';

interface ErrorBoundaryWrapperProps {
  children: React.ReactNode;
}

const ErrorBoundaryWrapper: React.FC<ErrorBoundaryWrapperProps> = ({ children }) => {
  const theme = useTheme();
  
  return (
    <ErrorBoundary theme={theme}>
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundaryWrapper;