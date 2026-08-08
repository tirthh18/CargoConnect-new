import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useUserDashboard } from "../../hooks/useUserDashboard";

import Sidebar from "../../components/user/Sidebar";
import StatCard from "../../components/user/dashboard/Statcard";
import MonthlyOrdersChart from "../../components/user/dashboard/Chart";
import TotalSpentCard from "../../components/user/dashboard/Totalspentcard";
import DashboardSkeleton from "../../components/user/dashboard/DashboardSkeleton";

export default function Dashboard() {
  const { user } = useAuth();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useUserDashboard();

  return (
    <div className="min-h-screen bg-[#FFFAF8]">
      
      <Sidebar />

      <main className="ml-64 min-h-screen px-10 py-10">
        
        {isLoading && <DashboardSkeleton />}

        {isError && (
          <div className="rounded-2xl bg-red-50 border border-red-100 p-6 text-center">
            <p className="text-red-600 font-medium">
              Couldn't load dashboard data.
            </p>

            <p className="text-red-400 text-sm mt-1">
              {error?.response?.data?.message || error?.message}
            </p>

            <button
              onClick={() => refetch()}
              className="mt-4 px-4 py-2 rounded-lg bg-red-100 text-red-600 text-sm font-medium hover:bg-red-200 transition-colors"
            >
              Try again
            </button>
          </div>
        )}

        {data && (
          <>
            <h1 className="text-3xl font-extrabold text-[#1B1B2F]">
              Welcome, {user?.name}
            </h1>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <StatCard
                label="Total Orders"
                value={data.totalOrders}
                bg="bg-[#EAF2FE]"
                iconBg="bg-[#D7E7FD]"
                iconColor="text-[#3B82F6]"
                icon={<Package size={20} />}
              />

              <StatCard
                label="Pending Orders"
                value={data.currentOrders}
                bg="bg-[#F3EFFE]"
                iconBg="bg-[#E4DBFC]"
                iconColor="text-[#8B5CF6]"
                icon={<Truck size={20} />}
              />

              <StatCard
                label="Delivered Orders"
                value={data.deliveredOrders}
                bg="bg-[#EAFBF0]"
                iconBg="bg-[#D3F5E1]"
                iconColor="text-[#22C55E]"
                icon={<CheckCircle size={20} />}
              />

              <StatCard
                label="Cancelled Orders"
                value={data.cancelledOrders}
                bg="bg-[#FDEEEE]"
                iconBg="bg-[#FBDCDC]"
                iconColor="text-[#EF4444]"
                icon={<XCircle size={20} />}
              />

            </div>

            <div className="mt-8 grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
              <MonthlyOrdersChart data={data.monthlyData} />

              <TotalSpentCard
                amount={data.totalSpent}
              />
            </div>
          </>
        )}

      </main>
    </div>
  );
}