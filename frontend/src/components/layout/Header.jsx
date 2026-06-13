import React from 'react';
import './Header.css';

const Header = ({ title }) => {
  return (
    <header className="header">
      <h2 className="header-title">{title}</h2>
      <div className="header-actions">
        {/* Placeholder for global search or user profile */}
        <div className="header-avatar">U</div>
      </div>
    </header>
  );
};

export default Header;
