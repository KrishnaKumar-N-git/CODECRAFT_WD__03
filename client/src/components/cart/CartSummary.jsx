import React from 'react';
import { ShieldCheck, Truck, Tag } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

/**
 * CartSummary — shows price breakdown and checkout CTA
 * Props:
 *  subtotal       {number}   - sum of item prices
 *  deliveryFee    {number}   - store delivery fee
 *  onCheckout     {function} - callback for checkout button
 *  checkoutBtnText{string}   - optional button label
 */
const CartSummary = ({
  subtotal = 0,
  deliveryFee = 30,
  onCheckout,
  checkoutBtnText = 'Proceed to Checkout',
}) => {
  const total = subtotal + deliveryFee;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-5 sticky top-24">
      <h2 className="text-base font-extrabold text-gray-900 tracking-tight">Order Summary</h2>

      {/* Price breakdown */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span className="font-semibold text-gray-800">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span className="flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 text-brand-500" /> Delivery Fee
          </span>
          <span className="font-semibold text-gray-800">
            {deliveryFee === 0 ? (
              <span className="text-green-600 font-bold">FREE</span>
            ) : (
              formatCurrency(deliveryFee)
            )}
          </span>
        </div>
        <div className="border-t border-gray-100 pt-3 flex justify-between font-extrabold text-gray-900 text-base">
          <span>Total</span>
          <span className="text-brand-600">{formatCurrency(total)}</span>
        </div>
      </div>

      {/* Trust badges */}
      <div className="space-y-2 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-green-500 shrink-0" />
          <span>100% Secure Checkout</span>
        </div>
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-brand-500 shrink-0" />
          <span>Best prices guaranteed</span>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        onClick={onCheckout}
        className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white text-sm font-extrabold rounded-2xl transition-all shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2"
      >
        {checkoutBtnText}
      </button>
    </div>
  );
};

export default CartSummary;
