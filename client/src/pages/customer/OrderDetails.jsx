import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { formatCurrency } from '../../utils/formatCurrency';
import {
  Package,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  Store,
  CreditCard,
  ArrowLeft,
  PhoneCall,
  ShieldCheck,
  Building2
} from 'lucide-react';
import toast from 'react-hot-toast';

export const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const res = await orderService.getOrderById(id);
      const orderObj = res.data?.order || res.order;
      setOrder(orderObj);
    } catch (err) {
      if (showLoading) toast.error('Failed to load order details');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder(true);
    const interval = setInterval(() => {
      fetchOrder(false);
    }, 8000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading) {
    return (
      <div className="py-16 text-center space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto"></div>
        <p className="text-xs text-gray-500 font-medium">Fetching order status...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-4">
        <Package className="w-16 h-16 text-gray-300 mx-auto" />
        <h3 className="text-lg font-bold text-gray-900">Order Not Found</h3>
        <Link to="/orders" className="text-xs font-bold text-emerald-600">Back to My Orders</Link>
      </div>
    );
  }

  const steps = [
    { key: 'CONFIRMED', label: 'Order Confirmed', desc: 'Vendor accepted your order' },
    { key: 'PACKING', label: 'Packing Grocery Items', desc: 'Fresh items picked & packed' },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', desc: 'Delivery partner on the way' },
    { key: 'DELIVERED', label: 'Order Delivered', desc: 'Handed over at doorstep' }
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === order.orderStatus);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link
          to="/orders"
          className="flex items-center space-x-2 text-xs font-bold text-gray-600 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Orders</span>
        </Link>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono font-black bg-emerald-50 text-emerald-900 px-3 py-1.5 rounded-xl border border-emerald-200">
            Tracking ID: #{order.orderNumber}
          </span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(order.orderNumber);
              toast.success(`Tracking ID #${order.orderNumber} copied!`);
            }}
            className="text-[11px] font-bold text-emerald-700 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-300 bg-white transition-colors"
          >
            Copy Tracking ID
          </button>
        </div>
      </div>

      {/* Live Order Tracking Stepper Card */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-xl font-black text-gray-900">Live Order Status</h2>
            <p className="text-xs text-gray-500">
              Placed on {new Date(order.createdAt).toLocaleString('en-IN')}
            </p>
          </div>
          <div className="text-right">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-extrabold rounded-full">
              {order.orderStatus.replace(/_/g, ' ')}
            </span>
          </div>
        </div>

        {/* Stepper graphical bar */}
        {order.orderStatus !== 'CANCELLED' && (
          <div className="py-4">
            <div className="grid grid-cols-4 gap-2 relative">
              {steps.map((step, idx) => {
                const isDone = currentStepIndex >= idx;
                const isCurrent = currentStepIndex === idx;

                return (
                  <div key={step.key} className="flex flex-col items-center text-center space-y-2 relative z-10">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        isDone
                          ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                          : 'bg-gray-100 text-gray-400 border border-gray-200'
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                    </div>
                    <div>
                      <h4 className={`text-xs font-extrabold ${isCurrent ? 'text-emerald-800' : 'text-gray-700'}`}>
                        {step.label}
                      </h4>
                      <p className="text-[10px] text-gray-400 hidden sm:block mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Grid: Order Items & Delivery Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Items breakdown */}
        <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-gray-900 border-b border-gray-100 pb-3">
            Itemized Grocery Receipt ({order.items?.length} items)
          </h3>

          <div className="space-y-3">
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/70 border border-gray-100">
                <div className="flex items-center space-x-3">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover border border-gray-200" />
                  ) : (
                    <Package className="w-10 h-10 text-gray-400" />
                  )}
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">{item.name}</h4>
                    <p className="text-[10px] text-gray-500">{item.weight || 'Standard Pack'}</p>
                    <p className="text-[11px] font-semibold text-emerald-700 mt-0.5">
                      ₹{item.price} × {item.quantity}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs font-black text-gray-900">{formatCurrency(item.subtotal || item.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-2 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-gray-900">{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="font-bold text-gray-900">{formatCurrency(order.deliveryFee)}</span>
            </div>
            <div className="flex justify-between text-base font-black text-gray-900 pt-2 border-t border-gray-100">
              <span>Total Amount Paid</span>
              <span className="text-emerald-700">{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Right: Vendor & Address Info */}
        <div className="space-y-6">
          {/* Store Info Card */}
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-gray-900 border-b border-gray-100 pb-2">
              <Store className="w-4 h-4 text-emerald-600" />
              <span>Fulfilled By Store</span>
            </div>

            <div>
              <h4 className="text-xs font-black text-gray-900">{order.store?.name || 'APK Grocery Stores'}</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">{order.store?.address?.area || 'Local Kirana Partner'}</p>
              {order.store?.phone && (
                <a
                  href={`tel:${order.store.phone}`}
                  className="mt-2 text-[11px] font-bold text-emerald-700 bg-emerald-50 py-1.5 px-3 rounded-xl inline-flex items-center space-x-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Store Owner</span>
                </a>
              )}
            </div>
          </div>

          {/* Delivery Address Card */}
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-gray-900 border-b border-gray-100 pb-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Delivery Location</span>
            </div>

            <div className="text-xs space-y-1">
              <p className="font-bold text-gray-900">{order.deliveryAddress?.name}</p>
              <p className="text-[11px] text-gray-500">{order.deliveryAddress?.phone}</p>
              <p className="text-[11px] text-gray-700 leading-snug">
                {order.deliveryAddress?.street}, {order.deliveryAddress?.area}, {order.deliveryAddress?.city} ({order.deliveryAddress?.pincode})
              </p>
            </div>
          </div>

          {/* Payment Info Card */}
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-gray-900 border-b border-gray-100 pb-2">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>Payment Details</span>
            </div>

            <div className="text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-gray-500">Method</span>
                <span className="font-bold text-gray-900">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Status</span>
                <span className={`font-bold ${order.paymentStatus === 'PAID' ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
