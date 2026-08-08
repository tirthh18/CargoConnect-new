import React from "react";

 const tabs = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Out for Pickup", value: "out_for_pickup" },
    { label: "Picked up", value: "picked_up" },
    { label: "In Transit", value: "in_transit" },
    { label: "Out for Delivery", value: "out_for_delivery" },
    { label: "Delivered", value: "delivered" },
    { label: "Cancelled", value: "cancelled" },
  ];

export default function StatusTabs({ activeTab, setActiveTab }) {
  return (
    <div className="flex flex-wrap gap-2 bg-gray-100 rounded-lg p-1 w-fit">

      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => setActiveTab(tab.value)}
          className={`px-5 py-2 rounded-md text-sm font-medium transition-all duration-200
            ${
              activeTab === tab.value
                ? "bg-white text-slate-900 shadow"
                : "text-slate-500 hover:text-slate-800"
            }
          `}
        >
          {tab.label}
        </button>
      ))}

    </div>
  );
}