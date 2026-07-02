require('dotenv').config();
const mongoose = require('mongoose');
const Table = require('./models/Table');
const User = require('./models/User');
const logger = require('./utils/logger');

const tables = [
  { tableNumber: 1, seatingCapacity: 2, active: true },
  { tableNumber: 2, seatingCapacity: 2, active: true },
  { tableNumber: 3, seatingCapacity: 4, active: true },
  { tableNumber: 4, seatingCapacity: 4, active: true },
  { tableNumber: 5, seatingCapacity: 6, active: true },
  { tableNumber: 6, seatingCapacity: 6, active: true },
  { tableNumber: 7, seatingCapacity: 8, active: true },
  { tableNumber: 8, seatingCapacity: 10, active: true },
];

const adminUser = {
  name: 'Admin',
  email: 'admin@resrvlink.com',
  password: 'Admin@123456',
  role: 'admin',
};

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('Connected to MongoDB for seeding');

    await Table.deleteMany({});
    logger.info('Cleared existing tables');

    await Table.insertMany(tables);
    logger.info(`Inserted ${tables.length} tables`);

    const existingAdmin = await User.findOne({ email: adminUser.email });
    if (!existingAdmin) {
      await User.create(adminUser);
      logger.info(`Admin user created: ${adminUser.email}`);
    } else {
      logger.info('Admin user already exists, skipping');
    }

    logger.info('Seeding complete');
    process.exit(0);
  } catch (err) {
    logger.error(`Seeding failed: ${err.message}`);
    process.exit(1);
  }
};

seed();
