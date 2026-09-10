import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import CartItem from '../../components/cart/CartItem';
import CartSummary from '../../components/cart/CartSummary';
import EmptyState from '../../components/common/EmptyState';
import { ShoppingBag, ArrowLeft, Trash2, MapPin } from 'lucide-react';

export const Cart = () => {
  const { cart, loading, clearCart } = useCart();
  const navigate = useNavigate();

  const items = cart.items || [];
  const isEmpty = items.length === 0;

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <EmptyState
        title="Your cart is empty."
        message="No groceries yet? Start shopping fresh everyday essentials."
        icon={ShoppingBag}
        action={
          <Link
            to="/shop"
            className="inline-block px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-brand-600/30"
          >
            Start Shopping Groceries
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-brand-600" /> Shopping Cart
          </h1>
          <p className="text-xs text-gray-500">{items.length} items in your cart</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={clearCart}
            className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center space-x-1 px-3 py-2 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Cart</span>
          </button>

          <Link
            to="/shop"
            className="text-xs font-bold text-gray-700 hover:text-brand-600 flex items-center space-x-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>

      {/* Store Banner */}
      {cart.store && (
        <div className="p-4 bg-brand-50 border border-brand-100 rounded-2xl flex items-center justify-between text-xs text-brand-900 font-medium">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
            <span>Fulfilled by: <strong>{cart.store.name}</strong></span>
          </div>
          <span>Delivery Fee: ₹{cart.store.deliveryFee || 30}</span>
        </div>
      )}

      {/* Cart Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items List */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm divide-y divide-gray-100">
          {items.map((item) => (
            <CartItem key={item.product?._id || item._id} item={item} />
          ))}
        </div>

        {/* Cart Price Summary */}
        <div>
          <CartSummary
            subtotal={cart.subtotal}
            deliveryFee={cart.store?.deliveryFee || 30}
            onCheckout={() => navigate('/checkout')}
            checkoutBtnText="Proceed to Checkout"
          />
        </div>
      </div>
    </div>
  );
};

export default Cart;
