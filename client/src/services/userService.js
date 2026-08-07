import api from "./api";

export const getDashboardStats = async () => {
  const response = await api.get("/user/parcel");
  return response.data;
};

export const createParcel = async (parcelData) => {
  const response = await api.post("/user/parcel/create", parcelData);
  return response.data;
};

export const getUserParcels = async () => {
  const response = await api.get("/user/parcel");
  return response.data;
};

export const cancelParcel = async (id) => {
  const response = await api.put(`/user/parcel/${id}/cancel`);
  return response.data;
};

