const { body } = require('express-validator');

const createTableValidators = [
  body('tableNumber')
    .notEmpty().withMessage('Table number is required')
    .isInt({ min: 1 }).withMessage('Table number must be a positive integer'),

  body('seatingCapacity')
    .notEmpty().withMessage('Seating capacity is required')
    .isInt({ min: 1, max: 50 }).withMessage('Seating capacity must be between 1 and 50'),

  body('active')
    .optional()
    .isBoolean().withMessage('Active must be a boolean'),
];

const updateTableValidators = [
  body('tableNumber')
    .optional()
    .isInt({ min: 1 }).withMessage('Table number must be a positive integer'),

  body('seatingCapacity')
    .optional()
    .isInt({ min: 1, max: 50 }).withMessage('Seating capacity must be between 1 and 50'),

  body('active')
    .optional()
    .isBoolean().withMessage('Active must be a boolean'),
];

module.exports = { createTableValidators, updateTableValidators };
