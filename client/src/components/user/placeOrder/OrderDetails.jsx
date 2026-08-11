export default function OrderDetails({
  formData,
  handleChange,
  calculatePrice,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <h2 className="text-lg font-bold text-[#1B1B2F] mb-5">
        Order Details
      </h2>

      <div className="grid grid-cols-2 gap-x-5 gap-y-4">

        {/* Parcel Priority */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Parcel Priority
          </label>

          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none bg-white focus:border-[#E8734A] focus:ring-1 focus:ring-[#E8734A]/30"
          >
            <option value="low">Low</option>
            <option value="high">High</option>
          </select>
        </div>

        
        {/* Parcel Weight */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Parcel Weight
          </label>

          <select
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none bg-white focus:border-[#E8734A] focus:ring-1 focus:ring-[#E8734A]/30"
          >
            <option value="5">5 kg</option>
            <option value="10">10 kg</option>
            <option value="15">15 kg</option>
            <option value="20">20 kg</option>
          </select>
        </div>

        {/* Pickup Date */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Pickup Date
          </label>

          <input
            type="date"
            name="selectedDate"
            value={formData.selectedDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:border-[#E8734A] focus:ring-1 focus:ring-[#E8734A]/30"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Delivery Type
          </label>

          <input
            type="text"
            value={formData.deliveryType}
            readOnly
            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 bg-slate-100 text-slate-600 cursor-not-allowed"
          />
        </div>

        {/* Payment Method */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Payment Method
          </label>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={formData.paymentMethod === "cash"}
                onChange={handleChange}
                className="accent-[#E8734A]"
              />
              Cash
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="radio"
                name="paymentMethod"
                value="upi"
                checked={formData.paymentMethod === "upi"}
                onChange={handleChange}
                className="accent-[#E8734A]"
              />
              Online
            </label>
          </div>
        </div>

      </div>
    </div>
  );
}