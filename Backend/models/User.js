const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    minlength: [3, 'First Name must be at least 3 characters'],
  },
  lastname: {
    type: String,
    minlength: [3, 'Last Name must be at least 3 characters'],
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  socketId: {
    type: String,
  },
},  { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
