import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from '../components/search/SearchBar';
import ListingGrid from '../components/listings/ListingGrid';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { getListings } from '../services/listings';

const categories = [
  { slug: 'grains', nameKey: 'categories.cereals', name: 'Grains & Cereals', emoji: '🌾' },
  { slug: 'vegetables', nameKey: 'categories.vegetables', name: 'Vegetables', emoji: '🧅' },
  { slug: 'fruits', nameKey: 'categories.fruits', name: 'Fruits', emoji: '🍎' },
  { slug: 'pulses', nameKey: 'categories.pulses', name: 'Pulses & Dals', emoji: '🫘' },
  { slug: 'spices', nameKey: 'categories.spices', name: 'Spices', emoji: '🌶️' },
  { slug: 'seeds', nameKey: 'categories.seeds', name: 'Seeds & Plants', emoji: '🌱' },
  { slug: 'machinery', nameKey: 'categories.machinery', name: 'Machinery', emoji: '🚜' },
  { slug: 'others', nameKey: 'categories.materials', name: 'Others', emoji: '📦' }
];
const categoryPresentation = {
  cereals: ['grains', '🌾'], grains: ['grains', '🌾'], vegetables: ['vegetables', '🧅'],
  fruits: ['fruits', '🍎'], pulses: ['pulses', '🫘'], spices: ['spices', '🌶️'],
  seeds: ['seeds', '🌱'], machinery: ['machinery', '🚜'],
};

const Marketplace = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [featuredListings, setFeaturedListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let cancelled = false;
    getListings({ limit: 4, sort: 'popular' })
      .then(({ data }) => {
        if (!cancelled) setFeaturedListings((data.data.listings || []).map((listing) => {
          const location = listing.location || {};
          const [categorySlug, categoryEmoji] = categoryPresentation[listing.subCategory] || categoryPresentation[listing.category] || ['others', '📦'];
          return { ...listing, id: listing._id, categorySlug, categoryEmoji, imageUrl: listing.images?.[0],
            location: [location.village, location.district, location.state].filter(Boolean).join(', '),
            offerCount: listing.offersCount || 0, timeAgo: new Date(listing.createdAt).toLocaleDateString() };
        }));
      })
      .catch(() => { if (!cancelled) setLoadError(t('common.loadListingsError', 'Could not load listings. Please try again.')); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [t]);

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
            {t('marketplace.heroTitle', 'Agricultural Marketplace')}
          </h1>
          <p className="text-xl md:text-2xl text-primary-100 mb-10 max-w-2xl mx-auto font-medium">
            {t('marketplace.heroSubtitle', 'Discover fresh produce, equipment rentals, and fair reference prices.')}
          </p>
          
          <div className="max-w-2xl mx-auto shadow-2xl rounded-full">
            <SearchBar 
              onSearch={handleSearch} 
              placeholder={t('marketplace.searchPlaceholder', 'Search crops, grains, machinery...')}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20 space-y-12">
        {/* Categories Grid */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('marketplace.exploreCategories', 'Explore Categories')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((cat) => (
              <Link 
                key={cat.slug} 
                to={`/marketplace/${cat.slug}`}
                className="group flex flex-col items-center justify-center p-6 rounded-2xl bg-earth-50 hover:bg-primary-50 border-2 border-transparent hover:border-primary-200 transition-all duration-300 text-center hover:-translate-y-1"
              >
                <span className="text-5xl md:text-6xl mb-4 group-hover:scale-110 transition-transform duration-300 drop-shadow-md">{cat.emoji}</span>
                <span className="font-bold text-gray-800 group-hover:text-primary-700 md:text-lg">{t(cat.nameKey, cat.name)}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Listings */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="text-accent-600" />
              {t('marketplace.featuredListings', 'Featured Listings')}
            </h2>
            <Link to="/marketplace/all" className="flex items-center gap-1 text-primary-600 font-bold hover:text-primary-700">
              {t('common.viewAll', 'View All')} <ArrowRight size={20} />
            </Link>
          </div>
          
          {loadError && <p role="alert" className="mb-4 rounded-xl bg-red-50 p-4 text-red-700">{loadError}</p>}
          <ListingGrid listings={featuredListings} loading={loading} />
        </div>
      </main>
    </div>
  );
};

export default Marketplace;
