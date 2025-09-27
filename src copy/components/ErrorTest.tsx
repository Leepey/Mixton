// src/components/ErrorTest.tsx
import React from 'react';
import { Button } from '@mui/material';

const ErrorTest: React.FC = () => {
  const throwError = () => {
    throw new Error('Это тестовая ошибка для проверки ErrorBoundary');
  };

  const throwAsyncError = async () => {
    await Promise.resolve();
    throw new Error('Это асинхронная тестовая ошибка');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Тестирование ErrorBoundary</h2>
      <Button
        variant="contained"
        color="error"
        onClick={throwError}
        style={{ marginRight: '10px' }}
      >
        Вызвать синхронную ошибку
      </Button>
      <Button
        variant="contained"
        color="warning"
        onClick={throwAsyncError}
      >
        Вызвать асинхронную ошибку
      </Button>
    </div>
  );
};

export default ErrorTest;