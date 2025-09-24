// src/features/auth/components/LoginForm.tsx
import React from 'react';
import { NeonCard } from '@/features/shared/components/ui/cards/NeonCard';
import { MixButton } from '@/features/shared/components/ui/buttons/MixButton';

export const LoginForm = () => {
  return (
    <NeonCard title="Login">
      <form>
        {/* Форма входа */}
        <MixButton>Login</MixButton>
      </form>
    </NeonCard>
  );
};