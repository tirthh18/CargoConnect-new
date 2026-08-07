import { useMemo, useState } from "react";

import { useUserParcels, useCancelParcel } from "../../hooks/useParcel";

import Sidebar from "../../components/user/Sidebar";
import StatusTabs from "../../components/user/orderHistoy/StatusTabs";
import ParcelCard from "../../components/common/ParcelCard";

export default function OrderHistory() {
  const { data, isLoading, isError, error, refetch } = useUserParcels();
  const cancelMutation = useCancelParcel();

  const [activeTab, setActiveTab] = useState("all");

  const handleCancel = (id) => {
    if (window.confirm("Are you sure you want to cancel this parcel?")) {
      cancelMutation.mutate(id);
    }
  };

  const filteredOrders = useMemo(() => {
    if (!data?.parcels) return [];

    return data.parcels.filter((parcel) => {
      const matchStatus = activeTab === "all" ? true : parcel.status === activeTab;
      return matchStatus;
    });
  }, [data, activeTab]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex bg-[#FFFBF7]">
        <Sidebar />

        <main className="flex-1 flex justify-center items-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>

            <p className="mt-4 text-slate-500 font-medium">Loading Orders...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#FFFBF7]">
      <Sidebar />

      <main className="flex-1 px-10 py-10">

        {isError && (
          <div className="rounded-2xl bg-red-50 border border-red-200 p-6">
            <p className="text-red-600 font-semibold">Unable to load orders.</p>

            <p className="text-red-400 text-sm mt-2">
              {error?.response?.data?.message || error?.message}
            </p>

            <button onClick={refetch} className="mt-4 px-5 py-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 font-medium">
              Try Again
            </button>
          </div>
        )}


        {!isError && (
          <>

            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-5 mb-8">
              <div>
                <h1 className="text-3xl font-extrabold text-[#1B1B2F]">
                  Orders
                </h1>

                <p className="text-slate-500 mt-1">
                  Manage all your parcel deliveries
                </p>
              </div>
            </div>


            <StatusTabs activeTab={activeTab} setActiveTab={setActiveTab} />


            <div className="mt-8 space-y-6">
              {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border p-12 text-center">
                  <h2 className="text-xl font-semibold text-slate-700">
                    No Orders Found
                  </h2>

                  <p className="text-slate-500 mt-2">
                    No parcel matches your current filter.
                  </p>
                </div>
              ) : (
                filteredOrders.map((parcel) => (
                  <ParcelCard
                    key={parcel._id}
                    parcel={parcel}
                    type="user"
                    onStatusChange={handleCancel}
                  />
                ))
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
