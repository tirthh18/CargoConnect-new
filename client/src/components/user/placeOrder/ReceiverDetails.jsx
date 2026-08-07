export default function ReceiverDetails({ formData, handleChange }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-semibold text-[#1B1B2F] mb-5">
        Receiver Details
      </h2>

      <div className="grid md:grid-cols-2 gap-5">
        
        <div>
          <label className="block text-sm font-medium mb-2">Full Name</label>

          <input
            type="text"
            name="receiverName"
            value={formData.receiverName}
            onChange={handleChange}
            placeholder="Enter receiver name"
            className="w-full border rounded-xl px-4 py-3 outline-none focus:border-[#E8734A]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Mobile Number
          </label>

          <input
            type="text"
            name="receiverMobile"
            value={formData.receiverMobile}
            onChange={handleChange}
            maxLength={10}
            placeholder="Enter mobile number"
            className="w-full border rounded-xl px-4 py-3 outline-none focus:border-[#E8734A]"
          />
        </div>
      </div>

      <div className="mt-5">
        <label className="block text-sm font-medium mb-2">
          Delivery Address
        </label>

        <textarea
          rows={3}
          name="dropAddress"
          value={formData.dropAddress}
          onChange={handleChange}
          placeholder="Enter delivery address"
          className="w-full border rounded-xl px-4 py-3 resize-none outline-none focus:border-[#E8734A]"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-5 mt-5">
        <div>
          <label className="block text-sm font-medium mb-2">City</label>

          <select
            name="dropCity"
            value={formData.dropCity}
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
            name="dropPincode"
            value={formData.dropPincode}
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
