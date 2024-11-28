const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const BlacklistToken = require('../models/BlacklitToken');

const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { firstname, lastname, email, password } = req.body;

    if (!firstname || !email || !password) {
      return res.status(400).json({
        message: 'Please provide all required fields',
        success: false,
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'User already exists', success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return res
      .status(201)
      .json({ message: 'User Created Successfully', success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: 'Error while registering user', success: false });
  }
};

const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Please provide all required fields',
        success: false,
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ message: 'User not found', success: false });
    }

    const isMatchedPassword = await bcrypt.compare(password, user.password);

    if (!isMatchedPassword) {
      return res
        .status(401)
        .json({ message: 'Incorrect password', success: false });
    }

    // Use `user._id` for the token payload
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    res.cookie('token', token);

    return res.status(200).json({
      success: true,
      message: `Welcome back ${user.firstname}`,
      token,
      user,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: 'Error while logging in user', success: false });
  }
};

const getUserProfile = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: 'Error while fetching  user details', success: false });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization.split(' ')[1];

    await BlacklistToken.create({ token });

    res.status(200).json({ message: 'Logged out' });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: 'Error while log out', success: false });
  }
};

module.exports = { registerUser, loginUser, getUserProfile, logoutUser };
