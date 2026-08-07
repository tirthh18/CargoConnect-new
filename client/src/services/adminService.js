import api from "./api";


export const getDashboardData = async () => {
  const response = await api.get("/admin/parcel");
  return response.data;
};


export const getAdminParcels = async () => {
  const response = await api.get("/admin/parcel");
  return response.data;
};


export const updateParcelStatus = async ({ id, status }) => {
  const response = await api.put(`/admin/parcel/${id}/status`, {status});

  return response.data;
};

export const assignParcel = async ({id, agentId}) => {
  const response = await api.put(`/admin/parcel/${id}/agent`,{agentId});
  
  return response.data;
};