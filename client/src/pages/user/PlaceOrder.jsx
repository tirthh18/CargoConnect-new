import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

import { useCreateParcel } from "../../hooks/useParcel";
import {
  useCreatePaymentOrder,
  useVerifyPayment,
} from "../../hooks/usePayment";

import Sidebar from "../../components/user/Sidebar";
import SenderDetails from "../../components/user/placeOrder/SenderDetails";
import ReceiverDetails from "../../components/user/placeOrder/ReceiverDetails";
import OrderDetails from "../../components/user/placeOrder/OrderDetails";
import PaymentCard from "../../components/user/placeOrder/PaymentCard";

import calculatePrice from "../../utils/calculatePrice";

export default function PlaceOrder() {
  const { user } = useAuth();

  const { mutateAsync: createParcel, isPending } = useCreateParcel();

  const { mutateAsync: createOrder } = useCreatePaymentOrder();
  const { mutateAsync: verifyPayment } = useVerifyPayment();

  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    senderName: user?.name || "",
    senderMobile: "",
    pickupAddress: "",
    pickupCity: "",
    pickupPincode: "",

    receiverName: "",
    receiverMobile: "",
    dropAddress: "",
    dropCity: "",
    dropPincode: "",

    priority: "low",
    deliveryType: "local",
    weight: 5,
    selectedDate: today,

    paymentMethod: "cod",
    upiId: "",
  });

  const price = calculatePrice(
  formData.deliveryType,
  Number(formData.weight),
  formData.priority
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };

      if (name === "pickupCity" || name === "dropCity") {
        if (
          updated.pickupCity &&
          updated.dropCity &&
          updated.pickupCity === updated.dropCity
        ) {
          updated.deliveryType = "local";
        } else if (updated.pickupCity && updated.dropCity) {
          updated.deliveryType = "intercity";
        }
      }

      return updated;
    });
  };

  const validate = () => {
    if (
      !formData.senderName ||
      !formData.senderMobile ||
      !formData.pickupAddress ||
      !formData.pickupCity ||
      !formData.pickupPincode ||
      !formData.receiverName ||
      !formData.receiverMobile ||
      !formData.dropAddress ||
      !formData.dropCity ||
      !formData.dropPincode ||
      !formData.selectedDate ||
      !formData.priority ||
      !formData.deliveryType ||
      !formData.weight ||
      !formData.paymentMethod
    ) {
      alert("Please fill all required fields.");
      return false;
    }

    return true;
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      if (formData.paymentMethod === "cash") {
        await createParcel({
          ...formData,
          paymentMethod: "cash",
          paymentStatus: "pending",
        });

        alert("Order placed successfully");
        return;
      }

      const loaded = await loadRazorpay();

      if (!loaded) {
        alert("Failed to load Razorpay SDK");
        return;
      }

      const orderResponse = await createOrder({
        deliveryType: formData.deliveryType,
        weight: Number(formData.weight),
        priority: formData.priority,
      });

      const order = orderResponse.order;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,

        amount: order.amount,
        currency: order.currency,
        order_id: order.id,

        name: "CargoConnect",
        description: "Parcel Booking",

        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: formData.senderMobile,
        },

        theme: {
          color: "#E8734A",
        },

        handler: async function (response) {
          try {
            const verify = await verifyPayment({
              razorpay_order_id:
                response.razorpay_order_id,

              razorpay_payment_id:
                response.razorpay_payment_id,

              razorpay_signature:
                response.razorpay_signature,
            });

            if (!verify.success) {
              alert("Payment Verification Failed");
              return;
            }

            await createParcel({
              ...formData,

              paymentMethod: "online",
              paymentStatus: "completed",

              paymentId:
                response.razorpay_payment_id,

              orderId:
                response.razorpay_order_id,

              signature:
                response.razorpay_signature,
            });

            alert("Order Placed Successfully");
          } catch (err) {
            console.log(
              "Parcel creation error:",
              err
            );

            alert(
              "Payment verified but Parcel creation failed."
            );
          }
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on(
        "payment.failed",
        function (response) {
          alert(response.error.description);
        }
      );

      rzp.open();
    } catch (err) {
      console.log("Payment Error:", err);

      alert(
        err.response?.data?.message ||
          "Payment Failed"
      );
    }
  };

  return (
  <div className="flex h-screen overflow-hidden bg-[#FFF9F6]">
    <Sidebar />

    <main className="ml-64 flex-1 h-screen overflow-hidden px-6 py-5">
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-[#1B1B2F]">
          Place New Order
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Enter shipment details and complete your order
        </p>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_340px] gap-5 h-[calc(100vh-105px)]">
        
        {/* Left Side */}
        <div className="min-w-0 flex flex-col gap-4 overflow-hidden">

          {/* Sender + Receiver */}
          <div className="grid grid-cols-2 gap-4">
            <SenderDetails
              formData={formData}
              handleChange={handleChange}
            />

            <ReceiverDetails
              formData={formData}
              handleChange={handleChange}
            />
          </div>

          {/* Order Details */}
          <OrderDetails
            formData={formData}
            handleChange={handleChange}
            calculatePrice={calculatePrice}
          />
        </div>

        <div className="min-w-0">
          <PaymentCard
            formData={formData}
            handleChange={handleChange}
            price={price}
            loading={isPending}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </main>
  </div>
);
}