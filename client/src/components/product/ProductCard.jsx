import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, AlertCircle, Plus, Minus } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

import { getProductSvg } from '../../utils/grocerySvgLibrary';

export const ProductCard = ({ product }) => {
  const { cart, addToCart, updateQty } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const fallbackSvg = getProductSvg(product.name, product.category?.name);
  const getImageUrl = (img) => (typeof img === 'string' ? img : img?.url);
  const rawImg = getImageUrl(product.images?.find((img) => img?.isPrimary)) || getImageUrl(product.images?.[0]);
  const primaryImage = (rawImg && typeof rawImg === 'string' && rawImg.startsWith('http'))
    ? rawImg
    : fallbackSvg;
  const isWishlisted = isInWishlist(product._id);

  const cartItem = cart?.items?.find((item) => item.product?._id === product._id);
  const currentQty = cartItem?.quantity || 0;

  const isLowStock = product.stock > 0 && product.stock <= (product.lowStockThreshold || 10);
  const isOutOfStock = product.stock === 0;

  return (
    <div className="group bg-white rounded-3xl border border-emerald-100/80 p-4 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
      {/* BigBasket Discount Ribbon */}
      {product.discountPercentage > 0 && (
        <span className="absolute top-3 left-3 z-10 bg-emerald-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md">
          {product.discountPercentage}% OFF
        </span>
      )}

      {/* Wishlist Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          toggleWishlist(product._id);
        }}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition-all ${
          isWishlisted
            ? 'bg-red-50 text-red-500 shadow-md'
            : 'bg-white/80 text-gray-400 hover:text-red-500 hover:bg-white'
        }`}
        title="Add to wishlist"
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
      </button>

      {/* Product Image Link */}
      <Link to={`/product/${product.slug || product._id}`} className="block relative mb-3 overflow-hidden rounded-2xl bg-emerald-50/30 aspect-square">
        <img
          src={primaryImage}
          alt={product.name}
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = fallbackSvg;
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-red-600 text-white text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Product Details */}
      <div className="space-y-1.5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[10px] font-bold text-gray-500 mb-0.5">
            <span className="text-emerald-800 font-extrabold uppercase tracking-wide truncate max-w-[120px]">
              {product.brand || 'Fresh Daily'}
            </span>
            <span className="font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">{product.weight || '1 Pack'}</span>
          </div>

          <Link to={`/product/${product.slug || product._id}`} className="block">
            <h3 className="text-xs font-black text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>

        <div>
          {/* Rating */}
          <div className="flex items-center space-x-1 my-1">
            <div className="flex items-center bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md text-[10px] font-black border border-amber-200/80">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500 mr-1" />
              <span>{product.rating || 4.8}</span>
            </div>
            {isLowStock && (
              <span className="text-[10px] text-amber-600 font-bold ml-auto flex items-center">
                <AlertCircle className="w-3 h-3 mr-0.5" /> Only {product.stock} left
              </span>
            )}
          </div>

          {/* Pricing */}
          <div className="flex items-baseline space-x-2 pt-1">
            <span className="text-lg font-black text-emerald-950">
              {formatCurrency(product.sellingPrice)}
            </span>
            {product.mrp > product.sellingPrice && (
              <span className="text-xs text-gray-400 line-through font-semibold">
                {formatCurrency(product.mrp)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Add to Cart / Qty Counter Component */}
      {currentQty > 0 ? (
        <div className="mt-3 flex items-center justify-between bg-emerald-700 text-white rounded-2xl p-1 shadow-md">
          <button
            onClick={() => updateQty(product._id, currentQty - 1)}
            className="w-8 h-8 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white flex items-center justify-center font-black transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="text-xs font-black px-3">{currentQty}</span>
          <button
            onClick={() => addToCart(product._id, 1)}
            className="w-8 h-8 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white flex items-center justify-center font-black transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          disabled={isOutOfStock}
          onClick={() => addToCart(product._id, 1)}
          className="mt-3 w-full py-2.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-200 flex items-center justify-center space-x-1.5 border border-emerald-200 hover:border-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{isOutOfStock ? 'Sold Out' : 'ADD TO CART'}</span>
        </button>
      )}
    </div>
  );
};

export default ProductCard;
