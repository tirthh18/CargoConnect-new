import { useMemo, useState } from "react";
import { Package } from "lucide-react";

import Navbar from "../../components/admin/Navbar";
import StatusTabs from "../../components/common/StatusTabs";
import ParcelCard from "../../components/common/ParcelCard";
import SortDropdown from "../../components/admin/dashboard/SortDropdown";

import { useAdminDashboard } from "../../hooks/useAdminDashboard";

export default function OrderHistory() {
  const { data, isLoading, isError, error, refetch } = useAdminDashboard();

  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // =========================
  // ONLY PICKUP PARCELS
  // =========================

  const pickupParcels = data?.pickupParcels || [];

  // =========================
  // FILTER BY STATUS
  // =========================

  const filteredOrders = useMemo(() => {
    if (!pickupParcels.length) {
      return [];
    }

    if (activeTab === "all") {
      return pickupParcels;
    }

    return pickupParcels.filter((parcel) => parcel.status === activeTab);
  }, [pickupParcels, activeTab]);

  // =========================
  // LOADING
  // =========================

  if (isLoading) {
    return (
      <>
        <Navbar />

        <main className="pt-20 h-screen flex items-center justify-center bg-[#FFFAF7]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />

            <p className="mt-4 text-slate-500 font-medium">Loading Orders...</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="pt-20 h-screen flex flex-col bg-[#FFFAF7]">
        {/* ================= ERROR ================= */}

        {isError ? (
          <div className="px-8 pt-6">
            <div className="rounded-2xl bg-red-50 border border-red-200 p-6">
              <p className="text-red-600 font-semibold">
                Unable to load orders.
              </p>

              <p className="text-red-400 text-sm mt-2">
                {error?.response?.data?.message || error?.message}
              </p>

              <button
                onClick={refetch}
                className="mt-4 px-5 py-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* ================= FILTER TABS ================= */}

            <div className="shrink-0 px-8 pt-6 pb-4 flex items-center justify-between">
              <StatusTabs activeTab={activeTab} setActiveTab={setActiveTab} />

              <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
            </div>

            {/* ================= PARCELS ================= */}

            <div className="flex-1 min-h-0 overflow-y-auto px-8 pb-6">
              {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
                  <Package size={60} className="mx-auto text-slate-300" />

                  <h2 className="mt-4 text-xl font-semibold text-slate-700">
                    No Orders Found
                  </h2>

                  <p className="text-slate-500 mt-2">
                    No pickup parcel matches your current filter.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                  {filteredOrders.map((parcel) => (
                    <ParcelCard
                      key={parcel._id}
                      parcel={parcel}
                      type="admin"
                      parcelTab="pickup"
                      showActions={false}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </>
  );
}
