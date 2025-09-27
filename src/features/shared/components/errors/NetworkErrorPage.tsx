// features/shared/components/errors/NetworkErrorPage.tsx
import React from 'react';
import { ErrorPage } from '../ui/ErrorPage';

export const NetworkErrorPage: React.FC = () => {
  return (
    <ErrorPage
      code={0}
      title="Network Error"
      message="Unable to connect to the server. Please check your internet connection and try again."
      showHomeButton={true}
    />
  );
};