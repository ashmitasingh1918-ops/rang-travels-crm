import api from './axios';

export const emailService = {
  getAll: async (params) => {
    const response = await api.get('/email', { params });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/email/${id}`);
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post('/email', data);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await api.put(`/email/${id}`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/email/${id}`);
    return response.data;
  }
};
