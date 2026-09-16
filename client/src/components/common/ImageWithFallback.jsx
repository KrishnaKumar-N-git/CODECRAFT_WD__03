import React, { useState, useEffect } from 'react';

// Multi-source reliable photo fallback chain (Pexels, Wikimedia, Unsplash)
const REAL_PHOTO_GALLERY = {
  'banana': 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg?auto=compress&cs=tinysrgb&w=600',
  'apple': 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=600',
  'tomato': 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=600',
  'potato': 'https://images.pexels.com/photos/144248/potatoes-vegetables-market-fresh-144248.jpeg?auto=compress&cs=tinysrgb&w=600',
  'onion': 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=600',
  'milk': 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=600',
  'paneer': 'https://images.pexels.com/photos/4109998/pexels-photo-4109998.jpeg?auto=compress&cs=tinysrgb&w=600',
  'butter': 'https://images.pexels.com/photos/928420/pexels-photo-928420.jpeg?auto=compress&cs=tinysrgb&w=600',
  'bread': 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=600',
  'porotta': 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=600',
  'parotta': 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=600',
  'fish': 'https://images.pexels.com/photos/3296392/pexels-photo-3296392.jpeg?auto=compress&cs=tinysrgb&w=600',
  'rice': 'https://images.pexels.com/photos/4110256/pexels-photo-4110256.jpeg?auto=compress&cs=tinysrgb&w=600',
  'oil': 'https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg?auto=compress&cs=tinysrgb&w=600',
  'ghee': 'https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg?auto=compress&cs=tinysrgb&w=600',
  'tea': 'https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg?auto=compress&cs=tinysrgb&w=600',
  'coffee': 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=600',
  'egg': 'https://images.pexels.com/photos/162712/eggs-white-egg-food-protein-162712.jpeg?auto=compress&cs=tinysrgb&w=600',

  // Category real photo fallbacks
  'fruits': 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=600',
  'vegetables': 'https://images.pexels.com/photos/1458694/pexels-photo-1458694.jpeg?auto=compress&cs=tinysrgb&w=600',
  'dairy': 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=600',
  'bakery': 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=600',
  'beverages': 'https://images.pexels.com/photos/1233319/pexels-photo-1233319.jpeg?auto=compress&cs=tinysrgb&w=600',
  'staples': 'https://images.pexels.com/photos/4110256/pexels-photo-4110256.jpeg?auto=compress&cs=tinysrgb&w=600',
  'default': 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=600'
};

const SECONDARY_FALLBACKS = [
  'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Red_Apple.jpg/800px-Red_Apple.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Banana-Single.jpg/800px-Banana-Single.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Milk_glass.jpg/800px-Milk_glass.jpg'
];

export const getRealPhotoFallback = (alt = '', categoryName = '') => {
  const text = `${alt} ${categoryName}`.toLowerCase();
  for (const [key, url] of Object.entries(REAL_PHOTO_GALLERY)) {
    if (text.includes(key)) return url;
  }
  return REAL_PHOTO_GALLERY['default'];
};

export const ImageWithFallback = ({
  src,
  alt = '',
  categoryName = '',
  className = ''
}) => {
  const primaryFallback = getRealPhotoFallback(alt, categoryName);
  const isValidSource = src && typeof src === 'string' && src.trim().startsWith('http') && !src.startsWith('data:');

  const [currentSrcIndex, setCurrentSrcIndex] = useState(0);
  const sources = [
    ...(isValidSource ? [src] : []),
    primaryFallback,
    ...SECONDARY_FALLBACKS
  ];

  useEffect(() => {
    setCurrentSrcIndex(0);
  }, [src, alt, categoryName]);

  const activeSrc = sources[Math.min(currentSrcIndex, sources.length - 1)];

  return (
    <img
      src={activeSrc}
      alt={alt || 'Grocery item'}
      className={className}
      onError={() => {
        if (currentSrcIndex < sources.length - 1) {
          setCurrentSrcIndex((prev) => prev + 1);
        }
      }}
      loading="lazy"
    />
  );
};

export default ImageWithFallback;
