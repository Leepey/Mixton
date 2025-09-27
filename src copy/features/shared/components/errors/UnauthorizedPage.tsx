// features/shared/components/errors/UnauthorizedPage.tsx
import React from 'react';
import { ErrorPage } from '../ui/ErrorPage';
import { useNavigate } from 'react-router-dom';

export const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <ErrorPage
      code={403}
      title="Access Denied"
      message="You don't have permission to access this resource. Please contact your administrator if you believe this is an error."
      showHomeButton={true}
      customAction={{
        label: 'Go to Login',
        onClick: () => navigate('/auth')
      }}
    />
  );
};