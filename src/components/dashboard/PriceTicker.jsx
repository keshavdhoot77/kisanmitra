import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const PriceTicker = ({ prices = [] }) => {
  const { t } = useTranslation();

  // Mock data if none provided
  const displayPrices = prices.length > 0 ? prices : [
    { id: 1, product: 'Wheat', emoji: '🌾', min: 2200, max: 2400, unit: 'Quintal', trend: 'up' },
    { id: 2, product: 'Onion', emoji: '🧅', min: 1500, max: 1800, unit: 'Quintal', trend: 'down' },
    { id: 3, product: 'Potato', emoji: '🥔', min: 1200, max: 1400, unit: 'Quintal', trend: 'flat' },
    { id: 4, product: 'Tomato', emoji: '🍅', min: 25, max: 35, unit: 'KG', trend: 'up' },
    { id: 5, product: 'Cotton', emoji: '🌱', min: 6500, max: 7200, unit: 'Quintal', trend: 'up' },
  ];

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <TrendingUp size={16} className="text-green-500" />;
      case 'down': return <TrendingDown size={16} className="text-red-500" />;
      default: return <Minus size={16} className="text-gray-400" />;
    }
  };

  const getTrendClass = (trend) => {
    switch (trend) {
      case 'up': return 'bg-green-50 text-green-700 border-green-100';
      case 'down': return 'bg-red-50 text-red-700 border-red-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <TrendingUp className="text-primary-600" />
          {t('dashboard.todaysPrices')}
        </h2>
        <span className="text-sm text-gray-500">{t('dashboard.inYourArea', 'in your area')}</span>
      </div>
      
      <div className="flex overflow-x-auto pb-2 -mx-2 px-2 snap-x gap-4 scrollbar-hide">
        {displayPrices.map((item) => (
          <div 
            key={item.id} 
            className="flex-none w-64 p-4 rounded-xl border border-gray-100 bg-gradient-to-br from-white to-earth-50 shadow-sm snap-start"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{item.emoji}</span>
                <span className="font-semibold text-gray-800">{t(`products.${item.product.toLowerCase()}`, item.product)}</span>
              </div>
              <div className={`p-1.5 rounded-lg border ${getTrendClass(item.trend)}`}>
                {getTrendIcon(item.trend)}
              </div>
            </div>
            
            <div className="mt-3">
              <div className="text-2xl font-bold text-accent-600">
                ₹{item.min} <span className="text-lg text-gray-400 font-normal">-</span> ₹{item.max}
              </div>
              <div className="text-sm text-gray-500 font-medium">
                {t('common.per', 'per')} {t(`units.${item.unit.toLowerCase()}`, item.unit)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriceTicker;
