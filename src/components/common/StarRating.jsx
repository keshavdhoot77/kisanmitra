import React, { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ 
  rating = 0, 
  maxStars = 5, 
  size = 'md', 
  interactive = false, 
  onChange 
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10'
  };

  const containerClasses = interactive ? 'flex items-center gap-2' : 'flex items-center gap-1';
  
  const handleClick = (value) => {
    if (interactive && onChange) {
      onChange(value);
    }
  };

  const currentRating = interactive ? (hoverRating || rating) : rating;

  return (
    <div className="flex items-center gap-2">
      <div className={containerClasses} onMouseLeave={() => interactive && setHoverRating(0)}>
        {[...Array(maxStars)].map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= currentRating;
          
          return (
            <button
              key={index}
              type={interactive ? "button" : "button"}
              className={`
                ${interactive ? 'p-1 hover:scale-110 transition-transform min-h-[48px] min-w-[48px] flex items-center justify-center rounded-full hover:bg-accent-50' : 'cursor-default p-0'}
                focus:outline-none
              `}
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => interactive && setHoverRating(starValue)}
              disabled={!interactive}
            >
              <Star 
                className={`
                  ${sizes[size]} 
                  ${isFilled ? 'fill-accent-500 text-accent-500' : 'fill-transparent text-gray-300'}
                  transition-colors
                `} 
              />
            </button>
          );
        })}
      </div>
      {!interactive && rating > 0 && (
        <span className={`font-semibold text-gray-700 ${size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-xl' : 'text-base'}`}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;
