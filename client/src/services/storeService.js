import api from './api';

export const storeService = {
  getStores: async () => {
    const response = await api.get('/stores');
    return response.data;
  },
  getStoreById: async (id) => {
    const response = await api.get(`/stores/${id}`);
    return response.data;
  },
  createStore: async (data) => {
    const response = await api.post('/stores', data);
    return response.data;
  },
  updateStore: async (id, data) => {
    const response = await api.put(`/stores/${id}`, data);
    return response.data;
  },
  uploadLogo: async (id, formData) => {
    const response = await api.post(`/stores/${id}/logo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  uploadBanner: async (id, formData) => {
    const response = await api.post(`/stores/${id}/banner`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
};

export default storeService;
