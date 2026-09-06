import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Shield, Star, Share2, AlertTriangle, Calendar, Package, Info, CheckCircle } from 'lucide-react';
import PriceReferenceWidget from '../components/dashboard/PriceReferenceWidget';

const ListingDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [offerQuantity, setOfferQuantity] = useState('');
  const [offerPrice, setOfferPrice] = useState('');

  // Mock data
  const listing = {
    id,
    title: 'Premium Sharbati Wheat - Direct from Farm',
    price: 2800,
    unit: 'Quintal',
    quantity: 50,
    category: 'grains',
    type: 'sell',
    location: 'Kolhapur, Maharashtra',
    description: 'High-quality Sharbati wheat grown organically. Cleaned and packed in 50kg gunny bags. Ready for immediate pickup. Perfect for flour mills or direct consumption.',
    details: {
      variety: 'Sharbati',
      harvestDate: 'March 2024',
      grade: 'Grade A',
      organic: true,
      storage: 'Dry Warehouse'
    },
    images: [null, null], // placeholders
    seller: {
      name: 'Ramesh Patil',
      type: 'Farmer',
      verified: true,
      rating: 4.8,
      memberSince: '2022'
    },
    isOwner: false // change to true to see offer comparison view
  };

  return (
    <div className="min-h-screen bg-earth-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Breadcrumb/Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm font-medium text-gray-500">
            {t('common.home')} &gt; {t(`categories.${listing.category}`)} &gt; <span className="text-gray-900">{listing.title}</span>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium">
              <Share2 size={18} /> {t('common.share')}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-200 text-red-600 hover:bg-red-50 font-medium">
              <AlertTriangle size={18} /> {t('common.report')}
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Main Details */}
          <div className="lg:w-2/3 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
              <div className="aspect-video bg-earth-100 rounded-2xl flex items-center justify-center mb-4 overflow-hidden">
                <span className="text-6xl opacity-50">🌾</span>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {[1,2,3].map((i) => (
                  <div key={i} className="w-24 h-24 bg-earth-100 rounded-xl flex-shrink-0 border-2 border-transparent hover:border-primary-500 cursor-pointer"></div>
                ))}
              </div>
            </div>

            {/* Title & Core Info */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-lg text-sm font-bold uppercase tracking-wider">
                  {t(`filters.types.${listing.type}`)}
                </span>
                {listing.details.organic && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-bold flex items-center gap-1">
                    <CheckCircle size={14} /> {t('listing.organic')}
                  </span>
                )}
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                {listing.title}
              </h1>
              
              <div className="flex flex-wrap items-end gap-x-6 gap-y-4 mb-6 pb-6 border-b border-gray-100">
                <div>
                  <div className="text-3xl sm:text-4xl font-black text-accent-600">
                    ₹{listing.price}
                  </div>
                  <div className="text-gray-500 font-medium mt-1">
                    {t('common.per')} {listing.unit}
                  </div>
                </div>
                <div className="bg-earth-50 px-4 py-2 rounded-xl border border-earth-200">
                  <div className="text-sm text-gray-500 font-medium mb-1">{t('common.availableQuantity')}</div>
                  <div className="text-xl font-bold text-gray-900">{listing.quantity} {listing.unit}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-600 font-medium text-lg mb-8 bg-gray-50 p-4 rounded-xl">
                <MapPin className="text-primary-600" />
                {listing.location}
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{t('listing.description')}</h3>
                <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                  {listing.description}
                </p>
              </div>

              {/* Quality Details */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{t('listing.qualityDetails')}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 bg-earth-50 rounded-xl">
                    <Info className="text-primary-600 mt-0.5" />
                    <div>
                      <div className="text-sm text-gray-500 font-medium">{t('listing.variety')}</div>
                      <div className="font-bold text-gray-900">{listing.details.variety}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-earth-50 rounded-xl">
                    <Calendar className="text-primary-600 mt-0.5" />
                    <div>
                      <div className="text-sm text-gray-500 font-medium">{t('listing.harvestDate')}</div>
                      <div className="font-bold text-gray-900">{listing.details.harvestDate}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-earth-50 rounded-xl">
                    <Package className="text-primary-600 mt-0.5" />
                    <div>
                      <div className="text-sm text-gray-500 font-medium">{t('listing.grade')}</div>
                      <div className="font-bold text-gray-900">{listing.details.grade}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Actions & Seller */}
          <div className="lg:w-1/3 space-y-6">
            
            {/* Price Reference */}
            <PriceReferenceWidget category={listing.category} location={listing.location} currentPrice={listing.price} />

            {/* Seller Card */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">{t('listing.sellerInfo')}</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-xl">
                  {listing.seller.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-lg text-gray-900 flex items-center gap-1">
                    {listing.seller.name}
                    {listing.seller.verified && <Shield size={16} className="text-green-500 fill-current" />}
                  </div>
                  <div className="text-sm text-gray-500 font-medium">{listing.seller.type} • {t('common.memberSince')} {listing.seller.memberSince}</div>
                  <div className="flex items-center gap-1 mt-1 text-sm font-bold text-gray-700">
                    <Star size={14} className="text-yellow-400 fill-current" /> {listing.seller.rating}
                  </div>
                </div>
              </div>
              <button className="w-full bg-white border-2 border-primary-600 text-primary-600 hover:bg-primary-50 rounded-xl px-6 py-3 font-bold text-lg transition-colors mb-3">
                {t('listing.contactSeller')}
              </button>
            </div>

            {/* Offer Form (If Buyer) */}
            {!listing.isOwner && (
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 border-t-4 border-t-accent-500">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t('listing.makeOffer')}</h3>
                <p className="text-gray-500 text-sm mb-6">{t('listing.negotiateMessage')}</p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">{t('common.quantity')} ({listing.unit})</label>
                    <input 
                      type="number" 
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-colors"
                      placeholder={`Max ${listing.quantity}`}
                      value={offerQuantity}
                      onChange={(e) => setOfferQuantity(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">{t('listing.yourPrice')} (₹/{listing.unit})</label>
                    <input 
                      type="number" 
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-colors"
                      placeholder={listing.price.toString()}
                      value={offerPrice}
                      onChange={(e) => setOfferPrice(e.target.value)}
                    />
                  </div>
                  <button className="w-full bg-accent-600 hover:bg-accent-700 text-white rounded-xl px-6 py-4 font-bold text-lg transition-colors shadow-sm mt-2">
                    {t('listing.submitOffer')}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;
