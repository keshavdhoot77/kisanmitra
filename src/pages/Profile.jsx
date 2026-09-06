import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Calendar, Edit, Settings, Star, Package, MessageCircle, Shield } from 'lucide-react';
import VerificationBadge from '../components/profile/VerificationBadge';

const Profile = () => {
  const { t } = useTranslation();
  
  // Mock User Data
  const user = {
    name: 'Ramesh Patil',
    type: 'Farmer',
    avatar: 'RP',
    location: 'Pune, Maharashtra',
    memberSince: '2023-01-15',
    verifiedPhone: true,
    verifiedIdentity: false,
    stats: {
      transactions: 24,
      rating: 4.8,
      responseRate: '95%'
    },
    bio: 'Organic farmer growing tomatoes and onions in Pune district. Selling high-quality produce directly from the farm.',
  };

  const [activeTab, setActiveTab] = useState('listings');

  return (
    <div className="min-h-screen bg-earth-50 py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header Profile Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-32 bg-primary-600 bg-gradient-to-r from-primary-600 to-primary-800"></div>
          
          <div className="px-6 sm:px-10 pb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end -mt-16 sm:-mt-12 mb-6 gap-4">
              <div className="flex items-end gap-5">
                <div className="w-28 h-28 rounded-full bg-white p-1 shadow-lg">
                  <div className="w-full h-full bg-primary-100 rounded-full flex items-center justify-center text-4xl font-bold text-primary-700">
                    {user.avatar}
                  </div>
                </div>
                <div className="pb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                  <span className="inline-block bg-earth-100 text-earth-800 px-3 py-1 rounded-full text-sm font-semibold mt-1">
                    👨‍🌾 {t(`userTypes.${user.type.toLowerCase()}`, user.type)}
                  </span>
                </div>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none bg-white border-2 border-gray-200 text-gray-700 hover:border-primary-600 hover:text-primary-600 rounded-xl px-4 py-2 font-semibold transition-colors flex items-center justify-center gap-2">
                  <Settings className="w-4 h-4" /> {t('profile.settings', 'Settings')}
                </button>
                <button className="flex-1 sm:flex-none bg-primary-600 hover:bg-primary-700 text-white rounded-xl px-6 py-2 font-semibold transition-colors shadow-sm flex items-center justify-center gap-2">
                  <Edit className="w-4 h-4" /> {t('profile.edit', 'Edit Profile')}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left Column - Details */}
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{t('profile.about', 'About Me')}</h3>
                  <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                    {user.bio}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                    <MapPin className="w-4 h-4 text-primary-600" />
                    <span>{user.location}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                    <Calendar className="w-4 h-4 text-primary-600" />
                    <span>{t('profile.memberSince', 'Member since')} {new Date(user.memberSince).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <VerificationBadge type="phone" verified={user.verifiedPhone} />
                  <VerificationBadge type="identity" verified={user.verifiedIdentity} />
                </div>
              </div>

              {/* Right Column - Stats */}
              <div className="bg-primary-50 rounded-2xl p-6 border border-primary-100 space-y-4">
                <h3 className="font-bold text-primary-900 mb-4">{t('profile.stats', 'Activity Stats')}</h3>
                
                <div className="flex justify-between items-center pb-3 border-b border-primary-200">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Package className="w-5 h-5 text-primary-600" /> {t('profile.transactions', 'Transactions')}
                  </div>
                  <span className="font-bold text-lg">{user.stats.transactions}</span>
                </div>
                
                <div className="flex justify-between items-center pb-3 border-b border-primary-200">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Star className="w-5 h-5 text-accent-500" /> {t('profile.rating', 'Rating')}
                  </div>
                  <span className="font-bold text-lg">{user.stats.rating}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-gray-700">
                    <MessageCircle className="w-5 h-5 text-primary-600" /> {t('profile.responseRate', 'Response Rate')}
                  </div>
                  <span className="font-bold text-lg">{user.stats.responseRate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-100">
            <button 
              onClick={() => setActiveTab('listings')}
              className={`flex-1 py-4 font-bold text-lg transition-colors ${activeTab === 'listings' ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              {t('profile.myListings', 'My Listings')}
            </button>
            <button 
              onClick={() => setActiveTab('reviews')}
              className={`flex-1 py-4 font-bold text-lg transition-colors ${activeTab === 'reviews' ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              {t('profile.myReviews', 'My Reviews')}
            </button>
          </div>
          
          <div className="p-8 min-h-[300px] flex items-center justify-center text-gray-400">
            {activeTab === 'listings' ? (
              <div className="text-center">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>{t('profile.noListings', 'No active listings yet.')}</p>
                <button className="mt-4 text-primary-600 font-semibold hover:underline">{t('common.addListing', '+ Add New Listing')}</button>
              </div>
            ) : (
              <div className="text-center">
                <Star className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>{t('profile.noReviews', 'No reviews received yet.')}</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
