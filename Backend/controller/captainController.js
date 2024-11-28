const { validationResult } = require('express-validator');
const CaptainModel = require('../models/Captan');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const BlacklistToken = require('../models/BlacklitToken');

const registerCaptain = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { firstname, lastname, email, password, vehicle } = req.body;

      // Check for missing required fields
      if (
        !firstname ||
        !email ||
        !password ||
        !vehicle ||
        !vehicle.color ||
        !vehicle.plate ||
        !vehicle.capacity ||
        !vehicle.vehicleType
      ) {
        return res.status(400).json({
          message: 'Please provide all required fields',
          success: false,
        });
      }

      // Check if a captain with the same email already exists
      const existingCaptain = await CaptainModel.findOne({ email });
      if (existingCaptain) {
        return res.status(400).json({
          message: 'Captain already exists',
          success: false,
        });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new captain with the correct vehicle structure
      const newCaptain = new CaptainModel({
        firstname,
        lastname,
        email,
        password: hashedPassword,
        vehicle: {
          color: vehicle.color,
          plate: vehicle.plate,
          capacity: vehicle.capacity,
          vehicleType: vehicle.vehicleType,
        },
      });

      // Save the new captain to the database
      await newCaptain.save();

      return res
        .status(201)
        .json({ message: 'Captain Created Successfully', success: true });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: 'Error while registering captain', success: false });
    }
  };


const loginCaptain = async (req, res) => {
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

    const captain = await CaptainModel.findOne({ email });

    if (!captain) {
      return res
        .status(401)
        .json({ message: 'Captain not Found', success: false });
    }

    const isMatchedPassword = await bcrypt.compare(password, captain.password);

    if (!isMatchedPassword) {
      return res
        .status(401)
        .json({ message: 'Incorrect password', success: false });
    }

    // Use `user._id` for the token payload
    const token = jwt.sign({ _id: captain._id }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    res.cookie('token', token);

    return res.status(200).json({
      success: true,
      message: `Welcome back ${captain.firstname}`,
      token,
      captain,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: 'Error while logging in captain', success: false });
  }
};

const getCaptainProfile = async (req, res) => {
  try {
    res.status(200).json({ captain: req.captain });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: 'Error while getting captain profile', success: false });
  }
};

const logoutCaptain = async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    await BlacklistToken.create({ token });

    res.clearCookie('token');

    res.status(200).json({ message: 'Logout successfully', success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: 'Error while log out', success: false });
  }
};

module.exports = {
  registerCaptain,
  loginCaptain,
  getCaptainProfile,
  logoutCaptain,
};
