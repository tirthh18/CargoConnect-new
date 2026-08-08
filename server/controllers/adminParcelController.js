const Parcel = require("../models/Parcel");
const updateStatus = require("../utils/updateStatus");
const User = require("../models/User")
// const User = require("../models/User");
// const axios = require("axios");
const { json } = require("express");


async function getAdminParcels(req, res) {
  try {
    const adminCity = req.user.office.city;

    const pickupParcels = await Parcel
    .find({"pickup.city": adminCity}).populate("pickup.agent", "name")
    .sort({ createdAt: -1 });

    const deliveryParcels = await Parcel
    .find({"delivery.city": adminCity, status: {$in: ["in_transit", "out_for_delivery"]},})
    .populate("delivery.agent", "name")
    .sort({ createdAt: -1 });


    const pickupParcelCount = pickupParcels.filter((parcel) => ["pending", "out_for_pickup"].includes(parcel.status)).length;
    const deliveryParcelCount = deliveryParcels.length;

    const activeParcelCount =
      pickupParcelCount + deliveryParcelCount;

    res.json({
      activeParcelCount,
      pickupParcelCount,
      deliveryParcelCount,

      pickupParcels,
      deliveryParcels,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to fetch parcels",
    });
  }
}



async function updateParcelStatus(req, res) {
  try {
    const parcel = await Parcel.findById(req.params.id);
    if (!parcel) return res.status(404).json({ message: "Parcel not found" });

    const { status } = req.body;
    updateStatus(parcel, status);

    res.json({ message: "Status updated", parcel });
  } catch (error) {
    console.error("Status Update Error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

async function assignAgent(req, res) {
  try {
    const { id } = req.params;      // Parcel ID from URL
    const { agentId } = req.body;   // Agent ID from request body

    if (!id || !agentId) {
      return res.status(400).json({
        message: "Parcel ID and Agent ID are required",
      });
    }

    const parcel = await Parcel.findById(id);

    if (!parcel) {
      return res.status(404).json({
        message: "Parcel not found",
      });
    }

    const agent = await User.findById(agentId);

    if (!agent) {
      return res.status(404).json({
        message: "Agent not found",
      });
    }

    if (parcel.status === "pending") {
      parcel.pickup.agent = agent._id;
      parcel.status = "out_for_pickup";
    } else if (parcel.status === "in_transit") {
      parcel.delivery.agent = agent._id;
      parcel.status = "out_for_delivery";
    } else {
      return res.status(400).json({
        message: "Cannot assign agent at this parcel status",
      });
    }

    await parcel.save();

    res.json({
      message: "Agent assigned successfully",
      parcel,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
}


module.exports = {
  getAdminParcels,
  updateParcelStatus,
  assignAgent,
};
