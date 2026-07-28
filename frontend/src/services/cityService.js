import api from "./axios";

export const getCities = async () => {
  const response = await api.get("/v1/cities");
  return response.data;
};
