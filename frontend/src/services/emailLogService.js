import api from "./axios";

export const getEmailHistory = (params = {}) =>
  api.get("/email-history", { params }).then(r => r.data);

export const getEmailsByTour = (tourId) =>
  api.get(`/email-history/tour/${tourId}`).then(r => r.data);
