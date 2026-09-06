import React from 'react';
import { useTranslation } from 'react-i18next';
import ListingCard from './ListingCard';
import { Package } from 'lucide-react';

const ListingGrid = ({ listings = [], loading = false, emptyMessage }) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col animate-pulse">
            <div className="aspect-4/3 bg-gray-200 rounded-t-2xl w-full"></div>
            <div className="p-4 flex flex-col flex-grow">
              <div className="h-6 bg-gray-200 rounded-md w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded-md w-1/2 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded-md w-1/3 mb-4"></div>
              <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between">
                <div className="h-4 bg-gray-200 rounded-md w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded-md w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!listings || listings.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center text-center">
        <div className="bg-earth-50 p-4 rounded-full mb-4">
          <Package size={48} className="text-primary-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {emptyMessage || t('common.noListingsFound')}
        </h3>
        <p className="text-gray-500 max-w-md">
          {t('common.tryAdjustingFilters')}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
};

export default ListingGrid;
