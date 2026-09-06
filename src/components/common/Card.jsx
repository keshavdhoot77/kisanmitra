import React from 'react';

const Card = ({ children, className = '', onClick, hover = false, padding = 'md', ...rest }) => {
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  const classes = `
    bg-white rounded-2xl shadow-sm border border-gray-100
    ${paddings[padding]}
    ${hover ? 'hover:shadow-md transition-shadow cursor-pointer' : ''}
    ${className}
  `;

  return (
    <div 
      className={classes} 
      onClick={onClick}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Card;
