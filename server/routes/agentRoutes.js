const express = require('express');
const router = express.Router();
const {authenticate , authorizeRoles}= require('../middleware/authMiddleware');
const { getAgents, getAgentParcels, updateParcelStatus, optimizeRoute} = require('../controllers/agentController');

router.get('/',authenticate, authorizeRoles("admin"), getAgents);
router.get('/:agentId/parcels', authenticate, authorizeRoles("admin"), getAgentParcels);
router.get("/:agentId/route", authenticate, authorizeRoles("admin"), optimizeRoute);

router.put("/parcels/:id/status", authenticate, authorizeRoles("admin"), updateParcelStatus);

module.exports = router;
