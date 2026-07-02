const mongoose = require('mongoose');
const Table = require('../models/Table');
const Reservation = require('../models/Reservation');
const AppError = require('../utils/AppError');

/**
 * Checks whether two time intervals overlap.
 * Times are HH:MM strings compared lexicographically (valid since format is fixed-width).
 */
const timesOverlap = (existStart, existEnd, newStart, newEnd) => {
  return existStart < newEnd && existEnd > newStart;
};

/**
 * Finds all confirmed reservations for a specific table on a given date
 * that overlap with the requested time window.
 */
const findConflicts = async (tableId, date, startTime, endTime, session, excludeId = null) => {
  const query = {
    table: tableId,
    reservationDate: date,
    status: 'confirmed',
  };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  const existing = await Reservation.find(query).session(session).lean();

  return existing.filter((r) =>
    timesOverlap(r.reservationStartTime, r.reservationEndTime, startTime, endTime)
  );
};

/**
 * Core allocation logic:
 * 1. Find all active tables with capacity >= guestCount, sorted ascending by capacity (smallest fit).
 * 2. For each candidate table, check for time overlaps within a MongoDB transaction.
 * 3. Assign the first available table.
 * 4. Create and return the reservation document.
 */
const allocateAndCreateReservation = async ({ customerId, date, startTime, endTime, guestCount, specialRequests }) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const candidateTables = await Table.find({
      seatingCapacity: { $gte: guestCount },
      active: true,
    })
      .sort({ seatingCapacity: 1 })
      .session(session)
      .lean();

    if (candidateTables.length === 0) {
      throw new AppError(
        'No tables are available with sufficient capacity for your party size.',
        422
      );
    }

    let assignedTable = null;

    for (const table of candidateTables) {
      const conflicts = await findConflicts(table._id, date, startTime, endTime, session);
      if (conflicts.length === 0) {
        assignedTable = table;
        break;
      }
    }

    if (!assignedTable) {
      throw new AppError(
        'No available tables for the requested date and time. Please choose a different time slot.',
        409
      );
    }

    const reservation = new Reservation({
      customer: customerId,
      table: assignedTable._id,
      reservationDate: date,
      reservationStartTime: startTime,
      reservationEndTime: endTime,
      guestCount,
      specialRequests: specialRequests || undefined,
      status: 'confirmed',
    });

    await reservation.save({ session });
    await session.commitTransaction();

    const populated = await Reservation.findById(reservation._id)
      .populate('table', 'tableNumber seatingCapacity')
      .populate('customer', 'name email')
      .lean();

    return populated;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

/**
 * Admin update: re-run allocation if date/time/guestCount changes.
 * If only status changes, skip reallocation.
 */
const updateReservation = async (reservationId, updateData) => {
  const reservation = await Reservation.findById(reservationId);
  if (!reservation) {
    throw new AppError('Reservation not found', 404);
  }

  const { reservationDate, reservationStartTime, reservationEndTime, guestCount, status } = updateData;

  if (status === 'cancelled') {
    reservation.status = 'cancelled';
    await reservation.save();
    return Reservation.findById(reservationId)
      .populate('table', 'tableNumber seatingCapacity')
      .populate('customer', 'name email')
      .lean();
  }

  const needsReallocation =
    (reservationDate && reservationDate !== reservation.reservationDate) ||
    (reservationStartTime && reservationStartTime !== reservation.reservationStartTime) ||
    (reservationEndTime && reservationEndTime !== reservation.reservationEndTime) ||
    (guestCount && guestCount !== reservation.guestCount);

  if (!needsReallocation) {
    Object.assign(reservation, updateData);
    await reservation.save();
    return Reservation.findById(reservationId)
      .populate('table', 'tableNumber seatingCapacity')
      .populate('customer', 'name email')
      .lean();
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const newDate = reservationDate || reservation.reservationDate;
    const newStart = reservationStartTime || reservation.reservationStartTime;
    const newEnd = reservationEndTime || reservation.reservationEndTime;
    const newCount = guestCount || reservation.guestCount;

    const candidateTables = await Table.find({
      seatingCapacity: { $gte: newCount },
      active: true,
    })
      .sort({ seatingCapacity: 1 })
      .session(session)
      .lean();

    if (candidateTables.length === 0) {
      throw new AppError('No tables available with sufficient capacity.', 422);
    }

    let assignedTable = null;

    for (const table of candidateTables) {
      const conflicts = await findConflicts(
        table._id,
        newDate,
        newStart,
        newEnd,
        session,
        reservationId
      );
      if (conflicts.length === 0) {
        assignedTable = table;
        break;
      }
    }

    if (!assignedTable) {
      throw new AppError(
        'No available tables for the updated date and time. Please choose a different slot.',
        409
      );
    }

    reservation.table = assignedTable._id;
    reservation.reservationDate = newDate;
    reservation.reservationStartTime = newStart;
    reservation.reservationEndTime = newEnd;
    reservation.guestCount = newCount;

    await reservation.save({ session });
    await session.commitTransaction();

    return Reservation.findById(reservationId)
      .populate('table', 'tableNumber seatingCapacity')
      .populate('customer', 'name email')
      .lean();
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

module.exports = { allocateAndCreateReservation, updateReservation };
