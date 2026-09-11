import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ChevronRight, Clock } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import { getProductSvg } from '../../utils/grocerySvgLibrary';

export const OrderCard = ({ order, onCancel }) => {
  const isCancellable = ['PENDING', 'CONFIRMED'].includes(order.orderStatus);

  const statusColors = {
    PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
    CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-200',
    PACKING: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    READY_FOR_PICKUP: 'bg-purple-50 text-purple-700 border-purple-200',
    OUT_FOR_DELIVERY: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    DELIVERED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    CANCELLED: 'bg-red-50 text-red-700 border-red-200'
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-gray-100 pb-3 gap-2">
        <div>
          <span className="text-xs font-black text-gray-900 block">{order.orderNumber}</span>
          <span className="text-[11px] text-gray-400 flex items-center space-x-1 mt-0.5">
            <Clock className="w-3 h-3" />
            <span>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className={`px-2.5 py-1 text-[10px] font-extrabold rounded-full border ${statusColors[order.orderStatus] || 'bg-gray-50'}`}>
            {order.orderStatus.replace(/_/g, ' ')}
          </span>
          <span className={`px-2.5 py-1 text-[10px] font-extrabold rounded-full ${order.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
            {order.paymentStatus}
          </span>
        </div>
      </div>

      {/* Product Thumbnails Snapshot */}
      <div className="flex items-center space-x-3 overflow-x-auto py-1">
        {order.items?.map((item, idx) => (
          <div key={idx} className="relative group shrink-0">
            <img
              src={(item.image && typeof item.image === 'string' && !item.image.includes('unsplash.com') && !item.image.includes('via.placeholder')) ? item.image : getProductSvg(item.name)}
              alt={item.name}
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = getProductSvg(item.name);
              }}
              className="w-14 h-14 object-cover rounded-xl bg-gray-50 border border-gray-100"
            />

            <span className="absolute -top-1.5 -right-1.5 bg-gray-900 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {item.quantity}
            </span>
          </div>
        ))}
        <div className="pl-2">
          <p className="text-xs font-bold text-gray-900">{order.items?.length} Items</p>
          <p className="text-xs font-extrabold text-brand-600">{formatCurrency(order.totalAmount)}</p>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        {isCancellable && onCancel ? (
          <button
            onClick={() => onCancel(order._id)}
            className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline"
          >
            Cancel Order
          </button>
        ) : (
          <span className="text-[11px] text-gray-400 font-medium">
            {order.deliveryMethod === 'STORE_PICKUP' ? 'Store Pickup' : 'Home Delivery'}
          </span>
        )}

        <Link
          to={`/orders/${order._id}`}
          className="inline-flex items-center space-x-1 text-xs font-bold text-brand-600 hover:text-brand-700"
        >
          <span>Track Order</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default OrderCard;
