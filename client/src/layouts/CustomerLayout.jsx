import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import MobileNav from '../components/common/MobileNav';
import DifferentStoreModal from '../components/cart/DifferentStoreModal';

export const CustomerLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
      <Footer />
      <MobileNav />
      <DifferentStoreModal />
    </div>
  );
};

export default CustomerLayout;
