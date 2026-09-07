import React from 'react';
import { useTranslation } from 'react-i18next';
import { Check, X, ArrowRight } from 'lucide-react';

export default function OfferComparison({ offers = [], onAccept, onReject, onCounter }) {
  const { t } = useTranslation();

  if (!offers.length) return <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 text-gray-500">{t('offers.no_offers_yet', 'No offers received yet')}</div>;

  const sortedOffers = [...offers].sort((a, b) => b.price - a.price);
  const highestOffer = sortedOffers[0];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-earth-50 p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-bold text-gray-900">{t('offers.received_count', 'Offers Received ({{count}})', { count: offers.length })}</h3>
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-xl font-semibold">{t('offers.highest', 'Highest Offer')}: ₹{highestOffer.price}</div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600">
              <th className="p-4 font-semibold">{t('offers.buyer', 'Buyer')}</th>
              <th className="p-4 font-semibold">{t('offers.quantity', 'Quantity')}</th>
              <th className="p-4 font-semibold">{t('offers.price', 'Offered Price')}</th>
              <th className="p-4 font-semibold">{t('offers.status', 'Status')}</th>
              <th className="p-4 font-semibold">{t('common.actions', 'Actions')}</th>
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
                    {t(`offers.status.${offer.status || 'pending'}`, offer.status || 'pending')}
                  </span>
                </td>
                <td className="p-4">
                  {offer.status === 'pending' && (
                    <div className="flex gap-2">
                      <button onClick={() => onAccept(offer.id)} title="Accept Offer" aria-label="Accept Offer" className="p-2 bg-primary-100 hover:bg-primary-200 text-primary-700 rounded-lg transition-colors"><Check className="w-5 h-5" /></button>
                      <button onClick={() => onReject(offer.id)} title="Reject Offer" aria-label="Reject Offer" className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"><X className="w-5 h-5" /></button>
                      <button onClick={() => onCounter(offer.id)} title="Counter Offer" aria-label="Counter Offer" className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"><ArrowRight className="w-5 h-5" /></button>
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
