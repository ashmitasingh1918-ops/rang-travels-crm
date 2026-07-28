import api from "./axios";

export const getTours = async (params = {}) => {
  const response = await api.get("/v1/tours", { params });
  return response.data;
};

export const getTourById = async (id) => {
  const response = await api.get(`/v1/tours/${id}`);
  return response.data;
};

export const createTour = async (tourData) => {
  const response = await api.post("/v1/tours", tourData);
  return response.data;
};

export const updateTour = async (id, tourData) => {
  const response = await api.put(`/v1/tours/${id}`, tourData);
  return response.data;
};

export const updateTripStatus = async (id, tripStatus) => {
  const response = await api.patch(`/v1/tours/${id}/status`, { tripStatus });
  return response.data;
};

export const deleteTour = async (id) => {
  const response = await api.delete(`/v1/tours/${id}`);
  return response.data;
};
