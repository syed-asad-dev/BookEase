const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('../backend/utils/db');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Ensure DB connection before processing requests cache pattern
app.use(async (req, res, next) => {
  if (process.env.MONGODB_URI) {
    await connectDB();
  }
  next();
});

// Import Routes
const authRoutes = require('../backend/routes/auth');
const servicesRoutes = require('../backend/routes/services');
const staffRoutes = require('../backend/routes/staff');
const appointmentsRoutes = require('../backend/routes/appointments');
const availabilityRoutes = require('../backend/routes/availability');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/availability', availabilityRoutes);

// Base Route
app.get('/api', (req, res) => {
  res.json({ message: 'BookEase API is running.' });
});

module.exports = app;
