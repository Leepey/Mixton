// features/shared/components/errors/ServerErrorPage.tsx
import React from 'react';
import { ErrorPage } from '../ui/ErrorPage';

export const ServerErrorPage: React.FC = () => {
  return (
    <ErrorPage
      code={500}
      title="Server Error"
      message="Something went wrong on our end. Our team has been notified and is working to fix the issue."
      showHomeButton={true}
    />
  );
};