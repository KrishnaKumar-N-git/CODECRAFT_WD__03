import React, { useState } from 'react';
import { ImageWithFallback } from '../common/ImageWithFallback';

export const ProductGallery = ({ images = [], productName = '', categoryName = '' }) => {
  const getImgUrl = (img) => (typeof img === 'string' ? img : img?.url);
  const validImages = images
    .map(getImgUrl)
    .filter((url) => url && typeof url === 'string' && url.startsWith('http'));

  const finalImageList = validImages.length > 0 ? validImages : [''];
  const [selectedImage, setSelectedImage] = useState(finalImageList[0]);

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 aspect-square flex items-center justify-center relative overflow-hidden group shadow-sm">
        <ImageWithFallback
          src={selectedImage}
          alt={productName}
          categoryName={categoryName}
          className="w-full h-full object-contain max-h-[420px] transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Thumbnail Gallery */}
      {finalImageList.length > 1 && (
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {finalImageList.map((imgUrl, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(imgUrl)}
              className={`w-16 h-16 rounded-2xl border-2 overflow-hidden bg-gray-50 flex-shrink-0 transition-all ${
                selectedImage === imgUrl ? 'border-brand-600 shadow-md scale-105' : 'border-gray-200 opacity-70 hover:opacity-100'
              }`}
            >
              <ImageWithFallback
                src={imgUrl}
                alt={`${productName} thumbnail ${idx}`}
                categoryName={categoryName}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const QuantitySelector = ({ quantity = 1, onDecrease, onIncrease, min = 1, max = 99 }) => {
  return (
    <div className="flex items-center space-x-3 bg-gray-100 p-1.5 rounded-xl border border-gray-200 w-fit">
      <button
        type="button"
        disabled={quantity <= min}
        onClick={onDecrease}
        className="w-8 h-8 rounded-lg bg-white text-gray-700 font-bold hover:bg-gray-200 disabled:opacity-30 transition-colors flex items-center justify-center text-base shadow-sm"
      >
        -
      </button>
      <span className="w-8 text-center text-sm font-extrabold text-gray-900">{quantity}</span>
      <button
        type="button"
        disabled={quantity >= max}
        onClick={onIncrease}
        className="w-8 h-8 rounded-lg bg-brand-600 text-white font-bold hover:bg-brand-700 disabled:opacity-30 transition-colors flex items-center justify-center text-base shadow-sm"
      >
        +
      </button>
    </div>
  );
};
