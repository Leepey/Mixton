// src/shared/components/Layout/Footer.tsx
import React from 'react';

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer className={`footer ${className || ''}`}>
      <div className="footer-content">
        <p>&copy; 2025 Mixton. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;