const express = require('express');
const router = express.Router();
const { getAllReservations, adminUpdateReservation, adminCancelReservation } = require('../controllers/adminController');
const { verifyToken, requireAdmin } = require('../middleware/auth');
const { updateReservationValidators } = require('../validators/reservationValidators');
const validate = require('../middleware/validate');

router.use(verifyToken, requireAdmin);

router.get('/reservations', getAllReservations);
router.put('/reservations/:id', updateReservationValidators, validate, adminUpdateReservation);
router.delete('/reservations/:id', adminCancelReservation);

module.exports = router;
