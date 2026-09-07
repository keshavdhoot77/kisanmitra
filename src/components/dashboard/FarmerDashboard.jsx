import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Plus, ShoppingCart, Search, MessageCircle, MapPin } from 'lucide-react';
import PriceTicker from './PriceTicker';

const FarmerDashboard = ({ user = { name: 'Farmer' } }) => {
  const { t } = useTranslation();
  
  const hour = new Date().getHours();
  let greetingKey = 'morning';
  if (hour >= 12 && hour < 17) greetingKey = 'afternoon';
  else if (hour >= 17) greetingKey = 'evening';

  const quickActions = [
    { icon: <Plus size={32} />, label: 'dashboard.createListing', desc: 'dashboard.createListingDesc', defaultLabel: 'Create Listing', defaultDesc: 'List your produce or equipment', link: '/create-listing', color: 'bg-primary-50 text-primary-600 border-primary-200 hover:bg-primary-100' },
    { icon: <ShoppingCart size={32} />, label: 'dashboard.myOrders', desc: 'dashboard.myOrdersDesc', defaultLabel: 'My Orders', defaultDesc: 'Track status and view transactions', link: '/orders', color: 'bg-accent-50 text-accent-600 border-accent-200 hover:bg-accent-100' },
    { icon: <Search size={32} />, label: 'dashboard.browseMarket', desc: 'dashboard.browseMarketDesc', defaultLabel: 'Browse Marketplace', defaultDesc: 'Discover buyers and compare prices', link: '/marketplace', color: 'bg-earth-100 text-earth-800 border-earth-200 hover:bg-earth-200' },
    { icon: <MessageCircle size={32} />, label: 'dashboard.messages', desc: 'dashboard.messagesDesc', defaultLabel: 'Messages', defaultDesc: 'Chat directly with buyers & sellers', link: '/chat', color: 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            {t(`dashboard.good${greetingKey}`, `Good ${greetingKey}`)}, {user.name} 👋
          </h1>
          <p className="text-gray-500 mt-2 text-lg">{t('dashboard.welcomeBack', 'Welcome back to your agricultural command center.')}</p>
        </div>
        <div className="flex items-center gap-2 bg-earth-50 px-4 py-2 rounded-xl border border-earth-100 text-earth-800 font-medium">
          <MapPin size={20} className="text-accent-600" />
          Kolhapur, Maharashtra
        </div>
      </div>

      <PriceTicker />

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">{t('dashboard.quickActions', 'Quick Actions')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, idx) => (
            <Link key={idx} to={action.link} className={`p-6 rounded-2xl border-2 transition-all duration-200 flex flex-col items-start gap-4 hover:scale-105 shadow-sm ${action.color}`}>
              <div className="bg-white p-3 rounded-xl shadow-sm">
                {action.icon}
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">{t(action.label, action.defaultLabel)}</h3>
                <p className="text-sm opacity-80 font-medium">{t(action.desc, action.defaultDesc)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats & Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">{t('dashboard.activeListings', 'Active Listings')}</h2>
            <Link to="/my-listings" className="text-primary-600 font-semibold hover:text-primary-700">{t('common.viewAll', 'View All')}</Link>
          </div>
          <div className="space-y-4">
            {/* Mock Listing Summary */}
            <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:bg-earth-50 transition-colors">
              <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                <div className="w-full h-full flex items-center justify-center text-2xl bg-earth-100">🌾</div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 truncate">Premium Lokwan Wheat</h4>
                <div className="text-sm text-gray-500 mt-1">₹2,400 / Quintal • 50 Quintals</div>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center justify-center bg-primary-100 text-primary-700 font-bold px-3 py-1 rounded-full text-sm">
                  3 {t('common.offers', 'Offers')}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:bg-earth-50 transition-colors">
              <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                <div className="w-full h-full flex items-center justify-center text-2xl bg-earth-100">🧅</div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 truncate">Red Onions - Export Quality</h4>
                <div className="text-sm text-gray-500 mt-1">₹1,800 / Quintal • 20 Quintals</div>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center justify-center bg-gray-100 text-gray-600 font-bold px-3 py-1 rounded-full text-sm">
                  0 {t('common.offers', 'Offers')}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">{t('dashboard.yourStats', 'Your Performance')}</h2>
          <div className="space-y-6">
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">{t('dashboard.totalListings', 'Total Listings')}</div>
              <div className="text-3xl font-bold text-gray-900">12</div>
            </div>
            <div className="w-full h-px bg-gray-100"></div>
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">{t('dashboard.successfulSales', 'Successful Sales')}</div>
              <div className="text-3xl font-bold text-primary-600">8</div>
            </div>
            <div className="w-full h-px bg-gray-100"></div>
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">{t('dashboard.rating', 'Seller Rating')}</div>
              <div className="flex items-center gap-2">
                <div className="text-3xl font-bold text-accent-600">4.8</div>
                <div className="text-yellow-400 text-xl">★★★★★</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
