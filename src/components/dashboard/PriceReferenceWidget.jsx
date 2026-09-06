import React from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart3, AlertCircle, CheckCircle2, Info } from 'lucide-react';

const PriceReferenceWidget = ({ category, location, currentPrice }) => {
  const { t } = useTranslation();

  // Mock reference data based on category
  const refData = {
    min: 24,
    max: 28,
    unit: 'KG',
    confidence: 'high', // high, medium, low
    sources: 45
  };

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
          {t('reference.estimatedPrice')}
        </h3>
        <div className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border ${getConfidenceColor(refData.confidence)}`}>
          {getConfidenceIcon(refData.confidence)}
          {t(`reference.confidence.${refData.confidence}`)}
        </div>
      </div>

      <div className="mb-4 text-center py-4 bg-white rounded-xl border border-primary-50">
        <div className="text-3xl font-bold text-accent-600">
          ₹{refData.min} <span className="text-xl text-gray-400 font-medium">—</span> ₹{refData.max}
        </div>
        <div className="text-sm font-medium text-gray-500 mt-1">
          {t('common.per')} {t(`units.${refData.unit.toLowerCase()}`, refData.unit)}
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <p className="flex items-start gap-2">
          <span className="text-primary-500 mt-0.5">•</span>
          <span>{t('reference.basedOn', { count: refData.sources, location: location || t('common.yourArea') })}</span>
        </p>
        <p className="flex items-start gap-2">
          <span className="text-primary-500 mt-0.5">•</span>
          <span className="italic">{t('reference.disclaimer')}</span>
        </p>
      </div>

      {currentPrice && (
        <div className="mt-4 pt-4 border-t border-primary-200/50">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700">{t('reference.yourPrice')}:</span>
            <span className={`font-bold ${
              currentPrice < refData.min ? 'text-yellow-600' :
              currentPrice > refData.max ? 'text-accent-600' :
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
