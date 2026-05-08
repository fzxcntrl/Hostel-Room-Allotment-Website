const express = require('express');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const contactController = require('../controllers/contactController');

const router = express.Router();

// Basic rate limiter to prevent spam: max 5 requests per 15 minutes
const contactRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: { success: false, message: 'Too many contact requests submitted. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const contactValidation = [
  body('name').trim().notEmpty().withMessage('Name is required.'),
  body('email').isEmail().withMessage('Provide a valid email address.'),
  body('subject').optional({ values: 'falsy' }).trim(),
  body('message').trim().notEmpty().withMessage('Message is required.'),
];

router.post('/', contactRateLimiter, contactValidation, contactController.submitContactForm);

module.exports = router;
