export default function SortDropdown({
  sortBy,
  setSortBy,
}) {
  return (
    <div className="flex items-center gap-3">

      <span className="font-medium text-slate-700">
        Sort by:
      </span>

      <select
        value={sortBy}
        onChange={(e) =>
          setSortBy(e.target.value)
        }
        className="border rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-[#E8734A]"
      >
        <option value="newest">
          Newest
        </option>

        <option value="oldest">
          Oldest
        </option>

      </select>

    </div>
  );
}