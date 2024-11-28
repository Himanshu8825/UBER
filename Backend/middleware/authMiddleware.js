
const jwt = require('jsonwebtoken');
const BlacklistToken = require('../models/BlacklitToken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: 'No token, authorization denied', success: false });
  }

  const isBlacklisted = await BlacklistToken.findOne({ toke: token });

  if (isBlacklisted) {
    return res
      .status(401)
      .json({ message: 'Token is blacklisted', success: false });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decode._id);

    req.user = user;

    return next();
  } catch (error) {
    return res.status(500).json({ message: 'Unauthorized', success: false });
  }
};

module.exports = {authMiddleware};
