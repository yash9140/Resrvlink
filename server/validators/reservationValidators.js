const { body } = require('express-validator');

const createReservationValidators = [
  body('reservationDate')
    .notEmpty().withMessage('Reservation date is required')
    .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Date must be in YYYY-MM-DD format')
    .custom((value) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const resDate = new Date(value);
      if (isNaN(resDate.getTime())) throw new Error('Invalid date');
      if (resDate < today) throw new Error('Reservation date cannot be in the past');
      return true;
    }),

  body('reservationStartTime')
    .notEmpty().withMessage('Start time is required')
    .matches(/^\d{2}:\d{2}$/).withMessage('Start time must be in HH:MM format'),

  body('reservationEndTime')
    .notEmpty().withMessage('End time is required')
    .matches(/^\d{2}:\d{2}$/).withMessage('End time must be in HH:MM format')
    .custom((endTime, { req }) => {
      const start = req.body.reservationStartTime;
      if (start && endTime <= start) {
        throw new Error('End time must be after start time');
      }
      return true;
    }),

  body('guestCount')
    .notEmpty().withMessage('Guest count is required')
    .isInt({ min: 1, max: 50 }).withMessage('Guest count must be between 1 and 50'),

  body('specialRequests')
    .optional()
    .isLength({ max: 300 }).withMessage('Special requests cannot exceed 300 characters'),
];

const updateReservationValidators = [
  body('reservationDate')
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Date must be in YYYY-MM-DD format')
    .custom((value) => {
      if (value) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const resDate = new Date(value);
        if (isNaN(resDate.getTime())) throw new Error('Invalid date');
        if (resDate < today) throw new Error('Reservation date cannot be in the past');
      }
      return true;
    }),

  body('reservationStartTime')
    .optional()
    .matches(/^\d{2}:\d{2}$/).withMessage('Start time must be in HH:MM format'),

  body('reservationEndTime')
    .optional()
    .matches(/^\d{2}:\d{2}$/).withMessage('End time must be in HH:MM format'),

  body('guestCount')
    .optional()
    .isInt({ min: 1, max: 50 }).withMessage('Guest count must be between 1 and 50'),

  body('status')
    .optional()
    .isIn(['confirmed', 'cancelled']).withMessage('Status must be confirmed or cancelled'),
];

module.exports = { createReservationValidators, updateReservationValidators };
