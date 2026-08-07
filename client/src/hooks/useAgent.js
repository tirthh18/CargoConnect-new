
import {useMutation,useQuery,useQueryClient,} from "@tanstack/react-query";

import {getAgents, getAgentParcels, updateParcelStatus, getOptimizedRoute} from "../services/agentService";

export const useGetAgents = () => {
  return useQuery({
    queryKey: ["agents"],
    queryFn: getAgents,
  });
};

export const useAgentParcels = (agentId) => {
  return useQuery({
    queryKey: ["agent-parcels", agentId],
    queryFn: () => getAgentParcels(agentId),
    enabled: !!agentId,
    refetchOnMount: "always",
  });
};

export function useOptimizeRoute(agentId) {
  return useQuery({
    queryKey: ["optimized-route", agentId],
    queryFn: () =>getOptimizedRoute(agentId),
    enabled: false,
  });
}

export function useUpdateParcelStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) =>
      updateParcelStatus(id, status),

    onSuccess: async (_, variables) => {

      // Refresh Route Page
      await queryClient.invalidateQueries({
        queryKey: ["agent-parcels", variables.agentId],
      });

      // Refresh Admin Dashboard
      await queryClient.invalidateQueries({
        queryKey: ["admin-dashboard"],
      });

      // Refresh Admin Parcels
      await queryClient.invalidateQueries({
        queryKey: ["admin-parcels"],
      });

    },
  });
}
