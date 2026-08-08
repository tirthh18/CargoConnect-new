const axios = require("axios");
const User = require("../models/User");
const Parcel = require("../models/Parcel");

async function getAgents(req, res) {
  try {
    const adminCity = req.user.office.city;

    const agents = await User.find({
      role: "agent",
      "office.city": adminCity,
    }).select("_id name");

    res.status(200).json({agents,});
  } catch (err) {
    console.error("Get Agents Error:", err);

    res.status(500).json({
      message: "Failed to fetch agents",
    });
  }
}

async function getAgentParcels(req, res) {
  try {
    const { agentId } = req.params;

    const parcels = await Parcel.find({
      $or: [
        {
          "pickup.agent": agentId,
          status: "out_for_pickup",
        },
        {
          "delivery.agent": agentId,
          status: "out_for_delivery",
        },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json({parcels,});
  } catch (err) {
    console.error("Get Agent Parcels Error:", err);

    res.status(500).json({
      message: "Failed to fetch agent parcels",
      error: err.message,
    });
  }
}

async function updateParcelStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, agentId } = req.body;
    const parcel = await Parcel.findById(id);

    if (!parcel) {
      return res.status(404).json({message: "Parcel not found",});
    }

    if (status !== "picked_up" && status !== "delivered") {
      return res.status(400).json({message: "Invalid status",});
    }

    if (status === "picked_up" &&parcel.status !== "out_for_pickup") {
      return res.status(400).json({message: "Parcel is not ready for pickup",});
    }

    if (status === "delivered" && parcel.status !== "out_for_delivery") {
      return res.status(400).json({message: "Parcel is not out for delivery",});
    }


    if (!Array.isArray(parcel.timeline)) {
      parcel.timeline = [];
    }

    parcel.status = status;

    parcel.timeline.push({
      status: status,
      timestamp: new Date(),
    });
    
    await parcel.save();

    console.log(
      "Parcel status successfully updated:",
      parcel.status
    );


    return res.status(200).json({
      success: true,
      message: "Status updated successfully",
      parcel,
    });
  } catch (err) {
    console.error(err);
 
    return res.status(500).json({
      success: false,
      message: "Failed to update status",
      error: err.message,
    });
  }
}


async function optimizeRoute(req, res) {
  try {
    const admin = await User.findById(req.user.id);

    if (!admin || !admin.office || !admin.office.coordinates) {
      return res.status(400).json({
        message: "Admin office location not found",
      });
    }

    const { agentId } = req.params;

    const parcels = await Parcel.find({
      $or: [
        {
          "pickup.agent": agentId,
          status: "out_for_pickup",
        },
        {
          "delivery.agent": agentId,
          status: "out_for_delivery",
        },
      ],
    });

    if (!parcels.length) {
      return res.status(200).json({
        message: "No active parcels",
        route: [],
        geometry: [],
        distance: 0,
        estimatedTime: 0,
      });
    }


    const locations = [];

    locations.push({
      type: "office-start",
      lat: admin.office.coordinates.lat,
      lng: admin.office.coordinates.lng,
    });

    parcels.forEach((parcel) => {
      const point =parcel.status === "out_for_pickup"? parcel.pickup: parcel.delivery;

      locations.push({
        type: "parcel",
        parcelId: parcel._id.toString(),
        lat: point.coordinates.lat,
        lng: point.coordinates.lng,
      });
    });


    const coordinates = locations
      .map((point) =>`${point.lng},${point.lat}`)
      .join(";");

    const response = await axios.get(
      `https://router.project-osrm.org/trip/v1/driving/${coordinates}`,
      {
        params: {
          source: "first",
          roundtrip: true,
          geometries: "geojson",
          overview: "full",
          steps: false,
        },
      }
    );

    if (
      !response.data.trips ||
      response.data.trips.length === 0
    ) {
      return res.status(400).json({
        message: "Unable to optimize route",
      });
    }

    const trip = response.data.trips[0];
    const waypoints = response.data.waypoints;
    const parcelMap = new Map();

    parcels.forEach((parcel) => {
      parcelMap.set(parcel._id.toString(), parcel);
    });

    const orderedWaypoints = waypoints
      .map((waypoint, originalIndex) => ({...waypoint,originalIndex,}))
      .sort((a, b) =>a.waypoint_index -b.waypoint_index);

    const optimizedRoute = [];

    for (let i = 1; i < orderedWaypoints.length; i++) {
      const location =locations[orderedWaypoints[i].originalIndex];

      if (!location?.parcelId) {
        continue;
      }

      const parcel = parcelMap.get(location.parcelId);

      if (parcel) {
        optimizedRoute.push(parcel);
      }
    }

    const geometry =trip.geometry.coordinates.map(([lng, lat]) => ({lat,lng,}));

    return res.status(200).json({
      route: optimizedRoute,
      distance: Number(
        (trip.distance / 1000).toFixed(2)
      ),
      estimatedTime: Math.ceil(
        trip.duration / 60
      ),
      geometry,
      office: admin.office.coordinates,
    });
  } catch (err) {
    console.error("Optimize Route Error:");

    console.error(err.response?.data || err);

    return res.status(500).json({
      message: "Failed to optimize route",
      error: err.message,
    });
  }
}

module.exports = {
  getAgents,
  getAgentParcels,
  updateParcelStatus,
  optimizeRoute,
};