export default function PaymentCard({
  formData,
  handleChange,
  price,
  loading,
  onSubmit,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit sticky top-6">

      <h2 className="text-xl font-semibold mb-6">
        Payment Summary
      </h2>

      <div className="space-y-4">

        <div className="flex justify-between">
          <span>Shipping Charge</span>
          <span>₹ {price.shipping}</span>
        </div>

        <div className="flex justify-between">
          <span>GST (18%)</span>
          <span>₹ {price.gst}</span>
        </div>

        <div className="flex justify-between">
          <span>Insurance</span>
          <span>₹ {price.insurance}</span>
        </div>

        <hr />

        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>₹ {price.total}</span>
        </div>

      </div>

      <button
        onClick={onSubmit}
        disabled={loading}
        className="mt-8 w-full bg-[#E8734A] hover:bg-[#D9653E] text-white rounded-xl py-3 font-semibold disabled:opacity-50"
      >
        {loading ? "Placing Order..." : "Place Order"}
      </button>

    </div>
  );
}