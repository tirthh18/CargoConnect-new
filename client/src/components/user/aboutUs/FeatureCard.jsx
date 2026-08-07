export default function FeatureCard({
  icon,
  title,
  description,
}) {
  return (
    <div className="bg-[#FFFDF8] border border-[#F6E7D8] rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-shadow">

      <div className="w-12 h-12 mx-auto rounded-full bg-[#FFF1EA] flex items-center justify-center">
        {icon}
      </div>

      <h3 className="mt-6 text-2xl font-bold text-[#1B1B2F]">
        {title}
      </h3>

      <p className="mt-4 text-slate-600 leading-7">
        {description}
      </p>

    </div>
  );
}