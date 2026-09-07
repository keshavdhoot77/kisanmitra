import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp, MapPin, Filter } from 'lucide-react';

const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border-b border-gray-100 py-4 last:border-0">
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left font-semibold text-gray-900 mb-2"
      >
        <span>{title}</span>
        {isOpen ? <ChevronUp size={20} className="text-gray-500" /> : <ChevronDown size={20} className="text-gray-500" />}
      </button>
      {isOpen && <div className="mt-3 space-y-2 animate-in fade-in slide-in-from-top-2">{children}</div>}
    </div>
  );
};

const FilterPanel = ({ filters = {}, onChange, categories = [] }) => {
  const { t } = useTranslation();
  
  const handleFilterChange = (key, value) => {
    if (onChange) {
      onChange({ ...filters, [key]: value });
    }
  };

  const handleClear = () => {
    if (onChange) {
      onChange({});
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-24">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900">
          <Filter size={20} className="text-primary-600" />
          {t('filters.title', 'Filters')}
        </h2>
        <button 
          onClick={handleClear}
          className="text-sm text-primary-600 font-semibold hover:text-primary-700"
        >
          {t('filters.clearAll', 'Clear All')}
        </button>
      </div>

      <div className="space-y-1">
        <FilterSection title={t('filters.category', 'Category')}>
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-earth-50 cursor-pointer transition-colors">
              <input 
                type="radio" 
                name="category" 
                checked={!filters.category}
                onChange={() => handleFilterChange('category', '')}
                className="w-4 h-4 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-gray-700">{t('filters.allCategories', 'All Categories')}</span>
            </label>
            {categories.map((cat) => (
              <label key={cat.slug} className="flex items-center gap-3 p-2 rounded-lg hover:bg-earth-50 cursor-pointer transition-colors">
                <input 
                  type="radio" 
                  name="category" 
                  value={cat.slug}
                  checked={filters.category === cat.slug}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-lg mr-1">{cat.emoji}</span>
                <span className="text-gray-700">{cat.name}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        <FilterSection title={t('filters.transactionType', 'Transaction Type')}>
          <div className="space-y-2">
            {[
              { id: 'all', label: 'All Types' },
              { id: 'sell', label: 'Buy Produce' },
              { id: 'rent', label: 'Rentals' },
              { id: 'services', label: 'Services' },
            ].map((type) => (
              <label key={type.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-earth-50 cursor-pointer transition-colors">
                <input 
                  type="radio" 
                  name="type" 
                  value={type.id}
                  checked={(filters.type || 'all') === type.id}
                  onChange={(e) => handleFilterChange('type', e.target.value === 'all' ? '' : e.target.value)}
                  className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-gray-700">{type.label}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        <FilterSection title={t('filters.priceRange', 'Price Range (₹)')}>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
              <input 
                type="number" 
                placeholder={t('filters.min', 'Min')} 
                value={filters.minPrice || ''}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="w-full pl-8 pr-3 py-2 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-sm"
              />
            </div>
            <span className="text-gray-400">-</span>
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
              <input 
                type="number" 
                placeholder={t('filters.max', 'Max')} 
                value={filters.maxPrice || ''}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="w-full pl-8 pr-3 py-2 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-sm"
              />
            </div>
          </div>
        </FilterSection>

        <FilterSection title={t('filters.location', 'Location')}>
          <div className="relative">
            <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder={t('filters.enterLocation', 'Enter District or State')} 
              value={filters.location || ''}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
            />
          </div>
        </FilterSection>
      </div>

      <button className="w-full mt-6 bg-primary-600 hover:bg-primary-700 text-white rounded-xl px-6 py-3 font-semibold text-lg transition-colors shadow-sm">
        {t('filters.apply', 'Apply Filters')}
      </button>
    </div>
  );
};

export default FilterPanel;
