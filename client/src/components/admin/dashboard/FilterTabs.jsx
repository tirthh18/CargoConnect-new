export default function FilterTabs({ parcelTab, activeTab, setActiveTab }) {
  const pickupTabs = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Out for Pickup", value: "out_for_pickup" },
    { label: "Picked up", value: "picked_up" },
    { label: "In Transit", value: "in_transit" },
    { label: "Out for Delivery", value: "out_for_delivery" },
    { label: "Delivered", value: "delivered" },
    { label: "Cancelled", value: "cancelled" },
  ];

  const deliveryTabs = [
    { label: "In Transit", value: "in_transit" },
    { label: "Out for Delivery", value: "out_for_delivery" },
    { label: "Delivered", value: "delivered" },
    { label: "Cancelled", value: "cancelled" },
  ];

  const tabs = parcelTab === "pickup" ? pickupTabs : deliveryTabs;

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="font-medium text-slate-700">Filter:</span>

      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => setActiveTab(tab.value)}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === tab.value
              ? "bg-[#E8734A] text-white shadow"
              : "bg-white border border-gray-200 text-slate-600 hover:bg-gray-50"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
