import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import cartService from '../services/cartService';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [], subtotal: 0, store: null });
  const [loading, setLoading] = useState(false);

  // Different store popup modal state
  const [storeModalOpen, setStoreModalOpen] = useState(false);
  const [pendingAdd, setPendingAdd] = useState(null); // { productId, quantity }

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart({ items: [], subtotal: 0, store: null });
      return;
    }
    try {
      setLoading(true);
      const res = await cartService.getCart();
      setCart(res.cart || res.data?.cart || { items: [], subtotal: 0, store: null });
    } catch (error) {
      console.error('Fetch cart error:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1, forceClear = false) => {
    if (!isAuthenticated) {
      toast.error('Please login to add products to your cart');
      return false;
    }
    try {
      const res = await cartService.addToCart(productId, quantity, forceClear);
      setCart(res.cart || res.data?.cart || { items: [], subtotal: 0, store: null });
      toast.success('Added to cart!');
      return true;
    } catch (error) {
      if (error.response?.data?.differentStore) {
        // Trigger multi-store confirmation modal
        setPendingAdd({ productId, quantity });
        setStoreModalOpen(true);
        return false;
      }
      toast.error(error.response?.data?.message || 'Failed to add item to cart');
      return false;
    }
  };

  const confirmClearAndAdd = async () => {
    if (!pendingAdd) return;
    setStoreModalOpen(false);
    await addToCart(pendingAdd.productId, pendingAdd.quantity, true);
    setPendingAdd(null);
  };

  const updateQty = async (productId, quantity) => {
    try {
      const res = await cartService.updateQty(productId, quantity);
      setCart(res.cart || res.data?.cart || { items: [], subtotal: 0, store: null });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update quantity');
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await cartService.removeFromCart(productId);
      setCart(res.cart || res.data?.cart || { items: [], subtotal: 0, store: null });
      toast.success('Removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      setCart({ items: [], subtotal: 0, store: null });
    } catch (error) {
      console.error('Clear cart error:', error);
    }
  };

  const itemCount = cart.items ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        itemCount,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
        fetchCart,
        storeModalOpen,
        setStoreModalOpen,
        confirmClearAndAdd
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
