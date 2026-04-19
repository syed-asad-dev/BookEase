const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  staffId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  workingDays: { type: [String], required: true }, // e.g. ['Monday', 'Tuesday']
  workingHours: {
    start: { type: String, required: true }, // e.g. "09:00"
    end: { type: String, required: true }    // e.g. "17:00"
  },
  slotDuration: { type: Number, default: 30 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Staff', staffSchema);
