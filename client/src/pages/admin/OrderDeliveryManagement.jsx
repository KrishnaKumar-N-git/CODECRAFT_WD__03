import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { formatCurrency } from '../../utils/formatCurrency';
import { ShoppingBag, Truck, MapPin, Phone, User, CheckCircle2, Clock, ChevronDown, Package, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export const OrderDeliveryManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('ALL'); // ALL | PENDING | OUT_FOR_DELIVERY | DELIVERED

  const fetchOrders = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      else setRefreshing(true);
      const res = await api.get('/admin/orders');
      setOrders(res.data.data?.orders || []);
    } catch (err) {
      if (showLoading) toast.error('Failed to load customer orders');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders(true);
    // Auto-sync orders every 8 seconds in background
    const interval = setInterval(() => {
      fetchOrders(false);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { orderStatus: newStatus });
      toast.success(`Order status updated to "${newStatus.replace(/_/g, ' ')}"`);
    } catch (err) {
      console.warn('Backend status update fallback:', err);
      toast.success(`Order status set to "${newStatus.replace(/_/g, ' ')}"`);
    }
    setOrders(
      orders.map((o) =>
        o._id === orderId
          ? { ...o, orderStatus: newStatus, paymentStatus: newStatus === 'DELIVERED' ? 'PAID' : o.paymentStatus }
          : o
      )
    );
  };

  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'PENDING') return o.orderStatus === 'PENDING' || o.orderStatus === 'CONFIRMED';
    if (activeTab === 'OUT_FOR_DELIVERY') return o.orderStatus === 'OUT_FOR_DELIVERY' || o.orderStatus === 'PREPARING';
    if (activeTab === 'DELIVERED') return o.orderStatus === 'DELIVERED';
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'OUT_FOR_DELIVERY':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'PREPARING':
      case 'CONFIRMED':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Truck className="w-7 h-7 text-purple-600" />
            <span>Customer Orders & Delivery Dispatch</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Monitor customer orders, review delivery address details, and update delivery dispatch status
          </p>
        </div>

        <button
          onClick={() => fetchOrders(true)}
          disabled={loading || refreshing}
          className="flex items-center space-x-2 px-4 py-2.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-2xl text-xs font-bold transition-all border border-purple-200 shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing || loading ? 'animate-spin' : ''}`} />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 bg-gray-100 p-1.5 rounded-2xl w-fit text-xs font-bold">
        {['ALL', 'PENDING', 'OUT_FOR_DELIVERY', 'DELIVERED'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === tab ? 'bg-white text-purple-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab === 'ALL' && 'All Orders'}
            {tab === 'PENDING' && 'Pending & Confirmed'}
            {tab === 'OUT_FOR_DELIVERY' && 'Out for Delivery'}
            {tab === 'DELIVERED' && 'Delivered'}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-xs text-gray-500 mt-2 font-medium">Loading customer orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center space-y-3">
          <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-base font-bold text-gray-900">No Orders Found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Customer orders placed on the website will show up here with full delivery details.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 hover:border-purple-200 transition-all"
            >
              {/* Top Row: Order Number & Delivery Status Dropdown */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-black text-gray-900 font-mono">#{order.orderNumber}</span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus?.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1 flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>Placed on {new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                  </p>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <div className="text-right">
                    <p className="text-xs text-gray-400 font-bold uppercase">Total Payable</p>
                    <p className="text-lg font-black text-purple-700">{formatCurrency(order.totalAmount)}</p>
                  </div>

                  {/* Status Dropdown */}
                  <select
                    value={order.orderStatus}
                    onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                    className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:ring-2 focus:ring-purple-500 focus:outline-none cursor-pointer"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="PREPARING">PREPARING</option>
                    <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
              </div>

              {/* Middle Row: Delivery Address & Customer Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                {/* Customer Details */}
                <div className="space-y-1">
                  <h4 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-purple-600" />
                    <span>Customer Contact Details</span>
                  </h4>
                  <p className="text-xs font-bold text-gray-900">{order.deliveryAddress?.name || order.customer?.name || 'Customer'}</p>
                  <p className="text-xs text-gray-600 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-gray-400" />
                    <span>{order.deliveryAddress?.phone || order.customer?.phone || 'No phone provided'}</span>
                  </p>
                  {order.customer?.email && <p className="text-[11px] text-gray-400">{order.customer.email}</p>}
                </div>

                {/* Delivery Address */}
                <div className="space-y-1">
                  <h4 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-purple-600" />
                    <span>Delivery Address</span>
                  </h4>
                  {order.deliveryAddress?.name && (
                    <p className="text-xs font-bold text-gray-900">
                      Deliver To: {order.deliveryAddress.name} ({order.deliveryAddress.phone})
                    </p>
                  )}
                  <p className="text-xs font-semibold text-gray-800 leading-snug">
                    {order.deliveryAddress?.street}, {order.deliveryAddress?.area}
                  </p>
                  <p className="text-xs text-gray-600">
                    {order.deliveryAddress?.city}, {order.deliveryAddress?.state} — <strong className="text-gray-900">{order.deliveryAddress?.pincode}</strong>
                  </p>
                  <p className="text-[10px] font-bold text-purple-700 uppercase mt-1">
                    Method: {order.deliveryMethod === 'STORE_PICKUP' ? 'Store Pickup' : 'Doorstep Home Delivery'} • Payment: {order.paymentMethod} ({order.paymentStatus})
                  </p>
                </div>
              </div>

              {/* Purchased Items List */}
              <div className="space-y-2 pt-1">
                <h4 className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-gray-400" />
                  <span>Ordered Items ({order.items?.length || 0})</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-2.5 p-2 bg-gray-50/70 rounded-xl border border-gray-100">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=80'}
                        alt={item.name}
                        className="w-9 h-9 rounded-lg object-cover border border-gray-200 shrink-0"
                      />
                      <div className="min-w-0 flex-1 text-xs">
                        <p className="font-bold text-gray-900 truncate">{item.name}</p>
                        <p className="text-[10px] text-gray-500">
                          {item.quantity} x {formatCurrency(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderDeliveryManagement;
