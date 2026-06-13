import React from 'react';
import './Chip.css';

const Chip = ({ children, variant = 'neutral', className = '' }) => {
  return (
    <span className={`chip chip-${variant} ${className}`}>
      {children}
    </span>
  );
};

export default Chip;
