import React, { useState, useEffect } from 'react';

const CATEGORY_ICONS = {
  'fruit': '🍎',
  'veg': '🥦',
  'dairy': '🥛',
  'milk': '🥛',
  'bakery': '🍞',
  'bread': '🍞',
  'bev': '🧃',
  'drink': '🧃',
  'oil': '🛢️',
  'ghee': '🧈',
  'rice': '🌾',
  'grain': '🌾',
  'staple': '🍚',
  'fish': '🐟',
  'meat': '🥩',
  'egg': '🥚',
  'tea': '☕',
  'coffee': '☕',
  'snack': '🍿',
  'spice': '🌶️',
  'clean': '🧼',
  'house': '🧼',
};

const getIconForTitle = (title = '', category = '') => {
  const text = `${title} ${category}`.toLowerCase();
  for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
    if (text.includes(key)) return icon;
  }
  return '🛒';
};

export const ImageWithFallback = ({
  src,
  alt = '',
  categoryName = '',
  className = ''
}) => {
  const isValidSource = Boolean(src && typeof src === 'string' && src.trim().length > 0);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (hasError || !isValidSource) {
    const title = alt || categoryName || 'Grocery Item';
    const icon = getIconForTitle(title, categoryName);
    return (
      <div className={`w-full h-full min-h-[220px] flex flex-col items-center justify-between p-6 bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-900 text-white rounded-3xl shadow-md select-none ${className}`}>
        <div className="w-full flex items-center justify-between">
          <span className="text-[10px] font-black tracking-widest uppercase bg-white/20 px-3 py-1 rounded-full backdrop-blur-md border border-white/20">
            {categoryName || 'FRESH GROCERY'}
          </span>
          <span className="text-xs font-black tracking-wider text-emerald-200">GROCMART</span>
        </div>

        <div className="my-auto text-center space-y-3 py-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-xl border border-white/30 text-4xl transform hover:scale-110 transition-transform">
            {icon}
          </div>
          <h3 className="text-base sm:text-lg font-black tracking-tight text-white line-clamp-2 px-2 drop-shadow-md">
            {title}
          </h3>
        </div>

        <div className="w-full text-center border-t border-white/20 pt-2.5 text-[10px] font-extrabold tracking-wider uppercase text-emerald-100 flex items-center justify-between">
          <span>100% Quality Guaranteed</span>
          <span>Fresh Stock</span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || 'Grocery product'}
      className={className}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      loading="lazy"
    />
  );
};

export default ImageWithFallback;
