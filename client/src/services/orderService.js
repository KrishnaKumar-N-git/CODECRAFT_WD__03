import api from './api';

export const orderService = {
  createOrder: async (data) => {
    const response = await api.post('/orders', data);
    return response.data;
  },
  getMyOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },
  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
  cancelOrder: async (id) => {
    const response = await api.put(`/orders/${id}/cancel`);
    return response.data;
  },
  getStoreOrders: async () => {
    const response = await api.get('/orders/store/all');
    return response.data;
  },
  updateOrderStatus: async (id, data) => {
    const response = await api.put(`/orders/store/${id}/status`, data);
    return response.data;
  }
};

export const reviewService = {
  createReview: async (data) => {
    const response = await api.post('/reviews', data);
    return response.data;
  },
  getProductReviews: async (productId) => {
    const response = await api.get(`/reviews/product/${productId}`);
    return response.data;
  }
};

export const wishlistService = {
  getWishlist: async () => {
    const response = await api.get('/wishlist');
    return response.data;
  },
  addToWishlist: async (productId) => {
    const response = await api.post(`/wishlist/${productId}`);
    return response.data;
  },
  removeFromWishlist: async (productId) => {
    const response = await api.delete(`/wishlist/${productId}`);
    return response.data;
  }
};

export const addressService = {
  getAddresses: async () => {
    const response = await api.get('/addresses');
    return response.data;
  },
  createAddress: async (data) => {
    const response = await api.post('/addresses', data);
    return response.data;
  },
  updateAddress: async (id, data) => {
    const response = await api.put(`/addresses/${id}`, data);
    return response.data;
  },
  deleteAddress: async (id) => {
    const response = await api.delete(`/addresses/${id}`);
    return response.data;
  }
};

export const paymentService = {
  createOrder: async (orderId) => {
    const response = await api.post('/payments/create-order', { orderId });
    return response.data;
  },
  verifyPayment: async (paymentData) => {
    const response = await api.post('/payments/verify', paymentData);
    return response.data;
  }
};

export const adminService = {
  getAnalytics: async () => {
    const response = await api.get('/admin/analytics');
    return response.data;
  },
  getStoreAnalytics: async () => {
    const response = await api.get('/admin/store-analytics');
    return response.data;
  },
  getUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },
  toggleUserStatus: async (id) => {
    const response = await api.put(`/admin/users/${id}/status`);
    return response.data;
  },
  getStores: async () => {
    const response = await api.get('/admin/stores');
    return response.data;
  },
  updateStoreStatus: async (id, status) => {
    const response = await api.put(`/admin/stores/${id}/status`, { status });
    return response.data;
  }
};
