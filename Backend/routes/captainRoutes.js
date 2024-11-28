const express = require('express');
const {
  registerCaptain,
  loginCaptain,
  getCaptainProfile,
  logoutCaptain,
} = require('../controller/captainController');
const { body } = require('express-validator');
const { authCaptain } = require('../middleware/authMiddleware');

const captainRouter = express.Router();

captainRouter.post(
  '/register',
  [
    body('email').isEmail().withMessage('Invalid Email'),
    body('firstname')
      .isLength({ min: 3 })
      .withMessage('First name must be at least 3 characters long'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('vehicle.color')
      .isLength({ min: 3 })
      .withMessage('Color must be at least 3 characters long'),
    body('vehicle.plate')
      .isLength({ min: 3 })
      .withMessage('Plate must be at least 3 characters long'),
    body('vehicle.capacity')
      .isInt({ min: 1 })
      .withMessage('Capacity must be at least 1'),
    body('vehicle.vehicleType')
      .isIn(['car', 'motorcycle', 'auto'])
      .withMessage('Invalid vehicle type'),
  ],
  registerCaptain
);

captainRouter.post(
  '/login',
  [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
  ],
  loginCaptain
);

captainRouter.get('/profile', authCaptain, getCaptainProfile);

captainRouter.get('/logout', authCaptain, logoutCaptain);

module.exports = captainRouter;
