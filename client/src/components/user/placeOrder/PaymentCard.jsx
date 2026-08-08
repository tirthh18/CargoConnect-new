export default function PaymentCard({
  formData,
  handleChange,
  price,
  loading,
  onSubmit,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 h-fit sticky top-6">
      <h2 className="text-xl font-bold text-[#1B1B2F] mb-6">
        Payment Summary
      </h2>

      <div className="space-y-5">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Shipping Charge</span>
          <span className="font-medium text-slate-800">
            ₹ {price.shipping}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-slate-600">GST (18%)</span>
          <span className="font-medium text-slate-800">
            ₹ {price.gst}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Insurance</span>
          <span className="font-medium text-slate-800">
            ₹ {price.insurance}
          </span>
        </div>

        <div className="border-t border-slate-200 pt-5">
          <div className="flex justify-between">
            <span className="text-lg font-bold text-[#1B1B2F]">
              Total
            </span>

            <span className="text-lg font-bold text-[#1B1B2F]">
              ₹ {price.total}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={loading}
        className="mt-7 w-full bg-[#E8734A] hover:bg-[#D9653E] text-white rounded-xl py-3.5 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
}