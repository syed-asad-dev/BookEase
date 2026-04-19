const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const { protect } = require('../utils/authMiddleware');

// Get all appointments
router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find({}).populate('service').populate('staff');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get single appointment
router.get('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate('service').populate('staff');
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Create appointment (Public)
router.post('/', async (req, res) => {
  try {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let p1 = '';
    for (let i = 0; i < 6; i++) p1 += chars.charAt(Math.floor(Math.random() * chars.length));
    
    const newAppointment = new Appointment({
      bookingRef: `BK-${p1}`,
      ...req.body
    });
    const savedAppointment = await newAppointment.save();
    res.status(201).json(savedAppointment);
  } catch (error) {
    res.status(400).json({ message: 'Error creating appointment', error });
  }
});

// Update appointment status (Admin)
router.patch('/:id', protect, async (req, res) => {
  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status }, 
      { new: true }
    ).populate('service').populate('staff');
    res.json(updatedAppointment);
  } catch (error) {
    res.status(400).json({ message: 'Error updating appointment' });
  }
});

// Delete appointment (Admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Appointment deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting appointment' });
  }
});

module.exports = router;
