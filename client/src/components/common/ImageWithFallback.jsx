import React, { useState, useEffect } from 'react';

// Real high-resolution public Wikimedia Commons photos for products & categories
const REAL_PHOTO_GALLERY = {
  'banana': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Banana-Single.jpg/800px-Banana-Single.jpg',
  'apple': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Red_Apple.jpg/800px-Red_Apple.jpg',
  'tomato': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Tomato_je.jpg/800px-Tomato_je.jpg',
  'potato': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Patates.jpg/800px-Patates.jpg',
  'onion': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Onion_on_White.JPG/800px-Onion_on_White.JPG',
  'milk': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Milk_glass.jpg/800px-Milk_glass.jpg',
  'paneer': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Paneer_cubes.jpg/800px-Paneer_cubes.jpg',
  'butter': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Supreme_cut_butter.jpg/800px-Supreme_cut_butter.jpg',
  'bread': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Kaisersemmel-.jpg/800px-Kaisersemmel-.jpg',
  'porotta': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Kaisersemmel-.jpg/800px-Kaisersemmel-.jpg',
  'parotta': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Kaisersemmel-.jpg/800px-Kaisersemmel-.jpg',
  'fish': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Salmon_raw.jpg/800px-Salmon_raw.jpg',
  'rice': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Uncooked_rice.jpg/800px-Uncooked_rice.jpg',
  'oil': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Olive_oil_from_One_Two_Free.jpg/800px-Olive_oil_from_One_Two_Free.jpg',
  'ghee': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Supreme_cut_butter.jpg/800px-Supreme_cut_butter.jpg',
  'tea': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/800px-A_small_cup_of_coffee.JPG',
  'coffee': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/800px-A_small_cup_of_coffee.JPG',
  'egg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Egg_white.jpg/800px-Egg_white.jpg',

  // Category real photo fallbacks
  'fruits': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Red_Apple.jpg/800px-Red_Apple.jpg',
  'vegetables': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Tomato_je.jpg/800px-Tomato_je.jpg',
  'dairy': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Milk_glass.jpg/800px-Milk_glass.jpg',
  'bakery': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Kaisersemmel-.jpg/800px-Kaisersemmel-.jpg',
  'beverages': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/800px-A_small_cup_of_coffee.JPG',
  'staples': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Uncooked_rice.jpg/800px-Uncooked_rice.jpg',
  'default': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Red_Apple.jpg/800px-Red_Apple.jpg'
};

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
  const realPhoto = getRealPhotoFallback(alt, categoryName);
  const isValidSource = src && typeof src === 'string' && src.trim().startsWith('http') && !src.startsWith('data:');
  
  const [imgSrc, setImgSrc] = useState(isValidSource ? src : realPhoto);

  useEffect(() => {
    const valid = src && typeof src === 'string' && src.trim().startsWith('http') && !src.startsWith('data:');
    setImgSrc(valid ? src : realPhoto);
  }, [src, alt, categoryName, realPhoto]);

  return (
    <img
      src={imgSrc}
      alt={alt || 'Grocery item'}
      className={className}
      onError={() => {
        if (imgSrc !== realPhoto) {
          setImgSrc(realPhoto);
        }
      }}
      loading="lazy"
    />
  );
};

export default ImageWithFallback;
