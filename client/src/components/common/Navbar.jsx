import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Store,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  Sparkles,
  MapPin,
  Clock,
  ChevronDown,
  Layers
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout, isStoreOwner, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const { wishlist } = useWishlist();
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-emerald-100 shadow-sm">
      {/* BigBasket Emerald Top Bar */}
      <div className="bg-emerald-900 text-white text-[11px] py-1.5 px-4 font-medium">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1 text-emerald-200">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Deliver to: <strong className="text-white font-bold">Bengaluru - 560038</strong></span>
            </span>
            <span className="hidden md:flex items-center space-x-1 text-emerald-100">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Superfast 15-Minute Doorstep Delivery</span>
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="hidden sm:inline text-amber-300 font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Extra ₹100 OFF code: BIGGROCERY
            </span>
            {isStoreOwner && (
              <Link to="/store/dashboard" className="text-emerald-300 font-bold hover:underline flex items-center space-x-1">
                <Store className="w-3.5 h-3.5" />
                <span>Store Owner Panel</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main BigBasket Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-600/30 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-0.5">
                <span className="font-black text-2xl tracking-tight text-emerald-950">Groc</span>
                <span className="font-black text-2xl tracking-tight text-emerald-600">mart</span>
              </div>
              <p className="text-[10px] text-emerald-800 font-bold tracking-wide uppercase">Multi-Vendor Grocery Marketplace</p>
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full flex items-center">
              <input
                type="text"
                placeholder="Search groceries, basmati rice, cooking oil, amul milk, fresh fruits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-emerald-50/50 hover:bg-emerald-50 text-gray-900 text-xs rounded-2xl pl-5 pr-12 py-3.5 border border-emerald-200 focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium"
              />
              <button
                type="submit"
                className="absolute right-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center justify-center transition-colors shadow-sm"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2.5 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-2xl transition-colors"
              title="Wishlist"
            >
              <Heart className="w-6 h-6" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-600 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Link */}
            <Link
              to="/cart"
              className="relative flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl transition-all shadow-md shadow-emerald-600/20"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden sm:inline font-extrabold text-xs uppercase tracking-wider">Cart</span>
              {itemCount > 0 && (
                <span className="bg-white text-emerald-800 text-xs font-black px-2 py-0.5 rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Auth Menu */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 p-1.5 rounded-2xl hover:bg-emerald-50 transition-colors border border-emerald-100">
                  <div className="w-8 h-8 bg-emerald-100 text-emerald-800 rounded-xl flex items-center justify-center font-black text-xs">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-bold text-gray-900 hidden sm:inline">{user?.name?.split(' ')[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                <div className="absolute right-0 mt-1 w-56 bg-white rounded-2xl shadow-xl border border-emerald-100 py-2 hidden group-hover:block z-50 animate-fadeIn">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs font-bold text-gray-900">{user?.name}</p>
                    <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-full">
                      {user?.role}
                    </span>
                  </div>
                  <Link to="/orders" className="block px-4 py-2 text-xs text-gray-700 hover:bg-emerald-50 font-bold">
                    My Orders
                  </Link>
                  {isStoreOwner && (
                    <Link to="/store/dashboard" className="block px-4 py-2 text-xs text-emerald-700 font-bold hover:bg-emerald-50">
                      Store Owner Dashboard
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 font-bold flex items-center space-x-1.5 border-t border-gray-100 mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-1.5 px-4 py-2.5 bg-slate-900 hover:bg-black text-white rounded-2xl text-xs font-bold transition-all shadow-sm"
              >
                <User className="w-4 h-4" />
                <span>Login</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Category Navigation Bar */}
        <nav className="hidden lg:flex items-center space-x-6 py-2.5 border-t border-emerald-100 text-xs font-bold text-gray-700">
          <Link to="/" className="text-emerald-800 hover:text-emerald-600 transition-colors flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <span>Shop by Category</span>
          </Link>
          <Link to="/shop" className="hover:text-emerald-700 transition-colors">All Grocery Products</Link>
          <Link to="/categories" className="hover:text-emerald-700 transition-colors">Categories Catalog</Link>
          <Link to="/shop?category=rice-grains" className="hover:text-emerald-700 transition-colors">Rice & Staples</Link>
          <Link to="/shop?category=fruits-vegetables" className="hover:text-emerald-700 transition-colors">Farm Fresh Veggies</Link>
          <Link to="/shop?category=dairy-eggs" className="hover:text-emerald-700 transition-colors">Milk & Dairy</Link>
          <Link to="/orders" className="hover:text-emerald-700 text-amber-700 transition-colors ml-auto flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Track Orders</span>
          </Link>
        </nav>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-emerald-100 px-4 pt-4 pb-6 space-y-4 shadow-xl">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search groceries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-emerald-50/70 text-xs text-gray-900 rounded-xl pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-emerald-200 font-medium"
            />
            <button type="submit" className="absolute right-3 top-3 text-emerald-700">
              <Search className="w-4.5 h-4.5" />
            </button>
          </form>

          <div className="flex flex-col space-y-1 text-xs font-bold text-gray-800">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 hover:bg-emerald-50 rounded-xl border-b border-gray-100 flex items-center justify-between">
              <span>Home</span>
            </Link>
            <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 hover:bg-emerald-50 rounded-xl border-b border-gray-100 flex items-center justify-between">
              <span>Shop All Groceries</span>
            </Link>
            <Link to="/categories" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 hover:bg-emerald-50 rounded-xl border-b border-gray-100 flex items-center justify-between">
              <span>Categories Catalog</span>
            </Link>
            <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 text-emerald-700 font-extrabold hover:bg-emerald-50 rounded-xl border-b border-gray-100 flex items-center justify-between">
              <span>Track My Orders</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
