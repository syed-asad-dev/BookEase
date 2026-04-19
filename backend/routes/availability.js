const express = require('express');
const router = express.Router();
const Staff = require('../models/Staff');
const Appointment = require('../models/Appointment');

const generateTimeSlots = (start, end, duration) => {
  const slots = [];
  let [startHour, startMinute] = start.split(':').map(Number);
  let [endHour, endMinute] = end.split(':').map(Number);

  let currentTotalMinutes = startHour * 60 + startMinute;
  const endTotalMinutes = endHour * 60 + endMinute;

  while (currentTotalMinutes + duration <= endTotalMinutes) {
    const h = Math.floor(currentTotalMinutes / 60);
    const m = currentTotalMinutes % 60;
    slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
    currentTotalMinutes += duration;
  }
  return slots;
};

// Get available slots
router.get('/', async (req, res) => {
  const { staffId, date, serviceId } = req.query; // date in YYYY-MM-DD
  
  if (!staffId || !date) {
    return res.status(400).json({ message: 'staffId and date are required' });
  }

  try {
    const staff = await Staff.findById(staffId);
    if (!staff) return res.status(404).json({ message: 'Staff not found' });

    // Check if staff works on this day of the week
    const dateObj = new Date(date);
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = dayNames[dateObj.getDay()];

    if (!staff.workingDays.includes(dayName)) {
      return res.json([]); // Not working on this day
    }

    const duration = staff.slotDuration || 30; // Alternatively get duration from Service if passed
    
    // Generate all base slots
    const allSlots = generateTimeSlots(staff.workingHours.start, staff.workingHours.end, duration);

    // Find existing appointments for this staff on this date
    // Date needs to cover the entire day to reliably match
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const existingAppointments = await Appointment.find({
      staff: staffId,
      appointmentDate: {
        $gte: startOfDay,
        $lte: endOfDay
      },
      status: { $ne: 'cancelled' }
    });

    const bookedSlots = existingAppointments.map(app => app.appointmentTime);
    
    // Filter available
    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));
    res.json(availableSlots);

  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
