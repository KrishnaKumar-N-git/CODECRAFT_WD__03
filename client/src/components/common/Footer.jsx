import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, MapPin, Phone, Mail, Clock, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-24 lg:pb-12 border-t border-gray-800">
      {/* Features Ribbon */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 bg-gray-800/60 rounded-2xl border border-gray-700/50">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-brand-600/20 text-brand-400 rounded-xl">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">15-Min Express Delivery</h4>
              <p className="text-xs text-gray-400">Doorstep delivery in Indiranagar & Koramangala</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-3 bg-brand-600/20 text-brand-400 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Guaranteed Freshness</h4>
              <p className="text-xs text-gray-400">100% genuine brands & daily fresh produce</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-3 bg-brand-600/20 text-brand-400 rounded-xl">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Easy Returns</h4>
              <p className="text-xs text-gray-400">Hassle-free replacement for damaged items</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-3 bg-brand-600/20 text-brand-400 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Open 7 Days a Week</h4>
              <p className="text-xs text-gray-400">07:00 AM – 10:00 PM daily service</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-xs">
        {/* Column 1: Brand Info */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white">APK</span>
              <span className="font-bold text-base text-brand-400 ml-1">GROCERY</span>
            </div>
          </div>
          <p className="text-gray-400 leading-relaxed max-w-sm">
            APK Grocery Stores brings your favorite neighborhood kirana store online. Shop top quality rice, atta, dals, dairy, fruits, vegetables and household supplies with local delivery.
          </p>
          <div className="space-y-2 text-gray-400">
            <p className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-brand-400 shrink-0" />
              <span>Shop #14, 100 Feet Road, Indiranagar, Bengaluru, 560038</span>
            </p>
            <p className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-brand-400 shrink-0" />
              <span>+91 (080) 4122-8900</span>
            </p>
            <p className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-brand-400 shrink-0" />
              <span>support@apkgrocery.demo</span>
            </p>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Categories</h4>
          <ul className="space-y-2 text-gray-400">
            <li><Link to="/shop?category=rice-grains" className="hover:text-white">Rice & Grains</Link></li>
            <li><Link to="/shop?category=pulses-dal" className="hover:text-white">Pulses & Dal</Link></li>
            <li><Link to="/shop?category=oil-ghee" className="hover:text-white">Cooking Oil & Ghee</Link></li>
            <li><Link to="/shop?category=dairy-eggs" className="hover:text-white">Dairy & Eggs</Link></li>
            <li><Link to="/shop?category=fruits-vegetables" className="hover:text-white">Fruits & Veggies</Link></li>
            <li><Link to="/shop?category=spices-masalas" className="hover:text-white">Spices & Masalas</Link></li>
          </ul>
        </div>

        {/* Column 3: Customer Service */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Customer Care</h4>
          <ul className="space-y-2 text-gray-400">
            <li><Link to="/orders" className="hover:text-white">Track Order</Link></li>
            <li><Link to="/profile" className="hover:text-white">My Account</Link></li>
            <li><Link to="/wishlist" className="hover:text-white">My Wishlist</Link></li>
            <li><Link to="/about" className="hover:text-white">About Our Store</Link></li>
            <li><Link to="/contact" className="hover:text-white">Store Hours & Address</Link></li>
            <li><Link to="/deals" className="hover:text-white text-accent">Today's Deals</Link></li>
          </ul>
        </div>

        {/* Column 4: Store Partners */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Store Owners</h4>
          <p className="text-gray-400 leading-relaxed">
            Are you a local kirana store owner? List your grocery store on APK Grocery Stores platform.
          </p>
          <Link
            to="/login"
            className="inline-block px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg transition-colors"
          >
            Store Owner Portal
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 space-y-4 md:space-y-0">
        <p>© 2026 APK Grocery Stores. All rights reserved. Built with MERN Stack.</p>
        <div className="flex items-center space-x-4">
          <span>Razorpay Verified</span>
          <span>Cash on Delivery</span>
          <span>Pay at Store</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
