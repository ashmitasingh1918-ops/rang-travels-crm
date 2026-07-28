import api from "./axios";

<<<<<<< HEAD
export const getClients = async (params = {}) => {
  const response = await api.get("/v1/clients", { params });
  return response.data;
};

export const getClientById = async (id) => {
  const response = await api.get(`/v1/clients/${id}`);
  return response.data;
};

export const updateClient = async (id, clientData) => {
  const response = await api.put(`/v1/clients/${id}`, clientData);
  return response.data;
};

export const deleteClient = async (id) => {
  const response = await api.delete(`/v1/clients/${id}`);
=======
export const getAllClients = async () => {
  const response = await api.get("/v1/clients");
>>>>>>> 055527d (Add Email Center Gmail integration and hotel voucher features)
  return response.data;
};
