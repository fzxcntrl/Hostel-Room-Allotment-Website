const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');

const router = express.Router();

const registerValidation = [
  body('fullName').notEmpty().withMessage('Full name is required.'),
  body('email').isEmail().withMessage('Provide a valid email.'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long.'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Provide a valid email.'),
  body('password').notEmpty().withMessage('Password is required.'),
];

router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);

module.exports = router;
