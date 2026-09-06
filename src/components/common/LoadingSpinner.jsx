import React from 'react';

const LoadingSpinner = ({ size = 'md', className = '', fullPage = false }) => {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  const spinner = (
    <div className={`
      animate-spin rounded-full border-t-transparent border-primary-600
      ${sizes[size]} ${className}
    `} />
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-white/80 z-50 flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
