const express = require("express");

const router = express.Router();

const {
  authenticate,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const {
  getAgents,
  getAgentParcels,
  updateParcelStatus,
  optimizeRoute,
} = require("../controllers/agentController");

// ======================================================
// GET AGENTS
// ======================================================

router.get(
  "/",
  authenticate,
  authorizeRoles("admin"),
  getAgents
);

// ======================================================
// GET AGENT PARCELS
// ======================================================

router.get(
  "/:agentId/parcels",
  authenticate,
  authorizeRoles("admin"),
  getAgentParcels
);

// ======================================================
// GET OPTIMIZED ROUTE
// ======================================================

router.get(
  "/:agentId/route",
  authenticate,
  authorizeRoles("admin"),
  optimizeRoute
);

// ======================================================
// UPDATE PARCEL STATUS
// ======================================================

router.put(
  "/parcels/:id/status",
  authenticate,
  authorizeRoles("admin"),
  updateParcelStatus
);

module.exports = router;