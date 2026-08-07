export default function DashboardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-48 bg-slate-200 rounded-lg" />

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl p-6 bg-slate-100 h-32" />
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
        <div className="rounded-2xl bg-slate-100 h-96" />
        <div className="rounded-2xl bg-slate-100 h-96" />
      </div>
    </div>
  );
}