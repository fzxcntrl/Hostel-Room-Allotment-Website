const express = require('express');
const { body, param } = require('express-validator');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

const bookingValidation = [
  body('roomId').notEmpty().withMessage('roomId is required.'),
  body('userId').notEmpty().withMessage('userId is required.'),
  body('checkIn').isISO8601().withMessage('Provide a valid check-in date.'),
  body('checkOut').isISO8601().withMessage('Provide a valid check-out date.'),
  body('guests').isInt({ min: 1 }).withMessage('Guests must be at least 1.'),
];

router.get('/', bookingController.getBookings);
router.post('/', bookingValidation, bookingController.createBooking);
router.get('/user/:userId', [param('userId').notEmpty().withMessage('Invalid user id.')], bookingController.getUserBookings);
router.patch(
  '/:bookingId/cancel',
  [param('bookingId').notEmpty().withMessage('Invalid booking id.')],
  bookingController.cancelBooking
);

module.exports = router;
