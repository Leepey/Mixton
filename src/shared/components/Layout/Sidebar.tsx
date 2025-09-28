// src/shared/components/Layout/Sidebar.tsx
import React from 'react';

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  return (
    <aside className={`sidebar ${className || ''}`}>
      <div className="sidebar-content">
        <h2>Menu</h2>
        <ul>
          {/* Меню будет добавлено позже */}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;