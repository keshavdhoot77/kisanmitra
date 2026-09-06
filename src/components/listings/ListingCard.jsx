import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Eye, Clock } from 'lucide-react';

const ListingCard = ({ listing }) => {
  const { t } = useTranslation();

  if (!listing) return null;

  return (
    <Link to={`/listing/${listing.id}`} className="block group">
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 transition-all duration-200 overflow-hidden h-full flex flex-col hover:scale-[1.02]">
        {/* Image Container */}
        <div className="relative aspect-4/3 w-full bg-earth-100 overflow-hidden">
          {listing.imageUrl ? (
            <img 
              src={listing.imageUrl} 
              alt={listing.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="text-4xl">{listing.categoryEmoji || '🌾'}</span>
            </div>
          )}
          
          {/* Category Badge */}
          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-semibold text-primary-700 shadow-sm flex items-center gap-1">
            <span>{listing.categoryEmoji}</span>
            <span>{t(`categories.${listing.categorySlug}`)}</span>
          </div>
          
          {/* Price Badge */}
          <div className="absolute bottom-2 right-2 bg-accent-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-md">
            ₹{listing.price} / {t(`units.${listing.unit}`)}
          </div>
        </div>

        {/* Content Container */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-1 group-hover:text-primary-600 transition-colors">
            {listing.title}
          </h3>
          
          <div className="flex items-center text-gray-500 text-sm mb-2">
            <MapPin size={14} className="mr-1 flex-shrink-0" />
            <span className="truncate">{listing.location}</span>
          </div>
          
          <div className="text-sm text-gray-700 font-medium mb-3">
            {t('common.quantity')}: <span className="text-gray-900">{listing.quantity} {t(`units.${listing.unit}`)}</span>
          </div>

          <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="bg-primary-50 text-primary-600 px-1.5 py-0.5 rounded-md font-semibold">
                  {listing.offerCount || 0}
                </span>
                {t('common.offers')}
              </span>
              <span className="flex items-center gap-1">
                <Eye size={12} />
                {listing.views || 0}
              </span>
            </div>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {listing.timeAgo}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;
