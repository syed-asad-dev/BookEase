const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Models
const User = require('./backend/models/User');
const Service = require('./backend/models/Service');
const Staff = require('./backend/models/Staff');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
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
    console.log('Admin user created');

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
    console.log('Services created');

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
    console.log('Staff created');

    console.log('Seed completed successfully!');
    process.exit();
  } catch (error) {
    console.error('Seed Error:', error);
    process.exit(1);
  }
};

seedData();
