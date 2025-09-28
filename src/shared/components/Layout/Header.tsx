// src/shared/components/Layout/Header.tsx
import React from 'react';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={`header ${className || ''}`}>
      <div className="header-content">
        <h1>Mixton</h1>
        <nav>
          {/* Навигация будет добавлена позже */}
        </nav>
      </div>
    </header>
  );
};

export default Header;