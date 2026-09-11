import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { formatCurrency } from '../../utils/formatCurrency';
import { Package, Clock, CheckCircle2, Truck, ChevronRight, ShoppingBag, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { getProductSvg } from '../../utils/grocerySvgLibrary';

export const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('ALL'); // ALL | ACTIVE | DELIVERED | CANCELLED

  const fetchOrders = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      else setRefreshing(true);
      const res = await orderService.getMyOrders();
      setOrders(res.data?.orders || res.orders || []);
    } catch (err) {
      if (showLoading) toast.error('Failed to load orders');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders(true);
    const interval = setInterval(() => {
      fetchOrders(false);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (activeTab === 'ACTIVE') return ['PENDING', 'CONFIRMED', 'PACKING', 'OUT_FOR_DELIVERY'].includes(order.orderStatus);
    if (activeTab === 'DELIVERED') return order.orderStatus === 'DELIVERED';
    if (activeTab === 'CANCELLED') return order.orderStatus === 'CANCELLED';
    return true;
  });

  const getStatusBadge = (status) => {
    const badgeStyles = {
      DELIVERED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      OUT_FOR_DELIVERY: 'bg-blue-100 text-blue-800 border-blue-200',
      PACKING: 'bg-amber-100 text-amber-800 border-amber-200',
      CONFIRMED: 'bg-purple-100 text-purple-800 border-purple-200',
      PENDING: 'bg-gray-100 text-gray-800 border-gray-200',
      CANCELLED: 'bg-red-100 text-red-800 border-red-200'
    };

    return (
      <span className={`px-3 py-1 text-[11px] font-extrabold rounded-full border ${badgeStyles[status] || 'bg-gray-100'}`}>
        {status.replace(/_/g, ' ')}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="py-16 text-center space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto"></div>
        <p className="text-xs text-gray-500 font-medium">Loading your grocery orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-7 h-7 text-emerald-600" />
            <span>My Grocery Orders</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">Track your instant 15-min deliveries and past orders</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => fetchOrders(true)}
            disabled={loading || refreshing}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-2xl text-xs font-bold transition-all border border-emerald-200 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing || loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          {/* Filter Tabs */}
          <div className="flex bg-gray-100 p-1.5 rounded-2xl space-x-1 text-xs font-bold">
            {['ALL', 'ACTIVE', 'DELIVERED', 'CANCELLED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === tab ? 'bg-white text-emerald-800 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>
    </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-4">
          <Package className="w-16 h-16 text-gray-300 mx-auto" />
          <h3 className="text-lg font-bold text-gray-900">No Orders Found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">You haven't placed any grocery orders in this category yet.</p>
          <Link
            to="/shop"
            className="inline-block px-6 py-3 bg-emerald-600 text-white font-bold rounded-2xl text-xs hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
          >
            Start Shopping Now
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-black text-gray-900 font-mono tracking-tight bg-gray-100 px-3 py-1 rounded-xl border border-gray-200">
                      Tracking ID: #{order.orderNumber}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(order.orderNumber);
                        toast.success(`Tracking ID #${order.orderNumber} copied!`);
                      }}
                      className="text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors"
                      title="Copy Tracking ID"
                    >
                      Copy ID
                    </button>
                    {getStatusBadge(order.orderStatus)}
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Placed on: {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-black text-emerald-800">{formatCurrency(order.totalAmount)}</p>
                  <p className="text-[10px] text-gray-500 font-semibold uppercase">{order.paymentMethod} • {order.paymentStatus}</p>
                </div>
              </div>

              {/* Items Summary */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3 overflow-x-auto py-1">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-2 shrink-0 bg-gray-50 p-2 rounded-xl border border-gray-100">
                      {item.image && (
                        <img
                          src={(item.image && typeof item.image === 'string' && !item.image.includes('unsplash.com') && !item.image.includes('via.placeholder')) ? item.image : getProductSvg(item.name)}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = getProductSvg(item.name);
                          }}
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <p className="font-bold text-gray-900 truncate max-w-[130px]">{item.name}</p>
                        <p className="text-[10px] text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  to={`/orders/${order._id}`}
                  className="px-4 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center space-x-1 shrink-0 ml-4 transition-colors"
                >
                  <span>Track Order</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
