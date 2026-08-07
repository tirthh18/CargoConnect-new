
import {useMutation,useQuery,useQueryClient,} from "@tanstack/react-query";

import {createParcel, getUserParcels, cancelParcel,} from "../services/userService";

export const useCreateParcel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createParcel,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-dashboard"],
      });

      queryClient.invalidateQueries({
        queryKey: ["user-parcels"],
      });
    },
  });
};


export const useUserParcels = () => {
  return useQuery({
    queryKey: ["user-parcels"],
    queryFn: getUserParcels,
  });
};


export const useCancelParcel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelParcel,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-parcels"],
      });

      queryClient.invalidateQueries({
        queryKey: ["user-dashboard"],
      });
    },
  });
};