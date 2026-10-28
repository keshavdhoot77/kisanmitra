import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import FilterPanel from '../components/search/FilterPanel';
import ListingGrid from '../components/listings/ListingGrid';
import { Filter as FilterIcon, X } from 'lucide-react';
import { getListings } from '../services/listings';

const categories = [
  { slug: 'grains', nameKey: 'categories.cereals', name: 'Grains & Cereals', emoji: '🌾', category: 'agricultural-produce', subCategory: 'cereals' },
  { slug: 'vegetables', nameKey: 'categories.vegetables', name: 'Vegetables', emoji: '🧅', category: 'agricultural-produce', subCategory: 'vegetables' },
  { slug: 'fruits', nameKey: 'categories.fruits', name: 'Fruits', emoji: '🍎', category: 'agricultural-produce', subCategory: 'fruits' },
  { slug: 'pulses', nameKey: 'categories.pulses', name: 'Pulses & Dals', emoji: '🫘', category: 'agricultural-produce', subCategory: 'pulses' },
  { slug: 'spices', nameKey: 'categories.spices', name: 'Spices', emoji: '🌶️', category: 'agricultural-produce', subCategory: 'spices' },
  { slug: 'seeds', nameKey: 'categories.seeds', name: 'Seeds & Plants', emoji: '🌱', category: 'agri-inputs', subCategory: 'seeds' },
  { slug: 'machinery', nameKey: 'categories.machinery', name: 'Machinery', emoji: '🚜', category: 'machinery' },
  { slug: 'others', nameKey: 'categories.materials', name: 'Others', emoji: '📦' },
];

const CategoryListings = () => {
  const { categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();
  
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState([]);
  const [loadError, setLoadError] = useState('');

  const currentCategory = categories.find(c => c.slug === categorySlug) || { slug: categorySlug, emoji: '📦', name: categorySlug };

  const filters = {
    category: searchParams.get('category') || (categorySlug !== 'all' && categorySlug !== 'search' ? categorySlug : ''),
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
    let cancelled = false;
    const loadListings = async () => {
      setLoading(true);
      setLoadError('');
      const selectedCategory = categories.find((category) => category.slug === filters.category);
      const params = {
        ...((selectedCategory?.category) ? { category: selectedCategory.category } : {}),
        ...(selectedCategory?.subCategory ? { subCategory: selectedCategory.subCategory } : {}),
        ...(filters.type ? { transactionType: filters.type } : {}),
        ...(filters.minPrice ? { minPrice: filters.minPrice } : {}),
        ...(filters.maxPrice ? { maxPrice: filters.maxPrice } : {}),
        ...(filters.location ? { state: filters.location } : {}),
        ...(filters.sort ? { sort: filters.sort } : {}),
        ...(categorySlug === 'search' && searchParams.get('q') ? { search: searchParams.get('q') } : {}),
      };

      try {
        const response = await getListings(params);
        const apiListings = response.data.data.listings || [];
        if (!cancelled) {
          setListings(apiListings.map((listing) => {
            const category = categories.find((item) => item.category === listing.category && (!item.subCategory || item.subCategory === listing.subCategory));
            const location = listing.location || {};
            return {
              ...listing,
              id: listing._id,
              categorySlug: category?.slug || listing.category,
              categoryEmoji: category?.emoji || currentCategory.emoji,
              imageUrl: listing.images?.[0],
              location: [location.village, location.taluka, location.district, location.state].filter(Boolean).join(', '),
              offerCount: listing.offersCount || 0,
              timeAgo: listing.createdAt ? new Date(listing.createdAt).toLocaleDateString() : '',
            };
          }));
        }
      } catch (_error) {
        if (!cancelled) {
          setListings([]);
          setLoadError(t('common.loadListingsError', 'Could not load listings. Please try again.'));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadListings();
    return () => { cancelled = true; };
  }, [searchParams, categorySlug, t]);

  return (
    <div className="min-h-screen bg-earth-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <span className="text-4xl drop-shadow-sm">{currentCategory.emoji}</span>
              {categorySlug === 'all' ? t('marketplace.allListings', 'All Listings') : t(currentCategory.nameKey || `categories.${categorySlug}`, currentCategory.name)}
            </h1>
            <p className="text-gray-500 mt-1 font-medium">{listings.length} {t('common.resultsFound', 'results found')}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <select 
              value={filters.sort}
              onChange={(e) => updateFilters({ ...filters, sort: e.target.value })}
              className="bg-white border-2 border-gray-200 text-gray-700 py-2.5 px-4 rounded-xl font-medium focus:outline-none focus:border-primary-500 shadow-sm"
            >
              <option value="newest">{t('sort.newest', 'Newest First')}</option>
              <option value="price_asc">{t('sort.priceLowHigh', 'Price: Low to High')}</option>
              <option value="price_desc">{t('sort.priceHighLow', 'Price: High to Low')}</option>
              <option value="popular">{t('sort.popular', 'Most Popular')}</option>
            </select>
            
            <button 
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              aria-label={t('filters.title', 'Toggle filters')}
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
            {loadError && <p role="alert" className="mb-4 rounded-xl bg-red-50 p-4 text-red-700">{loadError}</p>}
            <ListingGrid listings={listings} loading={loading} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default CategoryListings;
