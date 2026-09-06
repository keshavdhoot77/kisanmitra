import React from 'react';

const Input = React.forwardRef(({
  label,
  type = 'text',
  error,
  icon: Icon,
  helperText,
  className = '',
  ...rest
}, ref) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={`
            w-full px-4 py-3 text-lg bg-white border-2 rounded-xl outline-none transition-colors min-h-[48px]
            ${Icon ? 'pl-10' : ''}
            ${error 
              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
              : 'border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200'
            }
          `}
          {...rest}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
