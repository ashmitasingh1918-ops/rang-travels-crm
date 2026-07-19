import api from './axios';

export const leadService = {
  getAll: async (params) => {
    const response = await api.get('/leads', { params });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/leads/${id}`);
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post('/leads', data);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await api.put(`/leads/${id}`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/leads/${id}`);
    return response.data;
  }
};
