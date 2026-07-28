import api from "./axios";

export const getAllVouchers = async () => {
  const response = await api.get("/v1/vouchers");
  return response.data;
};

export const getVoucherById = async (id) => {
  const response = await api.get(`/v1/vouchers/${id}`);
  return response.data;
};

export const getVoucherByBookingId = async (bookingId) => {
  const response = await api.get(`/v1/vouchers/booking/${bookingId}`);
  return response.data;
};

export const saveVoucher = async (voucherData) => {
  const response = await api.post("/v1/vouchers", voucherData);
  return response.data;
};

export const updateVoucher = async (id, voucherData) => {
  const response = await api.put(`/v1/vouchers/${id}`, voucherData);
  return response.data;
};

export const getDownloadVoucherPdfUrl = (id) => {
  // Extract baseURL from Axios if present, or absolute path
  const token = localStorage.getItem("token");
  return `${api.defaults.baseURL || "http://localhost:5000/api"}/v1/vouchers/${id}/pdf?token=${token}`;
};

export const previewVoucherPdf = async (voucherData) => {
  const response = await api.post("/v1/vouchers/preview-pdf", voucherData, {
    responseType: "blob"
  });
  return response.data;
};

export const downloadVoucherBlob = async (id) => {
  const response = await api.get(`/v1/vouchers/${id}/pdf`, {
    responseType: "blob"
  });
  return response.data;
};
