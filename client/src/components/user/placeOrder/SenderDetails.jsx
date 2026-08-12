import AddressAutocomplete from "./AdressAutocomplate";

export default function SenderDetails({ formData, handleChange }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <h2 className="text-lg font-bold text-[#1B1B2F] mb-5">Sender Details</h2>

      <div className="space-y-4">
        {/* Full Name */}
        <div className="grid grid-cols-[130px_1fr] items-center gap-4">
          <label className="text-sm font-medium text-slate-600">
            Full Name
          </label>

          <input
            type="text"
            name="senderName"
            value={formData.senderName}
            onChange={handleChange}
            placeholder="Enter sender name"
            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:border-[#E8734A] focus:ring-1 focus:ring-[#E8734A]/30"
          />
        </div>

        {/* Mobile Number */}
        <div className="grid grid-cols-[130px_1fr] items-center gap-4">
          <label className="text-sm font-medium text-slate-600">
            Mobile Number
          </label>

          <input
            type="text"
            name="senderMobile"
            value={formData.senderMobile}
            onChange={handleChange}
            maxLength={10}
            placeholder="Enter mobile number"
            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:border-[#E8734A] focus:ring-1 focus:ring-[#E8734A]/30"
          />
        </div>

        {/* Pickup Address */}
        <div className="grid grid-cols-[130px_1fr] gap-4">
          <label className="text-sm font-medium text-slate-600 pt-2">
            Pickup Address
          </label>

          <AddressAutocomplete
  value={formData.pickupAddress}
  onChange={(value) =>  handleChange({ target: { name: "pickupAddress", value, }})}
  onPlaceSelect={(place) => { handleChange({ target: { name: "pickupCoordinates", value: { lat: place.lat, lng: place.lng, }}});}}
  placeholder="Enter pickup address"
/>
        </div>

        {/* Pincode */}
        <div className="grid grid-cols-[130px_1fr] items-center gap-4">
          <label className="text-sm font-medium text-slate-600">Pincode</label>

          <input
            type="text"
            name="pickupPincode"
            value={formData.pickupPincode}
            onChange={handleChange}
            maxLength={6}
            placeholder="Enter pincode"
            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:border-[#E8734A] focus:ring-1 focus:ring-[#E8734A]/30"
          />
        </div>

        {/* City */}
        <div className="grid grid-cols-[130px_1fr] items-center gap-4">
          <label className="text-sm font-medium text-slate-600">City</label>

          <select
            name="pickupCity"
            value={formData.pickupCity}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none bg-white focus:border-[#E8734A] focus:ring-1 focus:ring-[#E8734A]/30"
          >
            <option value="">Select City</option>
            <option value="Nadiad">Nadiad</option>
            <option value="Amreli">Amreli</option>
          </select>
        </div>
      </div>
    </div>
  );
}
