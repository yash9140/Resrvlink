const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Customer is required'],
    },
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Table',
      required: [true, 'Table is required'],
    },
    reservationDate: {
      type: String,
      required: [true, 'Reservation date is required'],
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'],
    },
    reservationStartTime: {
      type: String,
      required: [true, 'Start time is required'],
      match: [/^\d{2}:\d{2}$/, 'Start time must be in HH:MM format'],
    },
    reservationEndTime: {
      type: String,
      required: [true, 'End time is required'],
      match: [/^\d{2}:\d{2}$/, 'End time must be in HH:MM format'],
    },
    guestCount: {
      type: Number,
      required: [true, 'Guest count is required'],
      min: [1, 'Guest count must be at least 1'],
      max: [50, 'Guest count cannot exceed 50'],
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed',
    },
    specialRequests: {
      type: String,
      trim: true,
      maxlength: [300, 'Special requests cannot exceed 300 characters'],
    },
  },
  { timestamps: true }
);

reservationSchema.index({ reservationDate: 1, table: 1, status: 1 });

const Reservation = mongoose.model('Reservation', reservationSchema);
module.exports = Reservation;
