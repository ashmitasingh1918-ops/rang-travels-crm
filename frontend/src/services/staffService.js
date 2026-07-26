import api from "./axios";

export const getStaff = async () => {
  const response = await api.get("/v1/staff");
  return response.data;
};

export const createStaff = async (staffData) => {
  const response = await api.post("/v1/staff", staffData);
  return response.data;
};

export const updateStaff = async (id, staffData) => {
  const response = await api.put(`/v1/staff/${id}`, staffData);
  return response.data;
};

export const deleteStaff = async (id) => {
  const response = await api.delete(`/v1/staff/${id}`);
  return response.data;
};
