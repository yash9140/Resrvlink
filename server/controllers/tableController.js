const Table = require('../models/Table');
const Reservation = require('../models/Reservation');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/responseHelper');

const getAllTables = async (req, res, next) => {
  try {
    const tables = await Table.find().sort({ tableNumber: 1 }).lean();
    return sendSuccess(res, 200, 'Tables retrieved', tables);
  } catch (err) {
    next(err);
  }
};

const createTable = async (req, res, next) => {
  try {
    const { tableNumber, seatingCapacity, active } = req.body;

    const exists = await Table.findOne({ tableNumber });
    if (exists) {
      return next(new AppError(`Table number ${tableNumber} already exists.`, 409));
    }

    const table = await Table.create({ tableNumber, seatingCapacity, active });
    return sendSuccess(res, 201, 'Table created successfully', table);
  } catch (err) {
    next(err);
  }
};

const updateTable = async (req, res, next) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) {
      return next(new AppError('Table not found.', 404));
    }

    if (req.body.tableNumber && req.body.tableNumber !== table.tableNumber) {
      const exists = await Table.findOne({ tableNumber: req.body.tableNumber });
      if (exists) {
        return next(new AppError(`Table number ${req.body.tableNumber} already exists.`, 409));
      }
    }

    Object.assign(table, req.body);
    await table.save();

    return sendSuccess(res, 200, 'Table updated successfully', table);
  } catch (err) {
    next(err);
  }
};

const deleteTable = async (req, res, next) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) {
      return next(new AppError('Table not found.', 404));
    }

    const activeReservation = await Reservation.findOne({
      table: req.params.id,
      status: 'confirmed',
      reservationDate: { $gte: new Date().toISOString().split('T')[0] },
    });

    if (activeReservation) {
      return next(
        new AppError(
          'Cannot delete a table with upcoming confirmed reservations. Cancel them first.',
          409
        )
      );
    }

    await Table.findByIdAndDelete(req.params.id);
    return sendSuccess(res, 200, 'Table deleted successfully', { id: req.params.id });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllTables, createTable, updateTable, deleteTable };
