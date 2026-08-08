import api from "./axios";

export const addHotelToTour = (tourId, data) =>
  api.post(`/tour-hotels/tours/${tourId}/add`, data).then(r => r.data);

export const getHotelsByTour = (tourId) =>
  api.get(`/tour-hotels/tours/${tourId}`).then(r => r.data);

export const getConfirmedHotelsByTour = (tourId) =>
  api.get(`/tour-hotels/tours/${tourId}/confirmed`).then(r => r.data);

export const getAllTourHotels = (params = {}) =>
  api.get("/tour-hotels", { params }).then(r => r.data);

export const removeHotelSelection = (tourHotelId) =>
  api.delete(`/tour-hotels/${tourHotelId}`).then(r => r.data);

export const updateHotelStatus = (tourHotelId, status) =>
  api.patch(`/tour-hotels/${tourHotelId}/status`, { status }).then(r => r.data);

export const updateHotelNotes = (tourHotelId, notes) =>
  api.patch(`/tour-hotels/${tourHotelId}/notes`, { notes }).then(r => r.data);

// Destinations
export const addDestination = (tourId, data) =>
  api.post(`/tours/${tourId}/destinations`, data).then(r => r.data);

export const getDestinations = (tourId) =>
  api.get(`/tours/${tourId}/destinations`).then(r => r.data);

export const updateDestination = (destinationId, data) =>
  api.put(`/tours/destinations/${destinationId}`, data).then(r => r.data);

export const deleteDestination = (destinationId) =>
  api.delete(`/tours/destinations/${destinationId}`).then(r => r.data);

// Email sending
export const sendHotelRequests = (data) =>
  api.post("/emails/hotel-request", data).then(r => r.data);

export const previewEmailTemplate = (params) =>
  api.get("/emails/hotel-request/preview", { params }).then(r => r.data);

// Vouchers
export const generateVoucher = (data) =>
  api.post("/new-vouchers/generate", data).then(r => r.data);

export const getVouchersByTour = (tourId) =>
  api.get(`/new-vouchers/tour/${tourId}`).then(r => r.data);

export const getVoucher = (voucherId) =>
  api.get(`/new-vouchers/${voucherId}`).then(r => r.data);

export const sendVoucher = (voucherId, data = {}) =>
  api.post(`/new-vouchers/${voucherId}/send`, data).then(r => r.data);

export const getVoucherDownloadUrl = (voucherId) =>
  `${api.defaults.baseURL}/new-vouchers/${voucherId}/download`;
