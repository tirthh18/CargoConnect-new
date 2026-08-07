import { useMemo, useState } from "react";
import { Package, CheckCircle, Clock3, Users } from "lucide-react";

import Navbar from "../../components/admin/Navbar";
import StatCard from "../../components/admin/dashboard/StatCard";
import FilterTabs from "../../components/admin/dashboard/FilterTabs";
import SortDropdown from "../../components/admin/dashboard/SortDropdown";
import ParcelCard from "../../components/common/ParcelCard";

import {useAdminDashboard, useUpdateParcelStatus, useAssignParcel,} from "../../hooks/useAdminDashboard";
import { useGetAgents } from "../../hooks/useAgent";

export default function Dashboard() {
  const { data, isLoading, isError, error, refetch } = useAdminDashboard();
  const updateStatus = useUpdateParcelStatus();
  const assignParcel = useAssignParcel();
  const { data: agentData } = useGetAgents();
   
  const pickupParcels = data?.pickupParcels ?? [];
  const deliveryParcels = data?.deliveryParcels ?? [];
  const agents = agentData?.agents || [];

  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [parcelTab, setParcelTab] = useState("pickup");


  const parcels = parcelTab === "pickup" ? pickupParcels : deliveryParcels;

  const filteredParcels = useMemo(() => {
    let list = [...(parcels || [])];
    if (activeTab !== "all") {
      list = list.filter((parcel) => parcel.status === activeTab);
    }

    if (sortBy === "newest") {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    return list;
  }, [parcels, activeTab, sortBy]);

  const handleAssign = (parcelId, agentId) => {
    assignParcel.mutate({id: parcelId,agentId,});
  };

  const handleStatusChange = (id, status) => {
    updateStatus.mutate({ id, status });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFFBF7]">
        <Navbar />

        <div className="flex justify-center items-center h-[80vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>

            <p className="mt-4 text-slate-500">Loading Dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#FFFBF7]">
        <Navbar />

        <div className="max-w-xl mx-auto mt-20 bg-red-50 border border-red-200 rounded-xl p-6">
          <h2 className="text-red-600 text-xl font-bold">
            Failed to load dashboard
          </h2>

          <p className="text-red-400 mt-2">
            {error?.response?.data?.message || error?.message}
          </p>

          <button
            onClick={refetch}
            className="mt-5 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFBF7]">
      <Navbar />

      <main className="px-10 py-10">
        <div>
          <p className="text-slate-500 mt-2">
            Monitor and manage your parcel deliveries
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-10">
          <StatCard
            title="Active Parcels"
            value={data.activeParcelCount}
            icon={<Package size={22} />}
            bg="bg-blue-50"
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
          />

          <StatCard
            title="Pick-up Parcels"
            value={data.pickupParcelCount}
            icon={<CheckCircle size={22} />}
            bg="bg-green-50"
            iconBg="bg-green-100"
            iconColor="text-green-600"
          />

          <StatCard
            title="Deliver Parcels"
            value={data.deliveryParcelCount}
            icon={<Clock3 size={22} />}
            bg="bg-yellow-50"
            iconBg="bg-yellow-100"
            iconColor="text-yellow-600"
          />

          <StatCard
            title="Delivery Agents"
            value={data.totalAgents}
            icon={<Users size={22} />}
            bg="bg-purple-50"
            iconBg="bg-purple-100"
            iconColor="text-purple-600"
          />
        </div>
        <div className="flex gap-3 mb-6">
          <button onClick={() => setParcelTab("pickup")} className={parcelTab === "pickup" ? "bg-[#E8734A] text-white px-5 py-2 rounded-lg": "bg-gray-100 px-5 py-2 rounded-lg"}>
            Pickup Parcels
          </button>

          <button onClick={() => setParcelTab("delivery")} className={parcelTab === "delivery" ? "bg-[#E8734A] text-white px-5 py-2 rounded-lg" : "bg-gray-100 px-5 py-2 rounded-lg"}>
            Delivery Parcels
          </button>
        </div>

        <div className="mt-10 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-5 mb-6">
            <FilterTabs
              parcelTab={parcelTab}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
          </div>

          <div className="mt-8 space-y-6">
            {filteredParcels.length === 0 ? (
              <div className="text-center py-16">
                <Package size={70} className="mx-auto text-slate-300" />

                <h3 className="mt-5 text-2xl font-semibold text-slate-700">
                  No Parcels Found
                </h3>

                <p className="text-slate-500 mt-2">
                  There are no parcels matching this filter.
                </p>
              </div>
            ) : (
              filteredParcels.map((parcel) => (
                <ParcelCard
                  key={parcel._id}
                  parcel={parcel}
                  type="admin"
                  parcelTab={parcelTab}
                  agents={agents}
                  onStatusChange={handleStatusChange}
                  onAssign={handleAssign}
                />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
