import React from 'react';
import Button from './Button';

const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-white rounded-2xl border border-dashed border-gray-300">
      {Icon && (
        <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mb-6">
          <Icon className="w-10 h-10 text-primary-600" />
        </div>
      )}
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-md mb-8">{description}</p>
      
      {action && (
        <Button 
          variant={action.variant || 'primary'} 
          onClick={action.onClick}
          icon={action.icon}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
