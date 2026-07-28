import api from "./axios";

export const getAllBookings = async (status) => {
  const response = await api.get("/v1/bookings", { params: { status } });
  return response.data;
};

export const getBookingById = async (id) => {
  const response = await api.get(`/v1/bookings/${id}`);
  return response.data;
};

export const createBooking = async (bookingData) => {
  const response = await api.post("/v1/bookings", bookingData);
  return response.data;
};

export const updateBooking = async (id, bookingData) => {
  const response = await api.put(`/v1/bookings/${id}`, bookingData);
  return response.data;
};

export const deleteBooking = async (id) => {
  const response = await api.delete(`/v1/bookings/${id}`);
  return response.data;
};
