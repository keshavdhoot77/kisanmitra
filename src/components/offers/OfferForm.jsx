import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function OfferForm({ listing, onSubmit }) {
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (quantity > 0 && price > 0) {
      onSubmit({ quantity: Number(quantity), price: Number(price), message });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">{t('offers.make_an_offer')}</h3>
      <div className="bg-earth-50 p-4 rounded-xl mb-6">
        <p className="text-sm text-gray-500">{t('offers.asking_price')}</p>
        <p className="text-2xl font-bold text-gray-900">₹{listing?.price || 0} <span className="text-sm font-normal">/ {listing?.unit || 'KG'}</span></p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('offers.quantity')} ({listing?.unit || 'KG'})</label>
          <input type="number" required min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none" placeholder={t('offers.enter_quantity')} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('offers.your_offer_price')} (₹ / {listing?.unit || 'KG'})</label>
          <input type="number" required min="1" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none" placeholder={t('offers.enter_price')} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('offers.message_optional')}</label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none" rows="3" placeholder={t('offers.message_placeholder')}></textarea>
        </div>
        <button type="submit" disabled={!quantity || !price} className="w-full bg-accent-600 hover:bg-accent-500 disabled:opacity-50 text-white rounded-xl px-6 py-4 font-bold text-lg min-h-[48px] shadow-sm hover:shadow-md transition-all mt-4">
          {t('offers.submit_offer')}
        </button>
      </div>
    </form>
  );
}
