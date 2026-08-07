export default function ValueItem({
  icon,
  title,
  description,
}) {
  return (
    <div className="flex gap-4">

      <div className="mt-1">
        {icon}
      </div>

      <div>

        <h4 className="font-semibold text-[#1B1B2F]">
          {title}
        </h4>

        <p className="text-slate-600">
          {description}
        </p>

      </div>

    </div>
  );
}