const mongoose = require("mongoose");
const Coordinates = require('./Coordinates')


const timelineSchema = new mongoose.Schema(
  {
    status: String,
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false },
);

const parcelSchema = new mongoose.Schema(
  {
    trackingNumber: { type: String, required: true, unique: true },
    userId: {type: mongoose.Schema.Types.ObjectId,ref: "User",required: true},
    userName: { type: String, required: true },
    status: {
      type: String,
      enum: [
        "pending",
        "out_for_pickup",
        "picked_up",
        "in_transit",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },

    pickup: {
      name: { type: String, required: true },
      mobile: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      pincode: { type: String, required: true },
      coordinates: Coordinates,
      agent: {type: mongoose.Schema.Types.ObjectId,ref: "User", default: null},

    },
    delivery: {
      name: { type: String, required: true },
      mobile: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      pincode: { type: String, required: true },
      coordinates: Coordinates,
      agent: {type: mongoose.Schema.Types.ObjectId,ref: "User", default: null}
    },
    parcelDetails: {
      priority: { type: String, enum: ["low", "high"], default: "low" },
      deliveryType: {
        type: String,
        enum: ["local", "intercity"],
        required: true,
      },
      weight: { type: Number, required: true },
      scheduleDate: { type: Date, required: true },
      paymentMethod: { type: String, enum: ["cash", "upi"], required: true },
      upiId: { type: String },
      totalPrice: { type: Number, required: true },
      paymentStatus: {
        type: String,
        enum: ["pending", "processing", "completed", "failed"],
        default: "pending",
      },
    },
    //    currentLocation: {
    //    coordinates: coordinatesSchema,
    //      updatedAt: {type: Date, default: Date.now},
    //    },
    timeline: [timelineSchema],
    //    estimatedDelivery: {type: Date,},
    // assignedDeliveryAgent: { type: String, default: null },
  },
   { timestamps: true }
);

module.exports = mongoose.model("Parcel", parcelSchema);
