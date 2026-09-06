import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import FilterPanel from '../components/search/FilterPanel';
import ListingGrid from '../components/listings/ListingGrid';
import { Filter as FilterIcon, X } from 'lucide-react';

const categories = [
  { slug: 'grains', name: 'Grains', emoji: '🌾' },
  { slug: 'vegetables', name: 'Vegetables', emoji: '🧅' },
  { slug: 'fruits', name: 'Fruits', emoji: '🍎' },
];

const CategoryListings = () => {
  const { categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();
  
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState([]);

  const currentCategory = categories.find(c => c.slug === categorySlug) || { slug: categorySlug, emoji: '📦', name: categorySlug };

  const filters = {
    category: searchParams.get('category') || (categorySlug !== 'all' ? categorySlug : ''),
    type: searchParams.get('type') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    location: searchParams.get('location') || '',
    sort: searchParams.get('sort') || 'newest'
  };

  const updateFilters = (newFilters) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params);
  };

  useEffect(() => {
    setLoading(true);
    // Mock API fetch based on filters
    setTimeout(() => {
      setListings([
        { id: 1, title: 'Sample Listing 1', price: 1500, unit: 'quintal', categorySlug: filters.category || 'grains', categoryEmoji: currentCategory.emoji, location: 'Pune', quantity: 10, timeAgo: '1h ago', offerCount: 2 },
        { id: 2, title: 'Sample Listing 2', price: 2500, unit: 'quintal', categorySlug: filters.category || 'grains', categoryEmoji: currentCategory.emoji, location: 'Mumbai', quantity: 5, timeAgo: '3h ago', offerCount: 0 },
      ]);
      setLoading(false);
    }, 800);
  }, [searchParams, categorySlug]);

  return (
    <div className="min-h-screen bg-earth-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <span className="text-4xl drop-shadow-sm">{currentCategory.emoji}</span>
              {categorySlug === 'all' ? t('marketplace.allListings') : t(`categories.${categorySlug}`, currentCategory.name)}
            </h1>
            <p className="text-gray-500 mt-1 font-medium">{listings.length} {t('common.resultsFound')}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <select 
              value={filters.sort}
              onChange={(e) => updateFilters({ ...filters, sort: e.target.value })}
              className="bg-white border-2 border-gray-200 text-gray-700 py-2.5 px-4 rounded-xl font-medium focus:outline-none focus:border-primary-500 shadow-sm"
            >
              <option value="newest">{t('sort.newest')}</option>
              <option value="price_asc">{t('sort.priceLowHigh')}</option>
              <option value="price_desc">{t('sort.priceHighLow')}</option>
              <option value="popular">{t('sort.popular')}</option>
            </select>
            
            <button 
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden bg-earth-100 p-2.5 rounded-xl border border-earth-200 text-earth-800"
            >
              <FilterIcon size={24} />
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <FilterPanel filters={filters} onChange={updateFilters} categories={categories} />
          </div>

          {/* Mobile Filters Overlay */}
          {showMobileFilters && (
            <div className="fixed inset-0 z-50 flex lg:hidden">
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)}></div>
              <div className="relative ml-auto w-full max-w-xs bg-white h-full overflow-y-auto shadow-2xl p-4">
                <button 
                  onClick={() => setShowMobileFilters(false)}
                  className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full text-gray-600"
                >
                  <X size={24} />
                </button>
                <div className="mt-12">
                  <FilterPanel filters={filters} onChange={updateFilters} categories={categories} />
                </div>
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <div className="flex-1">
            <ListingGrid listings={listings} loading={loading} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default CategoryListings;
