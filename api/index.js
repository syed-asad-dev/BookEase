const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('../backend/utils/db');
const bcrypt = require('bcryptjs');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Ensure DB connection before processing requests
app.use(async (req, res, next) => {
  if (process.env.MONGODB_URI) {
    await connectDB();
    // Auto-create admin user if none exists
    try {
      const User = require('../backend/models/User');
      const adminExists = await User.findOne({ username: 'admin' });
      if (!adminExists) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Admin@123', salt);
        await User.create({
          username: 'admin',
          password: hashedPassword,
          role: 'admin'
        });
        console.log('Auto-created default admin user');
      }
    } catch (err) {
      // Silently ignore — admin may already exist
    }
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
