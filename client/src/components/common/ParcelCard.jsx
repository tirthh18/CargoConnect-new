import { useState } from "react";
import { User, MapPin, Package, Truck, CalendarDays } from "lucide-react";

export default function ParcelCard({
  parcel,
  type,
  parcelTab,
  agents,
  onAssign,
  onStatusChange,
}) {
  const [selectedStatus, setSelectedStatus] = useState(parcel.status);
  const [selectedAgent, setSelectedAgent] = useState(parcel.assignedDeliveryAgent?._id || "",);

  const statusColor = {
    pending: "bg-yellow-100 text-yellow-700",
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

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

      <div className="flex justify-between items-center px-6 py-5 border-b">
        <div className="flex items-center gap-5">
          <h2 className="text-2xl font-bold text-[#1B1B2F]">
            Tracking # {parcel.trackingNumber}
          </h2>

          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-600">
              Priority :
            </span>

            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityColor[parcel.parcelDetails.priority] ||"bg-gray-100 text-gray-700"}`}>
              {parcel.parcelDetails.priority}
            </span>
          </div>
        </div>

        <span className={`px-4 py-1 rounded-full text-xs font-semibold ${statusColor[parcel.status] || "bg-gray-100 text-gray-700"}`}>
          {formatStatus(parcel.status)}
        </span>
      </div>


      <div className="grid md:grid-cols-2 gap-10 px-6 py-6">

        <div className="space-y-5">
          <div className="flex gap-3">
            <User size={18} className="text-slate-500 mt-1" />

            <div>
              <h4 className="font-semibold text-slate-700">Sender</h4>

              <p>
                {parcel.pickup.name} : {parcel.pickup.mobile}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <MapPin size={18} className="text-slate-500 mt-1" />

            <div>
              <h4 className="font-semibold text-slate-700">Sender Address</h4>

              <p>
                {parcel.pickup.address}, {parcel.pickup.city}
              </p>

              <p className="text-slate-500">
                Pincode : {parcel.pickup.pincode}
              </p>
            </div>
          </div>
        </div>


        <div className="space-y-5">
          <div className="flex gap-3">
            <User size={18} className="text-slate-500 mt-1" />

            <div>
              <h4 className="font-semibold text-slate-700">Receiver</h4>
              <p>
                {parcel.delivery.name} : {parcel.delivery.mobile}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <MapPin size={18} className="text-slate-500 mt-1" />

            <div>
              <h4 className="font-semibold text-slate-700">Receiver Address</h4>

              <p>
                {parcel.delivery.address}, {parcel.delivery.city}
              </p>

              <p className="text-slate-500">
                Pincode : {parcel.delivery.pincode}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t px-6 py-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="flex items-center gap-3">
            <CalendarDays size={18} className="text-slate-500" />

            <div>
              <p className="text-sm font-semibold text-slate-700">
                Schedule Date
              </p>

              <p className="text-slate-600">
                {new Date(parcel.parcelDetails.scheduleDate).toLocaleDateString("en-GB", {day: "2-digit", month: "short", year: "numeric"})}
              </p>
            </div>
          </div>


          <div className="flex items-center gap-3">
            <Package size={18} className="text-slate-500" />

            <div>
              <p className="text-sm font-semibold text-slate-700">Weight</p>
              <p className="text-slate-600">{parcel.parcelDetails.weight} kg</p>
            </div>
          </div>
        </div>
      </div>


      <div className="border-t bg-gray-50 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Assigned Agent */}

        <div className="flex items-center gap-2 text-slate-600">
          <Truck size={18} />

          <span>
            <div>
              {type === "admin" ? (
                parcelTab === "pickup" ? (
                  parcel.pickup?.agent ? (
                    <div className="flex items-center gap-2">
                      <span className="text-slate-600">Pickup Agent :</span>

                      <strong>{parcel.pickup.agent.name}</strong>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <select
                        value={selectedAgent}
                        onChange={(e) => setSelectedAgent(e.target.value)}
                        className="border rounded-lg px-3 py-2"
                      >
                        <option value="">Select Pickup Agent</option>

                        {agents.map((agent) => (
                          <option key={agent._id} value={agent._id}>
                            {agent.name}
                          </option>
                        ))}
                      </select>

                      <button onClick={() => onAssign(parcel._id, selectedAgent)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
                        Assign
                      </button>
                    </div>
                  )
                ) : parcel.delivery?.agent ? (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600">Delivery Agent :</span>

                    <strong>{parcel.delivery.agent.name}</strong>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <select
                      value={selectedAgent}
                      onChange={(e) => setSelectedAgent(e.target.value)}
                      className="border rounded-lg px-3 py-2"
                    >
                      <option value="">Select Delivery Agent</option>

                      {agents.map((agent) => (
                        <option key={agent._id} value={agent._id}>
                          {agent.name}
                        </option>
                      ))}
                    </select>

                    <button onClick={() => onAssign(parcel._id, selectedAgent)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
                      Assign
                    </button>
                  </div>
                )
              ) : (
                <div>
                  <span className="text-slate-600">Assigned To : {parcel.pickup?.agent || "Not Assigned"}</span>{" "}
                </div>
              )}
            </div>
          </span>
        </div>

        {/* User Actions */}

        {type === "user" ? (
          parcel.status === "pending" && (
            <button onClick={() => onStatusChange(parcel._id)} className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition">
              Cancel
            </button>
          )
        ) : (
          /* Admin Actions */
          <div className="flex items-center gap-3">
            {parcel.status === "picked_up" && (
              <button onClick={() => onStatusChange(parcel._id, "in_transit")} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition">
                In Transit
              </button>
            )}

            {parcel.status !== "cancelled" && (
              <button onClick={() => onStatusChange(parcel._id, "cancelled")} className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-medium transition" >
                Cancel
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
