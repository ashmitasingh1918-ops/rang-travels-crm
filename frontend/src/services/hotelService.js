import api from './axios';

export const hotelService = {
  getAll: async (params) => {
    const response = await api.get('/hotels', { params });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/hotels/${id}`);
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post('/hotels', data);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await api.put(`/hotels/${id}`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/hotels/${id}`);
    return response.data;
  }
};
