const Reservation = require('../models/Reservation');
const { updateReservation } = require('../services/reservationService');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/responseHelper');

const getAllReservations = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.date) {
      filter.reservationDate = req.query.date;
    }
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const reservations = await Reservation.find(filter)
      .populate('customer', 'name email')
      .populate('table', 'tableNumber seatingCapacity')
      .sort({ reservationDate: -1, reservationStartTime: -1 })
      .lean();

    return sendSuccess(res, 200, 'Reservations retrieved', reservations);
  } catch (err) {
    next(err);
  }
};

const adminUpdateReservation = async (req, res, next) => {
  try {
    const updated = await updateReservation(req.params.id, req.body);
    return sendSuccess(res, 200, 'Reservation updated successfully', updated);
  } catch (err) {
    next(err);
  }
};

const adminCancelReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return next(new AppError('Reservation not found.', 404));
    }

    if (reservation.status === 'cancelled') {
      return next(new AppError('Reservation is already cancelled.', 400));
    }

    reservation.status = 'cancelled';
    await reservation.save();

    return sendSuccess(res, 200, 'Reservation cancelled successfully', { id: reservation._id });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllReservations, adminUpdateReservation, adminCancelReservation };
