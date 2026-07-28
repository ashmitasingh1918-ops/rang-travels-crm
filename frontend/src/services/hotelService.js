import api from "./axios";

export const getHotels = async (params = {}) => {
  const response = await api.get("/v1/hotels", { params });
  return response.data;
};

export const getHotelById = async (id) => {
  const response = await api.get(`/v1/hotels/${id}`);
  return response.data;
};

export const createHotel = async (hotelData) => {
  const response = await api.post("/v1/hotels", hotelData);
  return response.data;
};

export const updateHotel = async (id, hotelData) => {
  const response = await api.put(`/v1/hotels/${id}`, hotelData);
  return response.data;
};

export const deleteHotel = async (id) => {
  const response = await api.delete(`/v1/hotels/${id}`);
  return response.data;
};
