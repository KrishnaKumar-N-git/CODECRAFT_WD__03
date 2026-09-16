import React, { useState, useEffect } from 'react';
import { getProductSvg } from '../../utils/grocerySvgLibrary';

export const ImageWithFallback = ({
  src,
  alt = '',
  categoryName = '',
  className = ''
}) => {
  const fallbackSvg = getProductSvg(alt, categoryName);
  const isValidSource = src && typeof src === 'string' && src.trim().startsWith('http') && !src.startsWith('data:');

  const [imgSrc, setImgSrc] = useState(isValidSource ? src : fallbackSvg);

  useEffect(() => {
    const valid = src && typeof src === 'string' && src.trim().startsWith('http') && !src.startsWith('data:');
    setImgSrc(valid ? src : getProductSvg(alt, categoryName));
  }, [src, alt, categoryName]);

  return (
    <img
      src={imgSrc}
      alt={alt || 'Grocery product'}
      className={className}
      referrerPolicy="no-referrer"
      onError={() => {
        const fallback = getProductSvg(alt, categoryName);
        if (imgSrc !== fallback) {
          setImgSrc(fallback);
        }
      }}
      loading="lazy"
    />
  );
};

export default ImageWithFallback;
