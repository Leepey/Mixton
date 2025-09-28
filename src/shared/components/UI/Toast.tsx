// src/shared/components/UI/Toast.tsx
import React from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  onClose?: () => void;
  className?: string;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  onClose,
  className = ''
}) => {
  return (
    <div className={`toast toast--${type} ${className}`}>
      <span className="toast-message">{message}</span>
      {onClose && (
        <button className="toast-close" onClick={onClose}>
          &times;
        </button>
      )}
    </div>
  );
};

export default Toast;