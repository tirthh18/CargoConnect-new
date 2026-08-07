import { Route, Package, Clock3, MapPinned, User } from "lucide-react";

export default function RoutePanel({
  selectedAgent,
  parcels = [],
  optimizedRoute = [],
  routeDistance = 0,
  estimatedTime = 0,
  loading = false,
  onCalculate,
  onUpdateStatus,
}) {
  const route = optimizedRoute.length > 0 ? optimizedRoute : parcels;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-[#FDE8E1] flex items-center justify-center">
          <Route size={24} className="text-[#E8734A]" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-[#1B1B2F]">
            Route Optimization
          </h2>

          <p className="text-slate-500 text-sm">Optimize delivery sequence</p>
        </div>
      </div>
      {/* Agent */}
      <div className="mt-7 flex items-center gap-3">
        <User size={20} className="text-[#E8734A]" />

        <div>
          <p className="text-sm text-slate-500">Delivery Agent</p>

          <p className="font-semibold text-[#1B1B2F]">
            {selectedAgent?.name || "Select Agent"}
          </p>
        </div>
      </div>
      {/* Parcel Count */}
      <div className="mt-5 flex items-center gap-3">
        <Package size={20} className="text-[#E8734A]" />

        <div>
          <p className="text-sm text-slate-500">Active Parcels</p>

          <p className="font-semibold text-[#1B1B2F]">{route.length}</p>
        </div>
      </div>
      {/* Stops */}
      <div className="mt-5 flex items-center gap-3">
        <MapPinned size={20} className="text-[#E8734A]" />

        <div>
          <p className="text-sm text-slate-500">Stops</p>

          <p className="font-semibold text-[#1B1B2F]">{route.length}</p>
        </div>
      </div>
      {/* Parcel List */}
      <div className="mt-7 space-y-4 max-h-[420px] overflow-y-auto pr-1">
        {route.map((parcel, index) => {
          const isPickup = parcel.status === "out_for_pickup";

          const point = isPickup ? parcel.pickup : parcel.delivery;

          return (
            <div
              key={parcel._id}
              className="border rounded-xl p-4 bg-[#FAFAFA]"
            >
              {/* Stop */}

              <div className="flex justify-between items-center">
                <h3 className="font-bold text-[#1B1B2F]">Stop {index + 1}</h3>

                <span className="text-xs text-slate-500">
                  {parcel.trackingNumber}
                </span>
              </div>

              {/* Name + Mobile */}

              <div className="flex justify-between items-center mt-4">
                <p className="font-semibold text-[#1B1B2F]">{point.name} : {point.mobile} </p>
              </div>

              {/* Address */}

              <div className="mt-3">
                <p className="text-sm font-medium">Address : {point.address}</p>
                <p className="text-sm font-medium">{point.city} - {point.pincode}</p>
              </div>

              {/* Update Status */}

              <button
                onClick={() =>
                  onUpdateStatus(
                    parcel._id,
                    isPickup ? "picked_up" : "delivered",
                  )
                }
                className={`w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white shadow-md transition-all duration-200
  ${
    isPickup
      ? "bg-orange-500 hover:bg-orange-600 hover:shadow-lg active:scale-[0.98]"
      : "bg-green-600 hover:bg-green-700 hover:shadow-lg active:scale-[0.98]"
  }`}
              >
                {isPickup ? (
                  <>
                    📦 <span>Mark Picked Up</span>
                  </>
                ) : (
                  <>
                    ✅ <span>Mark Delivered</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>{" "}
      {/* Distance */}
      <div className="mt-6 flex items-center gap-3">
        <Route size={20} className="text-[#E8734A]" />

        <div>
          <p className="text-sm text-slate-500">Estimated Distance</p>

          <p className="font-semibold text-[#1B1B2F]">
            {routeDistance > 0 ? `${routeDistance.toFixed(2)} km` : "--"}
          </p>
        </div>
      </div>
      {/* Time */}
      <div className="mt-5 flex items-center gap-3">
        <Clock3 size={20} className="text-[#E8734A]" />

        <div>
          <p className="text-sm text-slate-500">Estimated Time</p>

          <p className="font-semibold text-[#1B1B2F]">
            {estimatedTime > 0 ? `${estimatedTime} mins` : "--"}
          </p>
        </div>
      </div>
      {/* Calculate Route Button */}
      <button
        disabled={loading || !selectedAgent || route.length === 0}
        onClick={onCalculate}
        className="w-full mt-8 bg-[#E8734A] hover:bg-[#D86642] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition"
      >
        {loading ? "Calculating Route..." : "Calculate Route"}
      </button>
    </div>
  );
}
