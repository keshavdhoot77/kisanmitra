import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-earth-50">
      <div className="text-center space-y-6 max-w-md">
        <div className="relative inline-block">
          <h1 className="text-9xl font-black text-primary-200">404</h1>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl">
            🚜
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900">
          {t('notFound.title', 'Page Not Found')}
        </h2>
        
        <p className="text-lg text-gray-600">
          {t('notFound.description', "Oops! It looks like you've wandered off the farm. The page you're looking for doesn't exist.")}
        </p>
        
        <div className="pt-4">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl px-8 py-4 font-semibold text-lg transition-colors shadow-sm hover:shadow-md"
          >
            <Home className="w-5 h-5" />
            {t('notFound.goHome', 'Go Back Home')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
