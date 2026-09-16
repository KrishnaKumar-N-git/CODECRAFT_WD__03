import React, { useState } from 'react';

const CATEGORY_STYLE_MAP = {
  'fruits': { emoji: '🍎', bg: 'from-amber-50 to-orange-100', text: 'text-amber-900', border: 'border-amber-200' },
  'vegetables': { emoji: '🥦', bg: 'from-emerald-50 to-green-100', text: 'text-emerald-900', border: 'border-emerald-200' },
  'dairy': { emoji: '🥛', bg: 'from-sky-50 to-blue-100', text: 'text-blue-900', border: 'border-blue-200' },
  'eggs': { emoji: '🥚', bg: 'from-amber-50 to-yellow-100', text: 'text-amber-900', border: 'border-yellow-200' },
  'bakery': { emoji: '🍞', bg: 'from-amber-50 to-orange-100', text: 'text-amber-900', border: 'border-amber-200' },
  'bread': { emoji: '🥐', bg: 'from-amber-50 to-yellow-100', text: 'text-amber-900', border: 'border-yellow-200' },
  'beverages': { emoji: '🧃', bg: 'from-purple-50 to-indigo-100', text: 'text-purple-900', border: 'border-purple-200' },
  'oil': { emoji: '🛢️', bg: 'from-yellow-50 to-amber-100', text: 'text-yellow-900', border: 'border-yellow-200' },
  'ghee': { emoji: '🧈', bg: 'from-yellow-50 to-amber-100', text: 'text-amber-900', border: 'border-amber-200' },
  'rice': { emoji: '🌾', bg: 'from-stone-50 to-amber-100', text: 'text-stone-900', border: 'border-stone-200' },
  'staples': { emoji: '🍚', bg: 'from-stone-50 to-orange-100', text: 'text-stone-900', border: 'border-stone-200' },
  'baby': { emoji: '👶', bg: 'from-pink-50 to-rose-100', text: 'text-pink-900', border: 'border-pink-200' },
  'frozen': { emoji: '🧊', bg: 'from-cyan-50 to-sky-100', text: 'text-cyan-900', border: 'border-cyan-200' },
  'household': { emoji: '🧼', bg: 'from-teal-50 to-cyan-100', text: 'text-teal-900', border: 'border-teal-200' },
  'cleaning': { emoji: '🧽', bg: 'from-teal-50 to-emerald-100', text: 'text-teal-900', border: 'border-teal-200' },
  'instant': { emoji: '🍜', bg: 'from-orange-50 to-red-100', text: 'text-orange-900', border: 'border-orange-200' },
  'personal': { emoji: '🧴', bg: 'from-rose-50 to-pink-100', text: 'text-rose-900', border: 'border-rose-200' },
  'tea': { emoji: '☕', bg: 'from-emerald-50 to-teal-100', text: 'text-emerald-900', border: 'border-emerald-200' },
  'coffee': { emoji: '☕', bg: 'from-amber-100 to-stone-200', text: 'text-stone-900', border: 'border-stone-300' },
  'snacks': { emoji: '🍿', bg: 'from-yellow-50 to-orange-100', text: 'text-orange-900', border: 'border-orange-200' },
  'spices': { emoji: '🌶️', bg: 'from-red-50 to-orange-100', text: 'text-red-900', border: 'border-red-200' },
};

const getStyleForContext = (name = '', categoryName = '') => {
  const query = `${name} ${categoryName}`.toLowerCase();
  for (const [key, val] of Object.entries(CATEGORY_STYLE_MAP)) {
    if (query.includes(key)) return val;
  }
  return { emoji: '🛒', bg: 'from-emerald-50 to-teal-100', text: 'text-emerald-900', border: 'border-emerald-200' };
};

export const ImageWithFallback = ({
  src,
  alt = '',
  categoryName = '',
  className = '',
  iconSize = 'text-3xl',
  showLabel = true,
  fallbackType = 'product'
}) => {
  const [hasError, setHasError] = useState(false);

  // If URL is missing, invalid or an old broken SVG data URI string, trigger fallback directly
  const isInvalidUrl = !src || typeof src !== 'string' || src.trim() === '' || src.startsWith('data:image/svg+xml');

  if (hasError || isInvalidUrl) {
    const style = getStyleForContext(alt, categoryName);
    return (
      <div className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br ${style.bg} ${style.border} border p-2 text-center select-none overflow-hidden ${className}`}>
        <span className={`${iconSize} drop-shadow-sm transition-transform hover:scale-110`}>
          {style.emoji}
        </span>
        {showLabel && alt && (
          <span className={`mt-1 text-[10px] font-black ${style.text} tracking-tight line-clamp-1 leading-none uppercase`}>
            {alt}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      loading="lazy"
    />
  );
};

export default ImageWithFallback;
