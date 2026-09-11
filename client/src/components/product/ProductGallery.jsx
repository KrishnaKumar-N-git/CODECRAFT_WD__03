import React, { useState } from 'react';

const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop';

export const ProductGallery = ({ images = [] }) => {
  const imageList = images.length > 0 ? images : [{ url: DEFAULT_FALLBACK_IMAGE }];
  const [selectedImage, setSelectedImage] = useState(imageList[0]?.url || imageList[0] || DEFAULT_FALLBACK_IMAGE);

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 aspect-square flex items-center justify-center relative overflow-hidden group">
        <img
          src={selectedImage}
          alt="Product detail"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = DEFAULT_FALLBACK_IMAGE;
          }}
          className="w-full h-full object-contain max-h-[420px] transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Thumbnail Gallery */}
      {imageList.length > 1 && (
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {imageList.map((imgObj, idx) => {
            const imgUrl = typeof imgObj === 'string' ? imgObj : imgObj.url;
            return (
              <button
                key={idx}
                onClick={() => setSelectedImage(imgUrl)}
                className={`w-16 h-16 rounded-xl border-2 overflow-hidden bg-gray-50 flex-shrink-0 transition-all ${
                  selectedImage === imgUrl ? 'border-brand-600 shadow-sm scale-105' : 'border-gray-200 opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`Thumbnail ${idx}`}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = DEFAULT_FALLBACK_IMAGE;
                  }}
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
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
