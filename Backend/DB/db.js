const mongoose = require('mongoose');

const mongoDb = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    await mongoose
      .connect(mongoDb)
      .then(console.log('Mongodb connection established'))
      .catch((err) => console.error(err));
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error}`);
  }
};

module.exports = connectDB;
