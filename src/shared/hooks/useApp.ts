import { useState, useEffect } from 'react';

export const useApp = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Инициализация приложения
    const initializeApp = async () => {
      try {
        setIsLoading(true);
        // Здесь будет логика инициализации
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  return {
    isLoading,
    error,
    clearError: () => setError(null)
  };
};