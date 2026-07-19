import api from './axios';

export const agentService = {
  getAll: async (params) => {
    const response = await api.get('/agents', { params });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/agents/${id}`);
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post('/agents', data);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await api.put(`/agents/${id}`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/agents/${id}`);
    return response.data;
  }
};
