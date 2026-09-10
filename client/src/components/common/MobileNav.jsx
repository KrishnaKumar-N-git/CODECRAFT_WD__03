import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Grid, Search, ShoppingBag, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const MobileNav = () => {
  const { itemCount } = useCart();

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/categories', label: 'Categories', icon: Grid },
    { to: '/shop', label: 'Search', icon: Search },
    { to: '/cart', label: 'Cart', icon: ShoppingBag, badge: itemCount },
    { to: '/profile', label: 'Profile', icon: User }
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-2 py-1 shadow-lg">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `relative flex flex-col items-center py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors ${
                  isActive ? 'text-brand-600 font-bold' : 'text-gray-500 hover:text-gray-900'
                }`
              }
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">{item.label}</span>
              {item.badge > 0 && (
                <span className="absolute -top-1 right-2 bg-brand-600 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNav;
