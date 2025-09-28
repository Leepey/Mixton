// src/features/shared/components/ui/typography/NeonText.tsx
import React from 'react';
import { Typography, type TypographyProps } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface NeonTextProps extends Omit<TypographyProps, 'color'> {
  // Переопределяем color как строку, а не как цвет из палитры
  color?: string;
  glowColor?: string;
  glowIntensity?: number;
}

export const NeonText: React.FC<NeonTextProps> = ({
  color,
  glowColor,
  glowIntensity = 1,
  variant,
  component,
  sx,
  children,
  ...props
}) => {
  const theme = useTheme();
  
  // Определяем цвет свечения
  const neonColor = color || theme.palette.primary.main;
  const glow = glowColor || neonColor;
  
  // Создаем объект со стилями, объединяя переданные стили и стили неонового свечения
  const textStyle = {
    fontWeight: 'bold' as const,
    textShadow: `0 0 ${5 * glowIntensity}px ${glow}, 0 0 ${10 * glowIntensity}px ${glow}, 0 0 ${15 * glowIntensity}px ${glow}`,
    color: neonColor,
    ...(sx || {}),
  };
  
  return (
    <Typography
      variant={variant}
      component={component as React.ElementType}
      sx={textStyle}
      {...props}
    >
      {children}
    </Typography>
  );
};