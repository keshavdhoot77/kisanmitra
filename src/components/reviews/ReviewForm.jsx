import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Star } from 'lucide-react';

export default function ReviewForm({ orderId, reviewedUserId, onSubmit }) {
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating > 0) onSubmit({ rating, comment, orderId, reviewedUserId });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-bold text-gray-900">{t('reviews.write_review', 'Write a Review')}</h3>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button type="button" key={star} onClick={() => setRating(star)} onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(0)} className="focus:outline-none">
            <Star className={`w-10 h-10 transition-colors ${star <= (hover || rating) ? 'fill-accent-500 text-accent-500' : 'text-gray-300'}`} />
          </button>
        ))}
      </div>
      <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder={t('reviews.placeholder', 'Share details of your experience with this order...')} rows="4" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 outline-none"></textarea>
      <button type="submit" disabled={rating === 0} className="w-full bg-primary-600 hover:bg-primary-700 text-white rounded-xl py-3 font-bold disabled:opacity-50 transition-colors">{t('reviews.submit', 'Submit Review')}</button>
    </form>
  );
}
