import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

// Define schemas inline to avoid CJS/ESM conflicts with backend models
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' }
}, { timestamps: true });

const serviceSchema = new mongoose.Schema({
  serviceId: { type: String, required: true, unique: true },
  serviceName: { type: String, required: true },
  duration: { type: Number, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const staffSchema = new mongoose.Schema({
  staffId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  workingDays: { type: [String], required: true },
  workingHours: { start: String, end: String },
  slotDuration: { type: Number, default: 30 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);
const Staff = mongoose.models.Staff || mongoose.model('Staff', staffSchema);

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // 1. Create Admin User
    await User.deleteMany({});
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@123', salt);
    await User.create({
      username: 'admin',
      password: hashedPassword,
      role: 'admin'
    });
    console.log('Admin user created (admin / Admin@123)');

    // 2. Create Services
    await Service.deleteMany({});
    const services = [
      { serviceId: 'SRV-01', serviceName: 'General Consultation', duration: 30, price: 500, description: 'Basic health checkup' },
      { serviceId: 'SRV-02', serviceName: 'Hair Cut & Style', duration: 45, price: 1200, description: 'Professional hair styling' },
      { serviceId: 'SRV-03', serviceName: 'Deep Tissue Massage', duration: 60, price: 2500, description: 'Relaxing full body massage' },
      { serviceId: 'SRV-04', serviceName: 'Dental Checkup', duration: 30, price: 800, description: 'Routine teeth cleaning and checkup' },
      { serviceId: 'SRV-05', serviceName: 'Skin Consultation', duration: 45, price: 1500, description: 'Dermatologist skin review' },
    ];
    await Service.insertMany(services);
    console.log('5 Services created');

    // 3. Create Staff
    await Staff.deleteMany({});
    const staff = [
      {
        staffId: 'STF-01',
        name: 'Dr. Ahmed Khan',
        specialty: 'General Physician',
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        workingHours: { start: '09:00', end: '17:00' },
        slotDuration: 30
      },
      {
        staffId: 'STF-02',
        name: 'Sara Ali',
        specialty: 'Hair Stylist',
        workingDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        workingHours: { start: '10:00', end: '19:00' },
        slotDuration: 45
      },
      {
        staffId: 'STF-03',
        name: 'Hassan Raza',
        specialty: 'Massage Therapist',
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        workingHours: { start: '11:00', end: '20:00' },
        slotDuration: 60
      }
    ];
    await Staff.insertMany(staff);
    console.log('3 Staff members created');

    console.log('\n✅ Seed completed successfully!');
    process.exit();
  } catch (error) {
    console.error('Seed Error:', error);
    process.exit(1);
  }
};

seedData();
