import { useState } from "react";
import { Package, CheckCircle, Clock3, Users } from "lucide-react";

import Navbar from "../../components/admin/Navbar";
import StatCard from "../../components/admin/dashboard/StatCard";
import SortDropdown from "../../components/admin/dashboard/SortDropdown";
import ParcelCard from "../../components/common/ParcelCard";

import {
  useAdminDashboard,
  useUpdateParcelStatus,
  useAssignParcel,
} from "../../hooks/useAdminDashboard";

import { useGetAgents } from "../../hooks/useAgent";

export default function Dashboard() {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useAdminDashboard();

  const updateStatus = useUpdateParcelStatus();
  const assignParcel = useAssignParcel();

  const { data: agentData } = useGetAgents();

  const pickupParcels = data?.pickupParcels ?? [];
  const deliveryParcels = data?.deliveryParcels ?? [];
  const agents = agentData?.agents || [];

  const [sortBy, setSortBy] = useState("newest");
  const [parcelTab, setParcelTab] = useState("pickup");

  // =========================
  // CURRENT PARCEL TYPE
  // =========================

  const parcels =
    parcelTab === "pickup"
      ? pickupParcels
      : deliveryParcels;

  // =========================
  // FILTER + SORT PARCELS
  // =========================

  const filteredParcels = [...parcels]
    .filter((parcel) => {
      // Pickup:
      // Only pending, out_for_pickup and picked_up
      if (parcelTab === "pickup") {
        return [
          "pending",
          "out_for_pickup",
          "picked_up",
        ].includes(parcel.status);
      }

      // Delivery:
      // Show all delivery parcels
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return (
          new Date(b.createdAt) -
          new Date(a.createdAt)
        );
      }

      return (
        new Date(a.createdAt) -
        new Date(b.createdAt)
      );
    });

  // =========================
  // ASSIGN AGENT
  // =========================

  const handleAssign = (parcelId, agentId) => {
    assignParcel.mutate({
      id: parcelId,
      agentId,
    });
  };

  // =========================
  // STATUS CHANGE
  // =========================

  const handleStatusChange = (id, status) => {
    updateStatus.mutate({
      id,
      status,
    });
  };

  // =========================
  // LOADING
  // =========================

  if (isLoading) {
    return (
      <>
        <Navbar />

        <div className="pt-28 flex justify-center items-center min-h-screen">
          <div className="text-center">

            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />

            <p className="mt-4 text-slate-500">
              Loading Dashboard...
            </p>

          </div>
        </div>
      </>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (isError) {
    return (
      <>
        <Navbar />

        <div className="pt-28">

          <div className="max-w-xl mx-auto mt-10 bg-red-50 border border-red-200 rounded-xl p-6">

            <h2 className="text-red-600 text-xl font-bold">
              Failed to load dashboard
            </h2>

            <p className="text-red-400 mt-2">
              {error?.response?.data?.message ||
                error?.message}
            </p>

            <button
              onClick={refetch}
              className="mt-5 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg"
            >
              Try Again
            </button>

          </div>

        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="pt-16 h-screen flex flex-col bg-[#FFFAF7]">

        {/* ================= HEADER ================= */}

        <div className="px-8 pt-2 shrink-0">

          {/* ================= STATS ================= */}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">

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


          {/* ================= PICKUP / DELIVERY + SORT ================= */}

          <div className="flex items-center justify-between mt-4">

            <div className="flex items-center gap-3">

              <button
                onClick={() => setParcelTab("pickup")}
                className={
                  parcelTab === "pickup"
                    ? "bg-[#E8734A] text-white px-5 py-2 rounded-lg font-medium"
                    : "bg-white border border-slate-200 text-slate-600 px-5 py-2 rounded-lg font-medium hover:bg-slate-50"
                }
              >
                Pickup Parcels
              </button>

              <button
                onClick={() => setParcelTab("delivery")}
                className={
                  parcelTab === "delivery"
                    ? "bg-[#E8734A] text-white px-5 py-2 rounded-lg font-medium"
                    : "bg-white border border-slate-200 text-slate-600 px-5 py-2 rounded-lg font-medium hover:bg-slate-50"
                }
              >
                Delivery Parcels
              </button>

            </div>

            <SortDropdown
              sortBy={sortBy}
              setSortBy={setSortBy}
            />

          </div>

        </div>


        {/* ================= PARCEL AREA ================= */}

        <div className="px-10 pt-4 pb-5 flex-1 min-h-0">

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 h-full flex flex-col">

            <div className="flex-1 min-h-0 overflow-y-auto px-5 py-5">

              {filteredParcels.length === 0 ? (

                <div className="text-center py-16">

                  <Package
                    size={70}
                    className="mx-auto text-slate-300"
                  />

                  <h3 className="mt-5 text-2xl font-semibold text-slate-700">
                    No Parcels Found
                  </h3>

                  <p className="text-slate-500 mt-2">
                    There are no parcels available.
                  </p>

                </div>

              ) : (

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

                  {filteredParcels.map((parcel) => (

                    <ParcelCard
                      key={parcel._id}
                      parcel={parcel}
                      type="admin"
                      parcelTab={parcelTab}
                      agents={agents}
                      onStatusChange={handleStatusChange}
                      onAssign={handleAssign}
                      showActions={true}
                    />

                  ))}

                </div>

              )}

            </div>

          </div>

        </div>

      </main>
    </>
  );
}