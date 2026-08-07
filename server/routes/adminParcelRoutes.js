const express = require('express');
const router = express.Router();
const {authenticate , authorizeRoles}= require('../middleware/authMiddleware');
const {getAdminParcels, updateParcelStatus, assignAgent} = require('../controllers/adminParcelController');

router.get('/',authenticate, authorizeRoles("admin"), getAdminParcels);

router.put('/:id/status', authenticate, authorizeRoles("admin"), updateParcelStatus);
router.put('/:id/agent', authenticate, authorizeRoles("admin"), assignAgent);

module.exports = router;
