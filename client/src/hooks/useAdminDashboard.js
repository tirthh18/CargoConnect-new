import {useMutation,useQuery, useQueryClient} from "@tanstack/react-query";

import {getDashboardData, getAdminParcels, updateParcelStatus, assignParcel} from "../services/adminService";

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: getDashboardData,
  });
};

export const useAdminParcels = () => {
  return useQuery({
    queryKey: ["admin-parcels"],
    queryFn: getAdminParcels,
  });
};

export const useAssignParcel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assignParcel,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-dashboard"],
      });
    },
  });
};


export const useUpdateParcelStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateParcelStatus,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-dashboard"],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-parcels"],
      });
    },
  });
};


