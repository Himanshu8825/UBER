const mongoose = require('mongoose');

const captainSchema = new mongoose.Schema(
  {
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
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'inactive',
    },
    vehicle: {
      color: {
        type: String,
        required: true,
        minlength: [3, 'Color must be at least 3 characters long'],
      },
      plate: {
        type: String,
        required: true,
        minlength: [3, 'Plate must be at least  characters long'],
      },
      capacity: {
        type: Number,
        required: true,
        min: [1, 'Capacity must be at least 1'],
      },
      vehicleType: {
        type: String,
        required: true,
        enum: ['car', 'motorcycle', 'auto'],
      },
    },

    location: {
      lat: {
        type: Number,
      },
      long: {
        type: Number,
      },
    },
  },
  { timestamps: true }
);

const CaptainModel = mongoose.model('Captain', captainSchema);

module.exports = CaptainModel;
