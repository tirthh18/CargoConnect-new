const Parcel = require("../models/Parcel");
const calculatePrice = require("../utils/calculatePrice");
const generateTrackingNumber = require("../utils/generateTrackingNumber");
const updateStatus = require("../utils/updateStatus");

async function createParcel(req, res) {
  try {
    const {
      priority,
      senderName,
      pickupAddress,
      pickupCity,
      pickupPincode,
      pickupCoordinates,
      senderMobile,
      receiverName,
      dropAddress,
      dropCity,
      dropPincode,
      dropCoordinates,
      receiverMobile,
      deliveryType,
      weight,
      selectedDate,
      paymentMethod,
      paymentStatus,
    } = req.body;

    const totalPrice = calculatePrice(deliveryType, weight, priority);

    if (!pickupCoordinates || !dropCoordinates) {
      return res.status(400).json({
        message: "please select valid pickup or delivery address.",
      });
    }

    const newParcel = new Parcel({
      trackingNumber: generateTrackingNumber(),
      userId: req.user.id,
      userName: req.user.name,
      status: "pending",

      pickup: {
        name: senderName,
        mobile: senderMobile,
        address: pickupAddress,
        city: pickupCity,
        pincode: pickupPincode,
        coordinates: pickupCoordinates,
      },

      delivery: {
        name: receiverName,
        mobile: receiverMobile,
        address: dropAddress,
        city: dropCity,
        pincode: dropPincode,
        coordinates: dropCoordinates,
      },

      parcelDetails: {
        priority,
        deliveryType,
        weight,
        scheduleDate: selectedDate,
        paymentMethod,
        totalPrice,
        paymentStatus,
      },

      timeline: [
        {
          status: "order_placed",
          timestamp: Date.now(),
        },
      ],
    });

    await newParcel.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      parcel: newParcel,
    });
  } catch (error) {
    console.error("Error creating parcel:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create parcel order",
      error: error.message,
    });
  }
}

async function getUserParcels(req, res) {
  try {
    const userId = req.user.id;

    /*
     * Populate both possible agent fields.
     *
     * pickup.agent  -> Pickup Agent
     * delivery.agent -> Delivery Agent
     *
     * The database stores only the User ObjectId.
     * populate() gets the actual User document.
     */

    const parcels = await Parcel.find({ userId })
      .populate("pickup.agent", "name email")
      .populate("delivery.agent", "name email")
      .sort({ createdAt: -1 });

    const totalOrders = parcels.length;

    const currentOrders = parcels.filter(
      (p) => p.status !== "delivered" && p.status !== "cancelled",
    ).length;

    const deliveredOrders = parcels.filter(
      (p) => p.status === "delivered",
    ).length;

    const cancelledOrders = parcels.filter(
      (p) => p.status === "cancelled",
    ).length;

    const totalSpent = parcels
      .filter((p) => p.status !== "cancelled")
      .reduce((sum, p) => sum + p.parcelDetails.totalPrice, 0);

    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(0, i).toLocaleString("default", {
        month: "short",
      }),
      orders: 0,
    }));

    parcels.forEach((p) => {
      const month = new Date(p.createdAt).getMonth();

      monthlyData[month].orders++;
    });

    res.json({
      totalOrders,
      currentOrders,
      cancelledOrders,
      deliveredOrders,
      totalSpent,
      monthlyData,
      parcels,
    });
  } catch (err) {
    console.error("Get User Parcels Error:", err);

    res.status(500).json({
      message: "Server error",
    });
  }
}

async function cancelparcel(req, res) {
  try {
    const parcel = await Parcel.findById(req.params.id);

    if (!parcel) {
      return res.status(404).json({
        message: "Parcel not found",
      });
    }

    if (parcel.status !== "pending") {
      return res.status(400).json({
        message: "Cannot cancel a parcel after pickup",
      });
    }

    updateStatus(parcel, "cancelled");

    res.status(200).json({
      message: "Parcel cancelled",
      parcel,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
}

module.exports = {
  createParcel,
  getUserParcels,
  cancelparcel,
};
