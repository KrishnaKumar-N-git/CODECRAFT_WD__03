import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Layers,
  ShoppingBag,
  BarChart3,
  Settings,
  Users,
  Store as StoreIcon,
  MessageSquare,
  ShieldCheck,
  ArrowLeft,
  QrCode,
  LogOut
} from 'lucide-react';
import toast from 'react-hot-toast';

export const Sidebar = ({ role = 'STORE_OWNER', isOpen = false, onClose = () => {} }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Admin logged out successfully');
    navigate('/admin-secret-access', { replace: true });
  };

  const storeLinks = [
    { to: '/store/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/store/products', label: 'Products', icon: Package },
    { to: '/store/products/new', label: 'Add Product', icon: PlusCircle },
    { to: '/store/inventory', label: 'Stock Inventory', icon: Package },
    { to: '/store/orders', label: 'Store Orders', icon: ShoppingBag },
    { to: '/store/analytics', label: 'Sales Analytics', icon: BarChart3 },
    { to: '/store/settings', label: 'Store Profile', icon: Settings }
  ];

  const adminLinks = [
    { to: '/admin-secret-access/dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { to: '/admin-secret-access/orders', label: 'Customer Orders', icon: ShoppingBag },
    { to: '/admin-secret-access/products', label: 'Products Catalog', icon: Package },
    { to: '/admin-secret-access/categories', label: 'Category List', icon: Layers },
    { to: '/admin-secret-access/users', label: 'User Accounts', icon: Users },
    { to: '/admin-secret-access/qr-settings', label: 'UPI QR Settings', icon: QrCode }
  ];

  const links = role === 'ADMIN' ? adminLinks : storeLinks;

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-40 transition-opacity"
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-slate-950 text-gray-300 min-h-screen p-4 flex flex-col justify-between shrink-0 border-r border-slate-800 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center space-x-3 px-2 py-3 border-b border-slate-800">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black ${role === 'ADMIN' ? 'bg-purple-600' : 'bg-emerald-600'}`}>
              {role === 'ADMIN' ? <ShieldCheck className="w-5 h-5" /> : <StoreIcon className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-black text-sm text-white tracking-tight">GrocMart</h3>
              <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">{role === 'ADMIN' ? 'Secret Super Admin' : 'Store Owner Portal'}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={onClose}
                  end={link.to === '/admin-secret-access/dashboard' || link.to === '/store/dashboard'}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                      isActive
                        ? role === 'ADMIN'
                          ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                          : 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                        : 'text-gray-400 hover:bg-slate-900 hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-4.5 h-4.5" />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions: Log Out & Return to Storefront */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <button
            onClick={() => {
              onClose();
              handleLogout();
            }}
            className="w-full flex items-center space-x-2 px-3.5 py-2.5 text-xs font-bold text-red-400 hover:text-white hover:bg-red-950/60 rounded-2xl transition-all border border-red-900/30 cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span>Log Out Admin</span>
          </button>

          <NavLink
            to="/"
            onClick={onClose}
            className="flex items-center space-x-2 px-3.5 py-2.5 text-xs font-bold text-gray-400 hover:text-white hover:bg-slate-900 rounded-2xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Marketplace</span>
          </NavLink>
        </div>
      </aside>
    </>
  );
};

export const Header = ({ title, subtitle }) => {
  return (
    <header className="bg-white border-b border-gray-100 py-4 px-6 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-black text-gray-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-gray-500 font-medium">{subtitle}</p>}
      </div>
    </header>
  );
};

export const StatCard = ({ title, value, icon: Icon, color = 'green', trend }) => {
  const colorStyles = {
    green: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    red: 'bg-red-50 text-red-600 border-red-100'
  };

  return (
    <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-black text-gray-900 mt-1">{value}</h3>
        {trend && <p className="text-[11px] text-emerald-600 font-semibold mt-1">{trend}</p>}
      </div>

      <div className={`p-3.5 rounded-2xl border ${colorStyles[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
};
