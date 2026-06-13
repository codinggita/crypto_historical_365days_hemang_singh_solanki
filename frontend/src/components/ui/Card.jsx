import React from 'react';
import './Card.css';

const Card = ({ children, className = '', isInteractive = false, colorStripe, ...props }) => {
  return (
    <div 
      className={`card ${isInteractive ? 'card-interactive' : ''} ${className}`}
      style={colorStripe ? { borderLeft: `4px solid ${colorStripe}` } : {}}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
