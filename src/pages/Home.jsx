import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ChevronRight, Check } from 'lucide-react';

const categories = [
  { id: 'agricultural-produce', icon: '🌾', count: 1240 },
  { id: 'machinery', icon: '🚜', count: 850 },
  { id: 'materials', icon: '🌍', count: 150 },
  { id: 'transportation', icon: '🚛', count: 210 }
];

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.search.value;
    if (query) {
      navigate(`/marketplace?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="min-h-screen bg-earth-50 flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <span className="text-5xl">🌾</span>
            <h1 className="text-5xl md:text-6xl font-bold">KisanMitra</h1>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold max-w-3xl mx-auto leading-tight">
            {t('hero.tagline', 'Know the Value. Trade Better.')}
          </h2>
          
          <p className="text-xl md:text-2xl text-primary-50 max-w-2xl mx-auto">
            {t('hero.subtitle', 'A multilingual marketplace connecting farmers, buyers, and agricultural services directly.')}
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative mt-8">
            <div className="relative flex items-center">
              <Search className="absolute left-6 text-gray-400 w-6 h-6" />
              <input 
                type="text" 
                name="search"
                placeholder={t('hero.searchPlaceholder', 'Search for products, machinery, or services...')} 
                className="w-full pl-16 pr-6 py-4 rounded-full text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-primary-300 shadow-lg"
              />
              <button type="submit" className="absolute right-2 bg-primary-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-primary-700 transition-colors">
                {t('common.search', 'Search')}
              </button>
            </div>
          </form>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 pt-6">
            <Link to="/marketplace" className="bg-accent-600 hover:bg-accent-500 text-white rounded-xl px-8 py-4 font-semibold text-lg transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
              {t('hero.exploreMarketplace', 'Explore Marketplace')} <ChevronRight className="w-5 h-5" />
            </Link>
            <Link to="/create-listing" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-700 rounded-xl px-8 py-4 font-semibold text-lg transition-colors flex items-center justify-center">
              {t('hero.listProduct', 'List Your Product')}
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
            {t('howItWorks.title', 'How It Works')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: '📋', title: t('howItWorks.step1.title', 'List Your Product'), desc: t('howItWorks.step1.desc', 'Add what you have with photos and details') },
              { icon: '💰', title: t('howItWorks.step2.title', 'Get Price Info'), desc: t('howItWorks.step2.desc', 'See reference prices for your area') },
              { icon: '🤝', title: t('howItWorks.step3.title', 'Receive Offers'), desc: t('howItWorks.step3.desc', 'Compare offers from multiple buyers') },
              { icon: '✅', title: t('howItWorks.step4.title', 'Trade Securely'), desc: t('howItWorks.step4.desc', 'Choose the best deal and complete transaction') }
            ].map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-6 bg-earth-50 rounded-2xl shadow-sm border border-earth-100 relative">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-xl absolute -top-6 shadow-md border-4 border-white">
                  {idx + 1}
                </div>
                <div className="text-5xl mb-4 mt-6">{step.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Grid Section */}
      <section className="bg-earth-50 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              {t('categories.explore', 'Explore Categories')}
            </h2>
            <Link to="/marketplace" className="text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1 hidden sm:flex">
              {t('common.viewAll', 'View All')} <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((cat) => (
              <Link 
                key={cat.id} 
                to={`/marketplace/${cat.id}`}
                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 transition-all hover:-translate-y-1 flex flex-col items-center text-center group"
              >
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">{cat.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{t(`categories.${cat.id}`, cat.id.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()))}</h3>
                <span className="text-sm text-gray-500 bg-earth-50 px-3 py-1 rounded-full">{cat.count} {t('common.listings', 'listings')}</span>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link to="/marketplace" className="text-primary-600 font-semibold flex items-center justify-center gap-1">
              {t('common.viewAll', 'View All Categories')} <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary-700 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-x divide-primary-600">
            {[
              { value: '10,000+', label: t('stats.farmers', 'Farmers') },
              { value: '500+', label: t('stats.buyers', 'Verified Buyers') },
              { value: '25+', label: t('stats.districts', 'Districts') },
              { value: '3', label: t('stats.languages', 'Languages Supported') }
            ].map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center text-center px-4">
                <div className="text-3xl md:text-5xl font-bold mb-2 text-accent-400">{stat.value}</div>
                <div className="text-lg text-primary-100 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-20 px-4 border-b border-gray-200">
        <div className="max-w-4xl mx-auto text-center space-y-8 bg-earth-100 p-10 md:p-16 rounded-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            {t('cta.title', "Ready to Know Your Product's Value?")}
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            {t('cta.desc', 'Join thousands of farmers making smarter agricultural decisions every day.')}
          </p>
          <div className="flex justify-center">
            <Link to="/register" className="bg-primary-600 hover:bg-primary-700 text-white rounded-xl px-10 py-4 font-semibold text-xl transition-colors shadow-lg hover:shadow-xl inline-flex items-center gap-2">
              {t('common.register', 'Register Now')} <ChevronRight className="w-6 h-6" />
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-gray-600 text-sm mt-6">
            <span className="flex items-center gap-1"><Check className="w-4 h-4 text-primary-600"/> {t('cta.benefit1', 'Free forever for farmers')}</span>
            <span className="flex items-center gap-1"><Check className="w-4 h-4 text-primary-600"/> {t('cta.benefit2', 'Local language support')}</span>
            <span className="flex items-center gap-1"><Check className="w-4 h-4 text-primary-600"/> {t('cta.benefit3', 'Verified buyers')}</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
