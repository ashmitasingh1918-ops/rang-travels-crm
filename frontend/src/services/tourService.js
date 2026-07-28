import api from "./axios";

export const updateTour = async (id, tourData) => {
  const response = await api.put(`/v1/tours/${id}`, tourData);
  return response.data;
};

export const updateTripStatus = async (id, tripStatus) => {
  const response = await api.patch(`/v1/tours/${id}/status`, { tripStatus });
  return response.data;
};

export const createTour = async (tourData) => {
  const response = await api.post("/v1/tours", tourData);
  return response.data;
};
