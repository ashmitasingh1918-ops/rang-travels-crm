import api from './axios';

export const quotationService = {
  getAll: async (params) => {
    const response = await api.get('/quotations', { params });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/quotations/${id}`);
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post('/quotations', data);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await api.put(`/quotations/${id}`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/quotations/${id}`);
    return response.data;
  }
};
