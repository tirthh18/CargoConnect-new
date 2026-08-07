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
    formData.pickupCity,
    formData.dropCity,
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
      // Prevent loading the script multiple times
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";

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

    console.log("Creating Razorpay Order...");

    const orderResponse = await createOrder({
      deliveryType: formData.deliveryType,
      weight: Number(formData.weight),
      priority: formData.priority,
    });

    console.log("Order Response :", orderResponse);

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
        console.log("Payment Success");
        console.log(response);

        try {
          const verify = await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          console.log("Verify Response:", verify);

          if (!verify.success) {
            alert("Payment Verification Failed");
            return;
          }

          await createParcel({
            ...formData,
            paymentMethod: "online",
            paymentStatus: "paid",
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
          });

          alert("Order Placed Successfully");
        } catch (err) {
          console.log(err);
          alert("Payment verified but Parcel creation failed.");
        }
      },

      modal: {
        ondismiss: function () {
          console.log("Payment popup closed");
        },
      },
    };

    console.log("Opening Razorpay");

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", function (response) {
      console.log("Payment Failed");
      console.log(response.error);

      alert(response.error.description);
    });

    rzp.open();
  } catch (err) {
    console.log("Handle Submit Error");
    console.log(err);

    if (err.response) {
      console.log(err.response.data);
    }

    alert(err.response?.data?.message || "Payment Failed");
  }
};
return (
  <div className="min-h-screen flex bg-[#FFFBF7]">
    <Sidebar />

    <main className="flex-1 p-8">
      <h1 className="text-3xl font-bold mb-8">
        Place New Order
      </h1>

      <div className="grid xl:grid-cols-[1fr_380px] gap-6">
        <div className="space-y-6">

          <SenderDetails
            formData={formData}
            handleChange={handleChange}
          />

          <ReceiverDetails
            formData={formData}
            handleChange={handleChange}
          />

          <OrderDetails
            formData={formData}
            handleChange={handleChange}
            calculatePrice={calculatePrice}
          />

        </div>

        <PaymentCard
          formData={formData}
          handleChange={handleChange}
          price={price}
          loading={isPending}
          onSubmit={handleSubmit}
        />

      </div>
    </main>
  </div>
);
}