import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart3, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { getReferencePrice } from '../../services/prices';

const PriceReferenceWidget = ({ category, location, currentPrice, unit, commodity }) => {
  const { t } = useTranslation();

  const [refData, setRefData] = useState(null);
  useEffect(() => {
    let cancelled = false;
    const categoryMap = { grains: 'agricultural-produce', vegetables: 'agricultural-produce', fruits: 'agricultural-produce', pulses: 'agricultural-produce', spices: 'agricultural-produce', seeds: 'agri-inputs' };
    getReferencePrice(categoryMap[category] || category, location, unit, commodity)
      .then(({ data }) => { if (!cancelled) setRefData(data.data); })
      .catch(() => { if (!cancelled) setRefData(null); });
    return () => { cancelled = true; };
  }, [category, location, unit, commodity]);

  const getConfidenceColor = (conf) => {
    switch (conf) {
      case 'high': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-accent-600 bg-accent-50 border-accent-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getConfidenceIcon = (conf) => {
    switch (conf) {
      case 'high': return <CheckCircle2 size={16} className="text-green-600" />;
      case 'medium': return <AlertCircle size={16} className="text-yellow-600" />;
      case 'low': return <AlertCircle size={16} className="text-accent-600" />;
      default: return <Info size={16} className="text-gray-600" />;
    }
  };

  return (
    <div className="bg-primary-50 rounded-2xl border-2 border-primary-100 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <BarChart3 className="text-primary-600" size={20} />
          {t('reference.estimatedPrice', 'Estimated Reference Price')}
        </h3>
        {refData && <div className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border ${getConfidenceColor(refData.confidence)}`}>
          {getConfidenceIcon(refData.confidence)}{t(`reference.confidence.${refData.confidence}`, refData.confidence.toUpperCase())}
        </div>}
      </div>

      <div className="mb-4 text-center py-4 bg-white rounded-xl border border-primary-50">
        <div className="text-3xl font-bold text-accent-600">
          {refData ? refData.minPrice > 0 ? <>₹{refData.minPrice} <span className="text-xl text-gray-400 font-medium">—</span> ₹{refData.maxPrice}</> : t('common.noData', 'No data') : t('common.loading', 'Loading…')}
        </div>
        <div className="text-sm font-medium text-gray-500 mt-1">
          {refData?.unit ? <>{t('common.per', 'per')} {t(`units.${refData.unit.toLowerCase()}`, refData.unit)}</> : t('reference.unit', 'Reference unit')}
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <p className="flex items-start gap-2">
          <span className="text-primary-500 mt-0.5">•</span>
          <span>{refData ? refData.source === 'active-listings'
            ? t('reference.observedListings', 'Observed in {{count}} active listing(s){{near}}; this is an asking-price range.', { count: refData.sources, near: location ? ` ${t('common.near', 'near')} ${location}` : '' })
            : t('reference.basedOnRecords', 'Based on {{count}} market reference record(s){{near}}.', { count: refData.sources, near: location ? ` ${t('common.near', 'near')} ${location}` : '' })
            : t('reference.unavailable', 'Price references are not available for this area yet.')}</span>
        </p>
        <p className="flex items-start gap-2">
          <span className="text-primary-500 mt-0.5">•</span>
          <span className="italic">{t('reference.disclaimer', 'Actual market prices may vary based on product quality and quantity.')}</span>
        </p>
      </div>

      {currentPrice && refData?.minPrice > 0 && (
        <div className="mt-4 pt-4 border-t border-primary-200/50">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700">{t('reference.yourPrice', 'Your Price')}:</span>
            <span className={`font-bold ${
              currentPrice < refData.minPrice ? 'text-yellow-600' :
              currentPrice > refData.maxPrice ? 'text-accent-600' :
              'text-green-600'
            }`}>
              ₹{currentPrice} / {t(`units.${refData.unit.toLowerCase()}`, refData.unit)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceReferenceWidget;
