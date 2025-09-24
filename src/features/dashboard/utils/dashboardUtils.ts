// src/features/dashboard/utils/dashboardUtils.ts
// Заглушка для будущих утилит
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString();
};