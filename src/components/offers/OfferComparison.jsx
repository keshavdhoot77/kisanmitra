import React from 'react';
import { useTranslation } from 'react-i18next';
import { Check, X, ArrowRight } from 'lucide-react';

export default function OfferComparison({ offers = [], onAccept, onReject, onCounter }) {
  const { t } = useTranslation();

  if (!offers.length) return <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 text-gray-500">{t('offers.no_offers_yet')}</div>;

  const sortedOffers = [...offers].sort((a, b) => b.price - a.price);
  const highestOffer = sortedOffers[0];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-earth-50 p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-bold text-gray-900">{t('offers.received_count', { count: offers.length })}</h3>
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-xl font-semibold">{t('offers.highest')}: ₹{highestOffer.price}</div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600">
              <th className="p-4 font-semibold">{t('offers.buyer')}</th>
              <th className="p-4 font-semibold">{t('offers.quantity')}</th>
              <th className="p-4 font-semibold">{t('offers.price')}</th>
              <th className="p-4 font-semibold">{t('offers.status')}</th>
              <th className="p-4 font-semibold">{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {sortedOffers.map((offer, index) => (
              <tr key={offer.id} className={`border-b border-gray-100 hover:bg-gray-50 ${index === 0 ? 'bg-primary-50/30' : ''}`}>
                <td className="p-4 font-medium text-gray-900">{offer.buyerName}</td>
                <td className="p-4 text-gray-700">{offer.quantity} {offer.unit || 'KG'}</td>
                <td className="p-4 text-accent-600 font-bold text-lg">₹{offer.price}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                    ${offer.status === 'accepted' ? 'bg-green-100 text-green-700' : offer.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {t(`offers.status.${offer.status || 'pending'}`)}
                  </span>
                </td>
                <td className="p-4">
                  {offer.status === 'pending' && (
                    <div className="flex gap-2">
                      <button onClick={() => onAccept(offer.id)} className="p-2 bg-primary-100 text-primary-700 rounded-lg"><Check className="w-5 h-5" /></button>
                      <button onClick={() => onReject(offer.id)} className="p-2 bg-red-100 text-red-700 rounded-lg"><X className="w-5 h-5" /></button>
                      <button onClick={() => onCounter(offer.id)} className="p-2 bg-blue-100 text-blue-700 rounded-lg"><ArrowRight className="w-5 h-5" /></button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
