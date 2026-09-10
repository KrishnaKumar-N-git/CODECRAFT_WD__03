import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { formatCurrency } from '../../utils/formatCurrency';
import { ShoppingBag, Clock, CheckCircle, Truck, PackageCheck, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const StoreOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders/store/manage');
      setOrders(res.data.data?.orders || []);
    } catch (err) {
      console.error('Failed to load store orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      setOrders(orders.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o)));
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const filtered = orders.filter((o) => (filterStatus === 'ALL' ? true : o.orderStatus === filterStatus));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-7 h-7 text-emerald-600" />
            <span>Store Order Fulfillment</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage order processing pipeline and update customer delivery status</p>
        </div>

        {/* Filter Status Pills */}
        <div className="flex bg-gray-100 p-1.5 rounded-2xl overflow-x-auto space-x-1 text-xs font-bold">
          {['ALL', 'CONFIRMED', 'PACKING', 'OUT_FOR_DELIVERY', 'DELIVERED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                filterStatus === status ? 'bg-white text-emerald-800 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {status.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="text-xs text-gray-500 mt-2">Loading store orders...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-3">
          <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto" />
          <h4 className="text-sm font-bold text-gray-900">No Orders Available</h4>
          <p className="text-xs text-gray-500">There are no customer orders matching the selected status filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <div key={order._id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-black text-gray-900 text-sm">{order.orderNumber}</h3>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-full">
                      {order.orderStatus}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Customer: {order.customer?.name || 'Walk-in'} ({order.deliveryAddress?.phone || 'N/A'})
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-base font-black text-emerald-700">{formatCurrency(order.totalAmount)}</span>
                  <select
                    value={order.orderStatus}
                    onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                    className="p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="PACKING">PACKING</option>
                    <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
              </div>

              {/* Items List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-2xl border border-gray-100 flex items-center space-x-3 text-xs">
                    {item.image && <img src={item.image} alt={item.name} className="w-10 h-10 rounded-xl object-cover" />}
                    <div>
                      <p className="font-bold text-gray-900 truncate max-w-[130px]">{item.name}</p>
                      <p className="text-[10px] text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StoreOrders;
