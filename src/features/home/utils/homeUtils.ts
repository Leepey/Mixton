// features/home/utils/homeUtils.ts
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

export const getPoolColor = (poolId: string): string => {
  // Простая хеш-функция для генерации цвета на основе ID пула
  let hash = 0;
  for (let i = 0; i < poolId.length; i++) {
    hash = poolId.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const colors = [
    '#00BCD4', // Cyan
    '#8BC34A', // Light Green
    '#2196F3', // Blue
    '#FFC107', // Amber
    '#9C27B0', // Purple
    '#FF5722', // Deep Orange
  ];
  
  return colors[Math.abs(hash) % colors.length];
};