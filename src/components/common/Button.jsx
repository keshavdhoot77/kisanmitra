import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const Button = ({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  children,
  loading = false,
  disabled = false,
  fullWidth = false,
  className = '',
  ...rest
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 min-h-[48px]';
  
  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500',
    secondary: 'bg-white border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
    accent: 'bg-accent-600 hover:bg-accent-500 text-white focus:ring-accent-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    ghost: 'bg-transparent text-primary-600 hover:bg-primary-50 shadow-none hover:shadow-none focus:ring-primary-500',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const isDisabled = disabled || loading;

  const classes = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
    ${isDisabled ? 'opacity-50 cursor-not-allowed hover:shadow-sm' : ''}
    ${className}
  `;

  return (
    <button className={classes} disabled={isDisabled} {...rest}>
      {loading && <LoadingSpinner size="sm" className="mr-2 text-current" />}
      {!loading && Icon && <Icon className="w-5 h-5 mr-2" />}
      {children}
    </button>
  );
};

export default Button;
