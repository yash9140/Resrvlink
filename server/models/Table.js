const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema(
  {
    tableNumber: {
      type: Number,
      required: [true, 'Table number is required'],
      unique: true,
      min: [1, 'Table number must be positive'],
    },
    seatingCapacity: {
      type: Number,
      required: [true, 'Seating capacity is required'],
      min: [1, 'Seating capacity must be at least 1'],
      max: [50, 'Seating capacity cannot exceed 50'],
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Table = mongoose.model('Table', tableSchema);
module.exports = Table;
