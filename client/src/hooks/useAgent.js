import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getAgents,
  getAgentParcels,
  updateParcelStatus,
  getOptimizedRoute,
} from "../services/agentService";

// ======================================================
// GET AGENTS
// ======================================================

export const useGetAgents = () => {
  return useQuery({
    queryKey: ["agents"],
    queryFn: getAgents,
  });
};

// ======================================================
// GET AGENT PARCELS
// ======================================================

export const useAgentParcels = (agentId) => {
  return useQuery({
    queryKey: ["agent-parcels", agentId],
    queryFn: () => getAgentParcels(agentId),
    enabled: !!agentId,
    refetchOnMount: "always",
  });
};

// ======================================================
// OPTIMIZE ROUTE
// ======================================================

export function useOptimizeRoute(agentId) {
  return useQuery({
    queryKey: ["optimized-route", agentId],
    queryFn: () => getOptimizedRoute(agentId),
    enabled: false,
  });
}

// ======================================================
// UPDATE PARCEL STATUS
// ======================================================

export function useUpdateParcelStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status, agentId }) =>
      updateParcelStatus(
        id,
        status,
        agentId
      ),

    onSuccess: async (_, variables) => {
      // Refresh selected agent's parcels
      await queryClient.invalidateQueries({
        queryKey: [
          "agent-parcels",
          variables.agentId,
        ],
      });

      // Refresh admin dashboard
      await queryClient.invalidateQueries({
        queryKey: ["admin-dashboard"],
      });

      // Refresh admin parcels
      await queryClient.invalidateQueries({
        queryKey: ["admin-parcels"],
      });
    },
  });
}