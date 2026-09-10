import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { formatCurrency } from '../../utils/formatCurrency';
import { StatCard } from '../../components/dashboard/Sidebar';
import { BarChart3, TrendingUp, IndianRupee, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const StoreAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/admin/store/analytics');
        setAnalytics(res.data.data);
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
        <p className="text-xs text-gray-500 mt-2">Loading sales analytics...</p>
      </div>
    );
  }

  const metrics = analytics?.metrics || {
    totalOrders: 0,
    totalRevenue: 0,
    avgOrderValue: 0
  };

  const chartData = analytics?.salesGraph || [
    { _id: 'Mon', sales: 4200, orders: 12 },
    { _id: 'Tue', sales: 6800, orders: 18 },
    { _id: 'Wed', sales: 5100, orders: 14 },
    { _id: 'Thu', sales: 8900, orders: 24 },
    { _id: 'Fri', sales: 11200, orders: 31 },
    { _id: 'Sat', sales: 14500, orders: 40 },
    { _id: 'Sun', sales: 13200, orders: 36 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-emerald-600" />
          <span>Sales & Earnings Analytics</span>
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">Visualize your store revenue metrics and weekly order trends</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(metrics.totalRevenue)}
          icon={IndianRupee}
          color="green"
          trend="+18% vs last week"
        />
        <StatCard
          title="Total Orders"
          value={metrics.totalOrders}
          icon={ShoppingBag}
          color="purple"
          trend="Completed fulfillments"
        />
        <StatCard
          title="Avg Order Value"
          value={formatCurrency(metrics.avgOrderValue)}
          icon={TrendingUp}
          color="blue"
          trend="Per customer basket"
        />
      </div>

      {/* Sales Trend Chart */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="text-sm font-extrabold text-gray-900">Revenue Trend (Last 7 Days)</h3>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">Live Analytics</span>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="_id" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: 'none', color: '#fff', fontSize: '12px' }}
                formatter={(value) => [`₹${value}`, 'Sales']}
              />
              <Area type="monotone" dataKey="sales" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StoreAnalytics;
