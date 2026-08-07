export default function StatCard({
  title,
  value,
  icon,
  bgColor,
  iconBg,
  iconColor,
}) {
  return (
    <div
      className={`${bgColor} rounded-2xl border border-gray-200 p-6 shadow-sm`}
    >
      <div className="flex items-center gap-4">
        {/* Icon */}

        <div
          className={`${iconBg} w-14 h-14 rounded-xl flex items-center justify-center`}
        >
          <div className={iconColor}>{icon}</div>
        </div>

        {/* Text */}

        <div>
          <p className="text-slate-600 text-sm font-medium">
            {title}
          </p>

          <h2 className="text-4xl font-bold text-[#1B1B2F] mt-1">
            {value}
          </h2>
        </div>
      </div>
    </div>
  );
}