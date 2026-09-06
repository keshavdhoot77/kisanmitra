import React from 'react';
import { Star } from 'lucide-react';

export default function ReviewCard({ review }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center font-bold text-primary-700">{review.authorName.charAt(0)}</div>
        <div>
          <h4 className="font-bold text-gray-900">{review.authorName}</h4>
          <p className="text-xs text-gray-500">{review.date}</p>
        </div>
      </div>
      <div className="flex mb-2">
        {[1, 2, 3, 4, 5].map(star => (
          <Star key={star} className={`w-4 h-4 ${star <= review.rating ? 'fill-accent-500 text-accent-500' : 'text-gray-200'}`} />
        ))}
      </div>
      <p className="text-gray-700">{review.comment}</p>
      {review.response && (
        <div className="mt-4 p-3 bg-gray-50 border-l-4 border-primary-500 rounded-r-xl">
          <p className="text-xs font-bold text-gray-900 mb-1">Seller Response</p>
          <p className="text-sm text-gray-600">{review.response}</p>
        </div>
      )}
    </div>
  );
}
