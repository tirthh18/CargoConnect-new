import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "../services/userService";

export const useUserDashboard = () => {
  return useQuery({
    queryKey: ["user-dashboard"],
    queryFn: getDashboardStats,
  });
};