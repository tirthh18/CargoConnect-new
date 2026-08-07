export default function SenderDetails({ formData, handleChange }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-semibold text-[#1B1B2F] mb-5">
        Sender Details
      </h2>

      <div className="grid md:grid-cols-2 gap-5">

        <div>
          <label className="block text-sm font-medium mb-2">Full Name</label>

          <input
            type="text"
            name="senderName"
            value={formData.senderName}
            onChange={handleChange}
            placeholder="Enter sender name"
            className="w-full border rounded-xl px-4 py-3 outline-none focus:border-[#E8734A]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Mobile Number
          </label>

          <input
            type="text"
            name="senderMobile"
            value={formData.senderMobile}
            onChange={handleChange}
            maxLength={10}
            placeholder="Enter mobile number"
            className="w-full border rounded-xl px-4 py-3 outline-none focus:border-[#E8734A]"
          />
        </div>
      </div>

      <div className="mt-5">
        <label className="block text-sm font-medium mb-2">Pickup Address</label>

        <textarea
          rows={3}
          name="pickupAddress"
          value={formData.pickupAddress}
          onChange={handleChange}
          placeholder="Enter pickup address"
          className="w-full border rounded-xl px-4 py-3 outline-none resize-none focus:border-[#E8734A]"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-5 mt-5">
        <div>
          <label className="block text-sm font-medium mb-2">City</label>

          <select
            name="pickupCity"
            value={formData.pickupCity}
            onChange={handleChange}
          >
            <option value="">Select City</option>
            <option value="Nadiad">Nadiad</option>
            <option value="Amreli">Amreli</option>
          </select>
        </div>


        <div>
          <label className="block text-sm font-medium mb-2">Pincode</label>

          <input
            type="text"
            name="pickupPincode"
            value={formData.pickupPincode}
            onChange={handleChange}
            maxLength={6}
            placeholder="Enter pincode"
            className="w-full border rounded-xl px-4 py-3 outline-none focus:border-[#E8734A]"
          />
        </div>
      </div>
    </div>
  );
}
