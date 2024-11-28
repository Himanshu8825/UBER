const express = require('express');

const authRouter = express.Router();
const { body } = require('express-validator');
const { registerUser, loginUser, getUserProfile, logoutUser } = require('../controller/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

authRouter.post(
    '/register',
    [
      body('firstname')
        .isLength({ min: 3 })
        .withMessage('First name must be at least 3 characters long'),
      body('lastname')
        .optional()
        .isLength({ min: 3 })
        .withMessage('Last name must be at least 3 characters long'),
      body('email').isEmail().withMessage('Invalid Email'),
      body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    ],
    registerUser
  );


authRouter.post(
  '/login',
  [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password')
      .isLength({ min: 4 })
      .withMessage('Password must be at least 4 characters long'),
  ],
  loginUser
);


authRouter.get('/profile' , authMiddleware , getUserProfile);

authRouter.get('/logout' , authMiddleware , logoutUser);

module.exports = authRouter;
