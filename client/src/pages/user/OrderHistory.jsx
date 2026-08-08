import { useMemo, useState } from "react";

import {
  useUserParcels,
  useCancelParcel,
} from "../../hooks/useParcel";

import Sidebar from "../../components/user/Sidebar";
import StatusTabs from "../../components/common/StatusTabs";
import ParcelCard from "../../components/common/ParcelCard";

export default function OrderHistory() {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useUserParcels();

  const cancelMutation = useCancelParcel();

  const [activeTab, setActiveTab] = useState("all");

  // =========================
  // CANCEL ORDER
  // =========================

  const handleCancel = (id) => {
    if (
      window.confirm(
        "Are you sure you want to cancel this parcel?"
      )
    ) {
      cancelMutation.mutate(id);
    }
  };

  // =========================
  // FILTER ORDERS
  // =========================

  const filteredOrders = useMemo(() => {
    if (!data?.parcels) {
      return [];
    }

    return data.parcels.filter((parcel) => {

      const matchStatus =
        activeTab === "all"
          ? true
          : parcel.status === activeTab;

      return matchStatus;

    });

  }, [data, activeTab]);


  // =========================
  // LOADING
  // =========================

  if (isLoading) {
    return (
      <>
        <Sidebar />

        <main className="ml-64 h-screen flex items-center justify-center">

          <div className="text-center">

            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />

            <p className="mt-4 text-slate-500 font-medium">
              Loading Orders...
            </p>

          </div>

        </main>
      </>
    );
  }


  return (
    <>
      <Sidebar />

      <main className="ml-64 h-screen flex flex-col">

        {/* ================= HEADER ================= */}

        <div className="shrink-0 px-8 pt-8 pb-4">

          {isError ? (

            <div className="rounded-2xl bg-red-50 border border-red-200 p-6">

              <p className="text-red-600 font-semibold">
                Unable to load orders.
              </p>

              <p className="text-red-400 text-sm mt-2">
                {error?.response?.data?.message ||
                  error?.message}
              </p>

              <button
                onClick={refetch}
                className="mt-4 px-5 py-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 font-medium"
              >
                Try Again
              </button>

            </div>

          ) : (

            <>

              <h1 className="text-3xl font-extrabold text-[#1B1B2F]">
                Orders
              </h1>

              <p className="text-slate-500 mt-1">
                Manage all your parcel deliveries
              </p>

            </>

          )}

        </div>


        {!isError && (

          <>

            {/* ================= FILTER TABS ================= */}

            <div className="shrink-0 px-8 pb-4">

              <StatusTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />

            </div>


            {/* ================= SCROLLABLE ORDERS ================= */}

            <div className="flex-1 overflow-y-auto px-8 pb-8">

              <div className="space-y-6">

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

            </div>

          </>

        )}

      </main>
    </>
  );
}