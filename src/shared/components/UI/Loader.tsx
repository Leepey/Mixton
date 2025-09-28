// src/shared/components/UI/Loader.tsx
import React from 'react';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  size = 'medium',
  className = ''
}) => {
  return (
    <div className={`loader loader--${size} ${className}`}>
      <div className="loader-spinner"></div>
    </div>
  );
};

export default Loader;