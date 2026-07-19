import api from './axios';

export const tourService = {
  getAll: async (params) => {
    const response = await api.get('/tours', { params });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/tours/${id}`);
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post('/tours', data);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await api.put(`/tours/${id}`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/tours/${id}`);
    return response.data;
  }
};
