const express = require('express');
const { body } = require('express-validator');
const contactController = require('../controllers/contactController');

const router = express.Router();

const contactValidation = [
  body('name').trim().notEmpty().withMessage('Name is required.'),
  body('email').isEmail().withMessage('Provide a valid email address.'),
  body('subject').optional({ values: 'falsy' }).trim(),
  body('message').trim().notEmpty().withMessage('Message is required.'),
];

router.post('/', contactValidation, contactController.submitContactForm);

module.exports = router;
