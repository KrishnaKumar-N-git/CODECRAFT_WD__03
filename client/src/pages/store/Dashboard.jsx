import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { StatCard } from '../../components/dashboard/Sidebar';
import { formatCurrency } from '../../utils/formatCurrency';
import {
  ShoppingBag,
  Package,
  AlertTriangle,
  IndianRupee,
  TrendingUp,
  PlusCircle,
  Clock,
  ArrowRight,
  Store
} from 'lucide-react';
import toast from 'react-hot-toast';

export const StoreDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/admin/store/analytics');
        setData(res.data.data);
      } catch (err) {
        console.error('Failed to load store analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="py-16 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto"></div>
        <p className="text-xs text-gray-500 mt-2 font-medium">Loading Store Dashboard...</p>
      </div>
    );
  }

  const metrics = data?.metrics || {
    totalOrders: 0,
    totalProducts: 0,
    lowStockProducts: 0,
    totalRevenue: 0,
    avgOrderValue: 0
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-emerald-950 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Store className="w-4 h-4" />
            <span>Store Owner Portal</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight mt-1">Welcome back to your Shop Dashboard</h1>
          <p className="text-xs text-gray-300 mt-0.5">Manage inventory, fulfill orders, and monitor daily grocery sales.</p>
        </div>

        <Link
          to="/store/products/new"
          className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs flex items-center space-x-2 transition-all shadow-lg shadow-emerald-600/30 shrink-0 self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Store Sales"
          value={formatCurrency(metrics.totalRevenue)}
          icon={IndianRupee}
          color="green"
          trend="Live revenue balance"
        />
        <StatCard
          title="Total Orders"
          value={metrics.totalOrders}
          icon={ShoppingBag}
          color="purple"
          trend="Customer orders placed"
        />
        <StatCard
          title="Active Products"
          value={metrics.totalProducts}
          icon={Package}
          color="blue"
          trend="Items listed in catalog"
        />
        <StatCard
          title="Low Stock Alerts"
          value={metrics.lowStockProducts}
          icon={AlertTriangle}
          color="amber"
          trend="Stock < threshold"
        />
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-gray-900">Manage Store Orders</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Review incoming orders, update status to packing, and dispatch for delivery.
          </p>
          <Link
            to="/store/orders"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-800"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-gray-900">Inventory & Stock</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Update prices, adjust stock levels, and set low stock warnings for fast replenishment.
          </p>
          <Link
            to="/store/inventory"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-600 hover:text-blue-800"
          >
            <span>Check Inventory</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
          <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-gray-900">Store Performance</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Track daily order volume, revenue charts, and customer ratings.
          </p>
          <Link
            to="/store/analytics"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-purple-600 hover:text-purple-800"
          >
            <span>View Sales Analytics</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StoreDashboard;
