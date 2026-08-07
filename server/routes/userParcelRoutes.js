const express = require('express');
const router = express.Router();
const {authenticate , authorizeRoles}= require('../middleware/authMiddleware');
const { createParcel, getUserParcels, cancelparcel} = require('../controllers/userParcelController');

router.get('/',authenticate, authorizeRoles("user"), getUserParcels);

router.post('/create',authenticate, authorizeRoles("user"), createParcel);

router.put('/:id/cancel', authenticate, authorizeRoles("user"), cancelparcel);

module.exports = router;
