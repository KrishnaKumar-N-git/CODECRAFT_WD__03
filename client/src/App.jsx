import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import CustomerLayout from './layouts/CustomerLayout';
import { StoreLayout, AdminLayout } from './layouts/StoreLayout';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminLogin from './pages/auth/AdminLogin';

// Customer pages
import Home from './pages/customer/Home';
import Shop from './pages/customer/Shop';
import Categories from './pages/customer/Categories';
import ProductDetails from './pages/customer/ProductDetails';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import MyOrders from './pages/customer/MyOrders';
import OrderDetails from './pages/customer/OrderDetails';

// Store Owner pages
import StoreDashboard from './pages/store/Dashboard';
import StoreProducts from './pages/store/Products';
import AddEditProduct from './pages/store/AddEditProduct';
import StoreOrders from './pages/store/Orders';
import StoreInventory from './pages/store/Inventory';
import StoreAnalytics from './pages/store/Analytics';
import StoreSettings from './pages/store/Settings';

// Admin pages (Private Secret URL: /admin-secret-access)
import AdminDashboard from './pages/admin/AdminDashboard';
import StoreManagement from './pages/admin/StoreManagement';
import UserManagement from './pages/admin/UserManagement';
import ProductManagement from './pages/admin/ProductManagement';
import CategoryManagement from './pages/admin/CategoryManagement';
import QRPaymentSettings from './pages/admin/QRPaymentSettings';
import OrderDeliveryManagement from './pages/admin/OrderDeliveryManagement';

// Protected routes
import { ProtectedRoute, RoleRoute, AdminRoute } from './routes/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Public auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin-secret-access" element={<AdminLogin />} />

      {/* Customer-facing store routes */}
      <Route element={<CustomerLayout />}>
        <Route index element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute>
              <OrderDetails />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Store Owner portal routes (/store/*) */}
      <Route
        element={
          <RoleRoute allowedRoles={['STORE_OWNER', 'ADMIN']}>
            <StoreLayout />
          </RoleRoute>
        }
      >
        <Route path="/store/dashboard" element={<StoreDashboard />} />
        <Route path="/store/products" element={<StoreProducts />} />
        <Route path="/store/products/new" element={<AddEditProduct />} />
        <Route path="/store/products/edit/:id" element={<AddEditProduct />} />
        <Route path="/store/orders" element={<StoreOrders />} />
        <Route path="/store/inventory" element={<StoreInventory />} />
        <Route path="/store/analytics" element={<StoreAnalytics />} />
        <Route path="/store/settings" element={<StoreSettings />} />
        <Route path="/store" element={<Navigate to="/store/dashboard" replace />} />
      </Route>

      {/* Private Super Admin Portal routes (/admin-secret-access/*) */}
      <Route
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route path="/admin-secret-access/dashboard" element={<AdminDashboard />} />
        <Route path="/admin-secret-access/orders" element={<OrderDeliveryManagement />} />
        <Route path="/admin-secret-access/stores" element={<StoreManagement />} />
        <Route path="/admin-secret-access/users" element={<UserManagement />} />
        <Route path="/admin-secret-access/products" element={<ProductManagement />} />
        <Route path="/admin-secret-access/categories" element={<CategoryManagement />} />
        <Route path="/admin-secret-access/qr-settings" element={<QRPaymentSettings />} />
        <Route path="/admin-secret-access/*" element={<Navigate to="/admin-secret-access/dashboard" replace />} />
        <Route path="/admin/*" element={<Navigate to="/admin-secret-access" replace />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
