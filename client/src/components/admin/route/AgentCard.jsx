import { Truck } from "lucide-react";

export default function AgentCard({
  agent,
  selectedAgent,
  onSelect,
}) {
  const isActive = selectedAgent === agent._id;

  return (
    <button
      onClick={() => onSelect(agent._id)}
      className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl border transition-all duration-200 text-left
        ${
          isActive
            ? "border-[#E8734A] bg-[#FFF7F4] shadow-sm"
            : "border-gray-200 bg-white hover:border-[#E8734A] hover:bg-[#FFF7F4]"
        }`}
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center
          ${
            isActive
              ? "bg-[#FDE8E1] text-[#E8734A]"
              : "bg-gray-100 text-gray-500"
          }`}
      >
        <Truck size={18} />
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-[#1B1B2F]">
          {agent.name}
        </h3>

        {agent.city && (
          <p className="text-sm text-gray-500 mt-1">
            {agent.city}
          </p>
        )}
      </div>
    </button>
  );
}