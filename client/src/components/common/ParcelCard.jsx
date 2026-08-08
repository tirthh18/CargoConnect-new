import { useState } from "react";
import {
  User,
  MapPin,
  Package,
  Truck,
  CalendarDays,
} from "lucide-react";

export default function ParcelCard({
  parcel,
  type,
  parcelTab,
  agents,
  onAssign,
  onStatusChange,
  showActions = false,
}) {
  const [selectedAgent, setSelectedAgent] = useState(
    parcel.pickup?.agent?._id ||
      parcel.delivery?.agent?._id ||
      parcel.assignedDeliveryAgent?._id ||
      ""
  );

  const statusColor = {
    pending: "bg-yellow-100 text-yellow-700",
    out_for_pickup: "bg-gray-100 text-gray-700",
    picked_up: "bg-purple-100 text-purple-700",
    in_transit: "bg-blue-100 text-blue-700",
    out_for_delivery: "bg-indigo-100 text-indigo-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  const priorityColor = {
    low: "bg-green-100 text-green-700",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-red-100 text-red-700",
  };

  const formatStatus = (status) => {
    return status
      .replaceAll("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // =========================================================
  // DETERMINE WHETHER THIS PARCEL IS IN PICKUP OR DELIVERY
  // =========================================================

  const pickupStatuses = [
    "pending",
    "out_for_pickup",
    "picked_up",
  ];

  const deliveryStatuses = [
    "in_transit",
    "out_for_delivery",
    "delivered",
  ];

  let isPickup;

  // Dashboard / Admin Order History explicitly tells us
  // whether this is pickup or delivery.
  if (parcelTab === "pickup") {
    isPickup = true;
  } else if (parcelTab === "delivery") {
    isPickup = false;
  } else if (pickupStatuses.includes(parcel.status)) {
    // User Order History doesn't have parcelTab.
    isPickup = true;
  } else if (deliveryStatuses.includes(parcel.status)) {
    isPickup = false;
  } else {
    // For cancelled parcels, use whichever agent exists.
    isPickup = !!parcel.pickup?.agent;
  }

  // =========================================================
  // ASSIGNED AGENT
  // =========================================================

  const assignedAgent = isPickup
    ? parcel.pickup?.agent || parcel.delivery?.agent
    : parcel.delivery?.agent || parcel.pickup?.agent;

  const agentLabel = isPickup
    ? "Pickup Agent"
    : "Delivery Agent";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex justify-between items-center px-5 py-3 border-b border-slate-800">

        <div className="flex items-center gap-5 min-w-0">

          <h2 className="text-2xl font-bold text-[#1B1B2F] whitespace-nowrap">
            Tracking # {parcel.trackingNumber}
          </h2>

          <div className="flex items-center gap-2">

            <span className="text-sm font-semibold text-slate-600 whitespace-nowrap">
              Priority :
            </span>

            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                priorityColor[parcel.parcelDetails.priority] ||
                "bg-gray-100 text-gray-700"
              }`}
            >
              {parcel.parcelDetails.priority}
            </span>

          </div>

        </div>

        <span
          className={`px-4 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
            statusColor[parcel.status] ||
            "bg-gray-100 text-gray-700"
          }`}
        >
          {formatStatus(parcel.status)}
        </span>

      </div>


      {/* =====================================================
          SENDER + RECEIVER
      ===================================================== */}

      <div className="grid grid-cols-2 gap-x-8 px-5 py-4">

        {/* ================= SENDER ================= */}

        <div className="grid grid-rows-[52px_80px] gap-y-3">

          <div className="flex gap-3">

            <User
              size={18}
              className="text-slate-500 mt-1 shrink-0"
            />

            <div className="min-w-0">

              <h4 className="font-semibold text-slate-700">
                Sender
              </h4>

              <p className="truncate">
                {parcel.pickup.name} : {parcel.pickup.mobile}
              </p>

            </div>

          </div>


          <div className="flex gap-3">

            <MapPin
              size={18}
              className="text-slate-500 mt-1 shrink-0"
            />

            <div className="min-w-0">

              <h4 className="font-semibold text-slate-700">
                Sender Address
              </h4>

              <p className="line-clamp-2">
                {parcel.pickup.address}, {parcel.pickup.city}
              </p>

              <p className="text-slate-500">
                Pincode : {parcel.pickup.pincode}
              </p>

            </div>

          </div>

        </div>


        {/* ================= RECEIVER ================= */}

        <div className="grid grid-rows-[52px_80px] gap-y-3">

          <div className="flex gap-3">

            <User
              size={18}
              className="text-slate-500 mt-1 shrink-0"
            />

            <div className="min-w-0">

              <h4 className="font-semibold text-slate-700">
                Receiver
              </h4>

              <p className="truncate">
                {parcel.delivery.name} : {parcel.delivery.mobile}
              </p>

            </div>

          </div>


          <div className="flex gap-3">

            <MapPin
              size={18}
              className="text-slate-500 mt-1 shrink-0"
            />

            <div className="min-w-0">

              <h4 className="font-semibold text-slate-700">
                Receiver Address
              </h4>

              <p className="line-clamp-2">
                {parcel.delivery.address}, {parcel.delivery.city}
              </p>

              <p className="text-slate-500">
                Pincode : {parcel.delivery.pincode}
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          SCHEDULE + WEIGHT
      ===================================================== */}

      <div className="px-5 pb-4">

        <div className="grid grid-cols-2 gap-x-8">

          {/* Schedule Date */}

          <div className="flex items-center gap-3">

            <CalendarDays
              size={18}
              className="text-slate-500 shrink-0"
            />

            <div>

              <p className="text-sm font-semibold text-slate-700 leading-tight">
                Schedule Date
              </p>

              <p className="text-slate-600 leading-tight">
                {new Date(
                  parcel.parcelDetails.scheduleDate
                ).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>

            </div>

          </div>


          {/* Weight */}

          <div className="flex items-center gap-3">

            <Package
              size={18}
              className="text-slate-500 shrink-0"
            />

            <div>

              <p className="text-sm font-semibold text-slate-700 leading-tight">
                Weight
              </p>

              <p className="text-slate-600 leading-tight">
                {parcel.parcelDetails.weight} kg
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          AGENT + ACTIONS
      ===================================================== */}

      <div className="border-t bg-gray-50 px-5 min-h-[58px] py-2 flex items-center justify-between gap-3">

        {/* ================= ASSIGNED AGENT ================= */}

        <div className="flex items-center gap-2 text-slate-600 min-w-0">

          <Truck
            size={18}
            className="shrink-0"
          />

          <div className="min-w-0">

            {/* =================================================
                ADMIN
            ================================================= */}

            {type === "admin" ? (

              assignedAgent ? (

                <div className="flex items-center gap-2">

                  <span className="text-slate-600 whitespace-nowrap">
                    {agentLabel} :
                  </span>

                  <strong className="text-slate-700 whitespace-nowrap">
                    {assignedAgent.name}
                  </strong>

                </div>

              ) : showActions ? (

                /* ================= ASSIGN AGENT ================= */

                <div className="flex items-center gap-3">

                  <span className="text-slate-600 whitespace-nowrap">
                    {agentLabel} :
                  </span>

                  <select
                    value={selectedAgent}
                    onChange={(e) =>
                      setSelectedAgent(e.target.value)
                    }
                    className="border border-slate-300 rounded-lg px-3 py-1.5 bg-white text-sm"
                  >

                    <option value="">
                      {isPickup
                        ? "Select Pickup Agent"
                        : "Select Delivery Agent"}
                    </option>

                    {(agents || []).map((agent) => (

                      <option
                        key={agent._id}
                        value={agent._id}
                      >
                        {agent.name}
                      </option>

                    ))}

                  </select>

                  <button
                    disabled={!selectedAgent}
                    onClick={() =>
                      onAssign(
                        parcel._id,
                        selectedAgent
                      )
                    }
                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-4 py-1.5 rounded-lg text-sm font-medium"
                  >
                    Assign
                  </button>

                </div>

              ) : (

                /* ================= ADMIN HISTORY ================= */

                <div className="flex items-center gap-2">

                  <span className="text-slate-600 whitespace-nowrap">
                    {agentLabel} :
                  </span>

                  <strong className="text-slate-700 whitespace-nowrap">
                    Not Assigned
                  </strong>

                </div>

              )

            ) : (

              /* =================================================
                 USER
              ================================================= */

              <div className="flex items-center gap-2">

                <span className="text-slate-600 whitespace-nowrap">
                  Assigned To :
                </span>

                <strong className="text-slate-700 whitespace-nowrap">
                  {assignedAgent?.name || "Not Assigned"}
                </strong>

              </div>

            )}

          </div>

        </div>


        {/* =====================================================
            ACTIONS
        ===================================================== */}

        <div className="shrink-0">

          {/* ================= USER ================= */}

          {type === "user" ? (

            parcel.status === "pending" && (

              <button
                onClick={() =>
                  onStatusChange?.(parcel._id)
                }
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition"
              >
                Cancel
              </button>

            )

          ) : (

            /* ================= ADMIN ================= */

            showActions && (

              <div className="flex items-center gap-3">

                {parcel.status === "picked_up" && (

                  <button
                    onClick={() =>
                      onStatusChange(
                        parcel._id,
                        "in_transit"
                      )
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition"
                  >
                    In Transit
                  </button>

                )}

                {parcel.status !== "cancelled" && (

                  <button
                    onClick={() =>
                      onStatusChange(
                        parcel._id,
                        "cancelled"
                      )
                    }
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-medium transition"
                  >
                    Cancel
                  </button>

                )}

              </div>

            )

          )}

        </div>

      </div>

    </div>
  );
}