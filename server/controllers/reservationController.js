const Reservation = require('../models/Reservation');
const { allocateAndCreateReservation } = require('../services/reservationService');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/responseHelper');

const createReservation = async (req, res, next) => {
  try {
    const { reservationDate, reservationStartTime, reservationEndTime, guestCount, specialRequests } =
      req.body;

    const reservation = await allocateAndCreateReservation({
      customerId: req.user.id,
      date: reservationDate,
      startTime: reservationStartTime,
      endTime: reservationEndTime,
      guestCount: Number(guestCount),
      specialRequests,
    });

    return sendSuccess(res, 201, 'Reservation created successfully', reservation);
  } catch (err) {
    next(err);
  }
};

const getMyReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find({ customer: req.user.id })
      .populate('table', 'tableNumber seatingCapacity')
      .sort({ reservationDate: -1, reservationStartTime: -1 })
      .lean();

    return sendSuccess(res, 200, 'Reservations retrieved', reservations);
  } catch (err) {
    next(err);
  }
};

const cancelReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findOne({
      _id: req.params.id,
      customer: req.user.id,
    });

    if (!reservation) {
      return next(new AppError('Reservation not found or not authorized.', 404));
    }

    if (reservation.status === 'cancelled') {
      return next(new AppError('Reservation is already cancelled.', 400));
    }

    const reservationDateTime = new Date(
      `${reservation.reservationDate}T${reservation.reservationStartTime}:00`
    );
    if (reservationDateTime <= new Date()) {
      return next(new AppError('Cannot cancel a past or ongoing reservation.', 400));
    }

    reservation.status = 'cancelled';
    await reservation.save();

    return sendSuccess(res, 200, 'Reservation cancelled successfully', { id: reservation._id });
  } catch (err) {
    next(err);
  }
};

module.exports = { createReservation, getMyReservations, cancelReservation };
