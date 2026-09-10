import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('apk_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('apk_token');
      if (token) {
        try {
          const res = await authService.getMe();
          const userData = res.user || res.data?.user;
          if (userData) {
            setUser(userData);
            localStorage.setItem('apk_user', JSON.stringify(userData));
          }
        } catch (err) {
          console.error('Failed to fetch user:', err);
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    const userData = res.user || res.data?.user;
    const token = res.token || res.data?.token;
    if (token && userData) {
      localStorage.setItem('apk_token', token);
      localStorage.setItem('apk_user', JSON.stringify(userData));
      setUser(userData);
    }
    return res;
  };

  const register = async (data) => {
    const res = await authService.register(data);
    const userData = res.user || res.data?.user;
    const token = res.token || res.data?.token;
    if (token && userData) {
      localStorage.setItem('apk_token', token);
      localStorage.setItem('apk_user', JSON.stringify(userData));
      setUser(userData);
    }
    return res;
  };

  const logout = () => {
    localStorage.removeItem('apk_token');
    localStorage.removeItem('apk_user');
    setUser(null);
  };

  const updateUserState = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('apk_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUserState,
        isAuthenticated: !!user,
        isCustomer: user?.role === 'CUSTOMER',
        isStoreOwner: user?.role === 'STORE_OWNER',
        isAdmin: user?.role === 'ADMIN'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
