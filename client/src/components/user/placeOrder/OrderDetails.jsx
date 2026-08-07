export default function OrderDetails({formData, handleChange, calculatePrice,}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-semibold text-[#1B1B2F] mb-5">
        Order Details
      </h2>

      <div className="grid md:grid-cols-2 gap-5">

        <div>
          <label className="block text-sm font-medium mb-2">
            Parcel Priority
          </label>

          <select
            name="priority"
            value={formData.priority}
            onChange={(e) => {handleChange(e); calculatePrice();}}
            className="w-full border rounded-xl px-4 py-3 outline-none focus:border-[#E8734A]"
          >
            <option value="low">Low</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Delivery Type
          </label>

          <input
            type="text"
            value={formData.deliveryType }
            readOnly
            className="w-full border rounded-xl px-4 py-3 bg-gray-100 cursor-not-allowed"
          />
        </div>


        <div>
          <label className="block text-sm font-medium mb-2">
            Parcel Weight (kg)
          </label>

          <select
            name="weight"
            value={formData.weight}
            onChange={(e) => { handleChange(e); calculatePrice();}}
            className="w-full border rounded-xl px-4 py-3 outline-none focus:border-[#E8734A]"
          >
            <option value="5">5 kg</option>
            <option value="10">10 kg</option>
            <option value="15">15 kg</option>
            <option value="20">20 kg</option>
          </select>
        </div>


        <div>
          <label className="block text-sm font-medium mb-2">Pickup Date</label>

          <input
            type="date"
            name="selectedDate"
            value={formData.selectedDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3 outline-none focus:border-[#E8734A]"
          />
        </div>
      </div>

      <div className="mt-5">
        <label className="block text-sm font-medium mb-2">Payment Method</label>

        <div className="flex gap-8">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value="cash"
              checked={formData.paymentMethod === "cash"}
              onChange={handleChange}
            />
            Cash
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value="upi"
              checked={formData.paymentMethod === "upi"}
              onChange={handleChange}
            />
            UPI
          </label>
        </div>
      </div>

      {/* {formData.paymentMethod === "upi" && (
        <div className="mt-5">
          <label className="block text-sm font-medium mb-2">UPI ID</label>

          <input
            type="text"
            name="upiId"
            value={formData.upiId}
            onChange={handleChange}
            placeholder="example@upi"
            className="w-full border rounded-xl px-4 py-3 outline-none focus:border-[#E8734A]"
          />
        </div>
      )} */}
    </div>
  );
}
