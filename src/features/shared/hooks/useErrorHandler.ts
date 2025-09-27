// features/shared/hooks/useErrorHandler.ts
import { useState, useCallback } from 'react';
import { ErrorPageProps } from '../types/common.types';

export const useErrorHandler = () => {
  const [error, setError] = useState<ErrorPageProps | null>(null);

  const handleError = useCallback((errorProps: ErrorPageProps) => {
    setError(errorProps);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleNetworkError = useCallback(() => {
    setError({
      code: 0,
      title: 'Network Error',
      message: 'Unable to connect to the server. Please check your internet connection and try again.',
      showHomeButton: true
    });
  }, []);

  const handleServerError = useCallback(() => {
    setError({
      code: 500,
      title: 'Server Error',
      message: 'Something went wrong on our end. Our team has been notified and is working to fix the issue.',
      showHomeButton: true
    });
  }, []);

  const handleUnauthorized = useCallback(() => {
    setError({
      code: 403,
      title: 'Access Denied',
      message: 'You don\'t have permission to access this resource.',
      showHomeButton: true
    });
  }, []);

  const handleNotFound = useCallback(() => {
    setError({
      code: 404,
      title: 'Page Not Found',
      message: 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.',
      showHomeButton: true
    });
  }, []);

  return {
    error,
    setError,
    clearError,
    handleError,
    handleNetworkError,
    handleServerError,
    handleUnauthorized,
    handleNotFound
  };
};