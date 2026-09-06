import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, X, MessageCircle, Clock } from 'lucide-react';

export default function OfferCard({ offer, onAccept, onReject, onCounter, isSeller }) {
  const { t } = useTranslation();
  const [isCountering, setIsCountering] = useState(false);
  const [counterPrice, setCounterPrice] = useState(offer?.price || '');
  const [counterMessage, setCounterMessage] = useState('');

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    countered: 'bg-blue-100 text-blue-800',
    withdrawn: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 p-4 transition-shadow mb-4">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xl">
            {offer.buyerName?.charAt(0) || 'U'}
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">{offer.buyerName}</h3>
            <div className="flex items-center text-sm text-gray-500 gap-1">
              <Clock className="w-4 h-4" />
              <span>{offer.timestamp || t('offers.just_now')}</span>
            </div>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[offer.status] || statusColors.pending}`}>
          {t(`offers.status.${offer.status || 'pending'}`)}
        </span>
      </div>
      <div className="mb-4">
        <p className="text-sm text-gray-500">{t('offers.offered_price')}</p>
        <p className="text-3xl font-bold text-accent-600">₹{offer.price} <span className="text-base font-normal text-gray-500">/ {offer.unit || 'KG'}</span></p>
        <p className="text-gray-700 mt-1">{t('offers.quantity')}: <span className="font-semibold">{offer.quantity} {offer.unit || 'KG'}</span></p>
      </div>
      {offer.message && (
        <div className="bg-earth-50 p-3 rounded-xl mb-4 border border-earth-100 flex items-start gap-2">
          <MessageCircle className="w-5 h-5 text-gray-400 mt-0.5" />
          <p className="text-gray-700 italic">"{offer.message}"</p>
        </div>
      )}
      {isSeller && offer.status === 'pending' && !isCountering && (
        <div className="flex gap-2 mt-4 flex-wrap">
          <button onClick={() => onAccept(offer.id)} className="flex-1 bg-primary-600 hover:bg-primary-700 text-white rounded-xl px-4 py-3 font-semibold min-h-[48px] flex items-center justify-center gap-2">
            <Check className="w-5 h-5" /> {t('offers.accept')}
          </button>
          <button onClick={() => onReject(offer.id)} className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl px-4 py-3 font-semibold min-h-[48px] flex items-center justify-center gap-2">
            <X className="w-5 h-5" /> {t('offers.reject')}
          </button>
          <button onClick={() => setIsCountering(true)} className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl px-4 py-3 font-semibold min-h-[48px] flex items-center justify-center gap-2">
            {t('offers.counter')}
          </button>
        </div>
      )}
      {isCountering && (
        <div className="mt-4 p-4 border-2 border-blue-100 rounded-xl bg-blue-50">
          <h4 className="font-bold text-gray-900 mb-3">{t('offers.make_counter_offer')}</h4>
          <div className="space-y-3">
            <input type="number" value={counterPrice} onChange={(e) => setCounterPrice(e.target.value)} className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none" placeholder={t('offers.counter_price')} />
            <textarea value={counterMessage} onChange={(e) => setCounterMessage(e.target.value)} className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none" rows="2" placeholder={t('offers.message_optional')}></textarea>
            <div className="flex gap-2">
              <button onClick={() => { onCounter(offer.id, counterPrice, counterMessage); setIsCountering(false); }} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-3 font-semibold min-h-[48px]">
                {t('offers.submit_counter')}
              </button>
              <button onClick={() => setIsCountering(false)} className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl py-3 font-semibold min-h-[48px]">
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
