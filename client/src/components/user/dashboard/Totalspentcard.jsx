export default function TotalSpentCard({ amount, percentage }) {
  return (
    <div className="bg-[#EAFBF0] rounded-2xl p-8">
      <h2 className="text-lg font-semibold text-[#1B1B2F]">Total Spent</h2>
      <p className="mt-4 text-4xl font-extrabold text-[#1B1B2F]">
        ₹{amount.toFixed(2)}
      </p>
      {percentage !== undefined && (
        <div className="mt-6 h-2.5 w-full bg-white/70 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#22C55E] rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
    </div>
  );
}