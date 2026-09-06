import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SearchBar = ({ onSearch, placeholder, className = '' }) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    if (onSearch) onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative flex items-center w-full">
        <div className="absolute left-4 text-gray-400 pointer-events-none">
          <Search size={24} />
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder || t('common.searchPlaceholder')}
          className="w-full py-4 pl-12 pr-12 text-lg bg-white border-2 border-gray-200 rounded-full shadow-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all duration-200"
        />
        
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>
      
      {/* Optional: Add a button for mobile if needed, but Enter usually suffices */}
      <button 
        type="submit" 
        className="hidden md:block absolute right-2 top-2 bottom-2 bg-primary-600 hover:bg-primary-700 text-white px-6 rounded-full font-semibold transition-colors shadow-sm"
      >
        {t('common.search')}
      </button>
    </form>
  );
};

export default SearchBar;
