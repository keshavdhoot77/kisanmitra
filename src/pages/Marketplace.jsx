import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from '../components/search/SearchBar';
import ListingGrid from '../components/listings/ListingGrid';
import { TrendingUp, ArrowRight } from 'lucide-react';

const categories = [
  { slug: 'grains', name: 'Grains & Cereals', emoji: '🌾' },
  { slug: 'vegetables', name: 'Vegetables', emoji: '🧅' },
  { slug: 'fruits', name: 'Fruits', emoji: '🍎' },
  { slug: 'pulses', name: 'Pulses & Dals', emoji: '🫘' },
  { slug: 'spices', name: 'Spices', emoji: '🌶️' },
  { slug: 'seeds', name: 'Seeds & Plants', emoji: '🌱' },
  { slug: 'machinery', name: 'Machinery', emoji: '🚜' },
  { slug: 'others', name: 'Others', emoji: '📦' }
];

const Marketplace = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(false);

  // Mock featured listings
  const featuredListings = [
    { id: 1, title: 'Premium Sharbati Wheat', price: 2800, unit: 'quintal', categorySlug: 'grains', categoryEmoji: '🌾', location: 'Pune, MH', quantity: 50, timeAgo: '2h ago', offerCount: 4 },
    { id: 2, title: 'Fresh Red Onions Export Quality', price: 1800, unit: 'quintal', categorySlug: 'vegetables', categoryEmoji: '🧅', location: 'Nashik, MH', quantity: 100, timeAgo: '5h ago', offerCount: 12 },
    { id: 3, title: 'Organic Alphonso Mangoes', price: 800, unit: 'box', categorySlug: 'fruits', categoryEmoji: '🥭', location: 'Ratnagiri, MH', quantity: 200, timeAgo: '1d ago', offerCount: 8 },
    { id: 4, title: 'Massey Ferguson 241 DI Tractor', price: '4,50,000', unit: 'piece', categorySlug: 'machinery', categoryEmoji: '🚜', location: 'Kolhapur, MH', quantity: 1, timeAgo: '2d ago', offerCount: 2 },
  ];

  const handleSearch = (query) => {
    if (query) {
      navigate(`/marketplace/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="min-h-screen bg-earth-50 pb-12">
      {/* Hero Section */}
      <div className="bg-primary-900 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 pattern-dots text-white"></div>
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            {t('marketplace.heroTitle')}
          </h1>
          <p className="text-xl md:text-2xl text-primary-100 mb-10 max-w-2xl mx-auto font-medium">
            {t('marketplace.heroSubtitle')}
          </p>
          
          <div className="max-w-2xl mx-auto shadow-2xl rounded-full">
            <SearchBar 
              onSearch={handleSearch} 
              placeholder={t('marketplace.searchPlaceholder')}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20 space-y-12">
        {/* Categories Grid */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('marketplace.exploreCategories')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((cat) => (
              <Link 
                key={cat.slug} 
                to={`/marketplace/${cat.slug}`}
                className="group flex flex-col items-center justify-center p-6 rounded-2xl bg-earth-50 hover:bg-primary-50 border-2 border-transparent hover:border-primary-200 transition-all duration-300 text-center hover:-translate-y-1"
              >
                <span className="text-5xl md:text-6xl mb-4 group-hover:scale-110 transition-transform duration-300 drop-shadow-md">{cat.emoji}</span>
                <span className="font-bold text-gray-800 group-hover:text-primary-700 md:text-lg">{t(`categories.${cat.slug}`, cat.name)}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Listings */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="text-accent-600" />
              {t('marketplace.featuredListings')}
            </h2>
            <Link to="/marketplace/all" className="flex items-center gap-1 text-primary-600 font-bold hover:text-primary-700">
              {t('common.viewAll')} <ArrowRight size={20} />
            </Link>
          </div>
          
          <ListingGrid listings={featuredListings} loading={false} />
        </div>
      </main>
    </div>
  );
};

export default Marketplace;
