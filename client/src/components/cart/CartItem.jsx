import React from 'react';
import { Trash2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import { QuantitySelector } from '../product/ProductGallery';
import { useCart } from '../../context/CartContext';

export const CartItem = ({ item }) => {
  const { updateQty, removeFromCart } = useCart();
  const product = item.product || {};
  const DEFAULT_CART_IMAGE = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop';
  const getImg = (imgObj) => (typeof imgObj === 'string' ? imgObj : imgObj?.url);
  const image = getImg(product.images?.[0]) || item.image || DEFAULT_CART_IMAGE;

  return (
    <div className="flex items-center space-x-4 py-4 border-b border-gray-100 last:border-0">
      {/* Product Image */}
      <img
        src={image}
        alt={product.name}
        referrerPolicy="no-referrer"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = DEFAULT_CART_IMAGE;
        }}
        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl bg-gray-50 border border-gray-100 shrink-0"
      />


      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate">{product.name}</h4>
        <p className="text-[11px] text-gray-500">{product.brand} • {product.weight}</p>
        <div className="flex items-baseline space-x-2 mt-1">
          <span className="text-xs sm:text-sm font-extrabold text-gray-900">
            {formatCurrency(item.price)}
          </span>
          {product.mrp > item.price && (
            <span className="text-[11px] text-gray-400 line-through">
              {formatCurrency(product.mrp)}
            </span>
          )}
        </div>
      </div>

      {/* Quantity & Actions */}
      <div className="flex items-center space-x-3 shrink-0">
        <QuantitySelector
          quantity={item.quantity}
          onDecrease={() => updateQty(product._id, item.quantity - 1)}
          onIncrease={() => updateQty(product._id, item.quantity + 1)}
          max={product.stock || 99}
        />

        <button
          onClick={() => removeFromCart(product._id)}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const CartSummary = ({ subtotal = 0, deliveryFee = 30, onCheckout, checkoutBtnText = 'Proceed to Checkout' }) => {
  const total = subtotal + deliveryFee;

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
      <h3 className="text-sm font-extrabold text-gray-900 border-b border-gray-100 pb-3">
        Price Summary
      </h3>

      <div className="space-y-2 text-xs">
        <div className="flex justify-between text-gray-600">
          <span>Items Subtotal</span>
          <span className="font-semibold text-gray-900">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Estimated Delivery Fee</span>
          <span className="font-semibold text-gray-900">{formatCurrency(deliveryFee)}</span>
        </div>
        <div className="flex justify-between text-brand-600 font-medium pt-1">
          <span>Store Instant Discount</span>
          <span>Applied</span>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline">
        <span className="text-sm font-extrabold text-gray-900">Total Payable</span>
        <span className="text-lg font-black text-brand-600">{formatCurrency(total)}</span>
      </div>

      {onCheckout && (
        <button
          onClick={onCheckout}
          className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-extrabold transition-all shadow-md shadow-brand-600/30 flex items-center justify-center space-x-2"
        >
          <span>{checkoutBtnText}</span>
        </button>
      )}
    </div>
  );
};

export default CartItem;
