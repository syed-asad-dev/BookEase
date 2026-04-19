const express = require('express');
const router = express.Router();
const Staff = require('../models/Staff');
const { protect } = require('../utils/authMiddleware');

// Get all staff
router.get('/', async (req, res) => {
  try {
    const staff = await Staff.find({});
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Create staff
router.post('/', protect, async (req, res) => {
  try {
    const newStaff = new Staff({
      staffId: `STF-${Date.now()}`,
      ...req.body
    });
    const savedStaff = await newStaff.save();
    res.status(201).json(savedStaff);
  } catch (error) {
    res.status(400).json({ message: 'Error creating staff', error });
  }
});

// Update staff
router.put('/:id', protect, async (req, res) => {
  try {
    const updatedStaff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedStaff);
  } catch (error) {
    res.status(400).json({ message: 'Error updating staff' });
  }
});

// Delete staff
router.delete('/:id', protect, async (req, res) => {
  try {
    await Staff.findByIdAndDelete(req.params.id);
    res.json({ message: 'Staff removed' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting staff' });
  }
});

module.exports = router;
