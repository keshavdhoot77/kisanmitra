import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Calendar, Star, Package, MessageCircle } from 'lucide-react';
import VerificationBadge from './VerificationBadge';

const UserProfile = ({ userId }) => {
  const { t } = useTranslation();
  
  // Mock Public User Data
  const user = {
    name: 'Suresh Kumar',
    type: 'Buyer',
    avatar: 'SK',
    location: 'Nashik, Maharashtra',
    memberSince: '2022-11-05',
    verifiedPhone: true,
    verifiedIdentity: true,
    stats: {
      transactions: 142,
      rating: 4.9,
      responseRate: '98%'
    },
    bio: 'Wholesale buyer of fresh vegetables and fruits. Interested in bulk purchases from local farmers.',
  };

  const [activeTab, setActiveTab] = useState('listings');

  return (
    <div className="bg-earth-50 py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header Profile Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-32 bg-gray-200"></div>
          
          <div className="px-6 sm:px-10 pb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end -mt-16 sm:-mt-12 mb-6 gap-4">
              <div className="flex items-end gap-5">
                <div className="w-28 h-28 rounded-full bg-white p-1 shadow-lg">
                  <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-4xl font-bold text-gray-700">
                    {user.avatar}
                  </div>
                </div>
                <div className="pb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                  <span className="inline-block bg-earth-100 text-earth-800 px-3 py-1 rounded-full text-sm font-semibold mt-1">
                    🛒 {t(`userTypes.${user.type.toLowerCase()}`, user.type)}
                  </span>
                </div>
              </div>
              <div className="w-full sm:w-auto">
                <button className="w-full sm:w-auto bg-accent-600 hover:bg-accent-500 text-white rounded-xl px-8 py-3 font-semibold text-lg transition-colors shadow-sm flex items-center justify-center gap-2">
                  <MessageCircle className="w-5 h-5" /> {t('profile.contact', 'Contact User')}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left Column - Details */}
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{t('profile.about', 'About')}</h3>
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
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 space-y-4">
                <h3 className="font-bold text-gray-900 mb-4">{t('profile.stats', 'Activity Stats')}</h3>
                
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Package className="w-5 h-5 text-gray-500" /> {t('profile.transactions', 'Transactions')}
                  </div>
                  <span className="font-bold text-lg">{user.stats.transactions}</span>
                </div>
                
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Star className="w-5 h-5 text-accent-500" /> {t('profile.rating', 'Rating')}
                  </div>
                  <span className="font-bold text-lg">{user.stats.rating}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-gray-700">
                    <MessageCircle className="w-5 h-5 text-gray-500" /> {t('profile.responseRate', 'Response Rate')}
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
              {t('profile.publicListings', 'Public Listings')}
            </button>
            <button 
              onClick={() => setActiveTab('reviews')}
              className={`flex-1 py-4 font-bold text-lg transition-colors ${activeTab === 'reviews' ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              {t('profile.reviewsReceived', 'Reviews')}
            </button>
          </div>
          
          <div className="p-8 min-h-[300px] flex items-center justify-center text-gray-400">
            {activeTab === 'listings' ? (
              <div className="text-center">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>{t('profile.noPublicListings', 'User has no active public listings.')}</p>
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

export default UserProfile;
