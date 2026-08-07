export default function StatCard({ label, value, bg, iconBg, iconColor, icon }) {
  return (
    <div className={`rounded-2xl p-6 ${bg}`}>
      <div className="flex items-center justify-between">
        <p className="font-semibold text-[#1B1B2F]">{label}</p>
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center ${iconBg} ${iconColor}`}
        >
          {icon}
        </div>
      </div>
      <p className="mt-6 text-4xl font-extrabold text-[#1B1B2F]">{value}</p>
    </div>
  );
}