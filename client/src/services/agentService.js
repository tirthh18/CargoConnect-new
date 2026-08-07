import api from "./api";

export const getAgents = async () => {
  const response = await api.get("/agent");
  return response.data;
};

export const getAgentParcels = async (agentId) => {
  const response = await api.get(
    `/agent/${agentId}/parcels`
  );

  return response.data;
};

export const getOptimizedRoute = async (agentId) => {
  const response = await api.get(
    `/agent/${agentId}/route`
  );

  return response.data;
};

export const updateParcelStatus = async (id, status) => {
  const response = await api.put(`/agent/parcels/${id}/status`,{status,});
  return response.data;
};
