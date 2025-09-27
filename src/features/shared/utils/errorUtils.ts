// features/shared/utils/errorUtils.ts
import { ErrorPageProps } from '../types/common.types';

export const getErrorPropsFromStatus = (status: number): ErrorPageProps => {
  switch (status) {
    case 400:
      return {
        code: 400,
        title: 'Bad Request',
        message: 'The request was invalid or cannot be served.',
        showHomeButton: true
      };
    case 401:
      return {
        code: 401,
        title: 'Unauthorized',
        message: 'Authentication is required to access this resource.',
        showHomeButton: true
      };
    case 403:
      return {
        code: 403,
        title: 'Forbidden',
        message: 'You don\'t have permission to access this resource.',
        showHomeButton: true
      };
    case 404:
      return {
        code: 404,
        title: 'Page Not Found',
        message: 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.',
        showHomeButton: true
      };
    case 500:
      return {
        code: 500,
        title: 'Server Error',
        message: 'Something went wrong on our end. Our team has been notified and is working to fix the issue.',
        showHomeButton: true
      };
    case 502:
    case 503:
    case 504:
      return {
        code: 0,
        title: 'Service Unavailable',
        message: 'The service is temporarily unavailable. Please try again later.',
        showHomeButton: true
      };
    default:
      return {
        code: 0,
        title: 'Unknown Error',
        message: 'An unexpected error occurred.',
        showHomeButton: true
      };
  }
};

export const isNetworkError = (error: any): boolean => {
  return (
    error.name === 'NetworkError' ||
    error.message?.includes('Network Error') ||
    error.message?.includes('Failed to fetch') ||
    !navigator.onLine
  );
};

export const getErrorMessage = (error: any): string => {
  if (!error) return 'An unknown error occurred';
  
  if (typeof error === 'string') return error;
  
  if (error.message) return error.message;
  
  if (error.statusText) return error.statusText;
  
  return 'An unexpected error occurred';
};