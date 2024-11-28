require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./DB/db');
const authRouter = require('./routes/authRoputes');
const captainRouter = require('./routes/captainRoutes');


const app = express();

//! Database Configuration
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//! Routes

// auth routes
app.use('/auth', authRouter);
app.use('/captain' , captainRouter);

app.get('/', (req, res) => {
  res.send('Welcome to the server');
});

module.exports = app;
