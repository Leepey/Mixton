// features/shared/components/errors/NotFoundPage.tsx
import React from 'react';
import { ErrorPage } from '../ui/ErrorPage';

export const NotFoundPage: React.FC = () => {
  return (
    <ErrorPage
      code={404}
      title="Page Not Found"
      message="The page you are looking for might have been removed, had its name changed, or is temporarily unavailable."
      showHomeButton={true}
    />
  );
};