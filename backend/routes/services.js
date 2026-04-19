const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const { protect } = require('../utils/authMiddleware');

// Get all services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find({});
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Create service
router.post('/', protect, async (req, res) => {
  try {
    const newService = new Service({
      serviceId: `SRV-${Date.now()}`,
      ...req.body
    });
    const savedService = await newService.save();
    res.status(201).json(savedService);
  } catch (error) {
    res.status(400).json({ message: 'Error creating service', error });
  }
});

// Update service
router.put('/:id', protect, async (req, res) => {
  try {
    const updatedService = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedService);
  } catch (error) {
    res.status(400).json({ message: 'Error updating service' });
  }
});

// Delete service
router.delete('/:id', protect, async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service removed' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting service' });
  }
});

module.exports = router;
