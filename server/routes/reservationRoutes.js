const express = require('express');
const router = express.Router();
const { createReservation, getMyReservations, cancelReservation } = require('../controllers/reservationController');
const { verifyToken } = require('../middleware/auth');
const { createReservationValidators } = require('../validators/reservationValidators');
const validate = require('../middleware/validate');

router.use(verifyToken);

router.post('/', createReservationValidators, validate, createReservation);
router.get('/my', getMyReservations);
router.delete('/:id', cancelReservation);

module.exports = router;
