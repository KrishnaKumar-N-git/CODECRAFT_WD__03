import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { StatCard } from '../../components/dashboard/Sidebar';
import { formatCurrency } from '../../utils/formatCurrency';
import {
  ShieldCheck,
  Store,
  Users,
  Package,
  ShoppingBag,
  IndianRupee,
  Lock,
  TrendingUp,
  AlertTriangle,
  QrCode,
  LogOut
} from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    logout();
    toast.success('Admin logged out successfully');
    navigate('/admin-secret-access', { replace: true });
  };

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const res = await api.get('/admin/analytics');
        setData(res.data.data);
      } catch (err) {
        console.error('Admin data fetch error', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="py-16 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mx-auto"></div>
        <p className="text-xs text-gray-500 mt-2 font-medium">Loading Super Admin Control Panel...</p>
      </div>
    );
  }

  const metrics = data?.metrics || {
    totalCustomers: 0,
    totalStoreOwners: 0,
    totalStores: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-slate-950 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-purple-900/40">
        <div>
          <div className="flex items-center space-x-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>Super Admin Secret Control Center</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight mt-1">APK Grocery Administration</h1>
          <p className="text-xs text-gray-300 mt-0.5">
            Restricted Access • Manage store inventory, product catalog, categories, user accounts, and configure UPI QR payment gateway.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <Link
            to="/admin-secret-access/qr-settings"
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl text-xs flex items-center space-x-1.5 transition-all shadow-lg shadow-purple-600/30"
          >
            <QrCode className="w-4 h-4" />
            <span>UPI QR Gateway</span>
          </Link>

          <button
            onClick={handleLogout}
            className="px-4 py-2.5 bg-red-600/80 hover:bg-red-600 text-white font-bold rounded-2xl text-xs flex items-center space-x-1.5 transition-all shadow-lg shadow-red-600/30 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Gross Revenue"
          value={formatCurrency(metrics.totalRevenue)}
          icon={IndianRupee}
          color="purple"
          trend="Store total"
        />
        <StatCard
          title="Total Orders"
          value={metrics.totalOrders}
          icon={ShoppingBag}
          color="green"
          trend="Customer orders"
        />
        <StatCard
          title="Total Customers"
          value={metrics.totalCustomers}
          icon={Users}
          color="blue"
          trend="Shopper accounts"
        />
        <StatCard
          title="Total Products"
          value={metrics.totalProducts}
          icon={Package}
          color="amber"
          trend="Catalog size"
        />
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
          <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-gray-900">Customer Orders & Delivery</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            View placed orders, customer address details, and update delivery dispatch status.
          </p>
          <Link
            to="/admin-secret-access/orders"
            className="inline-flex items-center space-x-1 text-xs font-bold text-amber-600 hover:text-amber-800"
          >
            <span>Customer Orders →</span>
          </Link>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
          <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-gray-900">Catalog & Products</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Add new products, update prices, manage stock inventory & discounts.
          </p>
          <Link
            to="/admin-secret-access/products"
            className="inline-flex items-center space-x-1 text-xs font-bold text-purple-600 hover:text-purple-800"
          >
            <span>Products Catalog →</span>
          </Link>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-gray-900">User Accounts</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            View registered customers, manage admin privileges, and block/unblock accounts.
          </p>
          <Link
            to="/admin-secret-access/users"
            className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-600 hover:text-emerald-800"
          >
            <span>User Accounts →</span>
          </Link>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <QrCode className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-gray-900">UPI QR Gateway</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Configure store UPI ID, merchant display name, and scanner parameters.
          </p>
          <Link
            to="/admin-secret-access/qr-settings"
            className="inline-flex items-center space-x-1 text-xs font-bold text-blue-600 hover:text-blue-800"
          >
            <span>QR Settings →</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
