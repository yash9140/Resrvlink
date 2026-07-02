const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  const maxRetries = 5;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 10000,
        family: 4
      });
      logger.info(`MongoDB connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      attempt += 1;
      logger.error(`MongoDB connection attempt ${attempt} failed: ${error.message}`);
      if (attempt >= maxRetries) {
        logger.error('Max retries reached. Exiting process.');
        process.exit(1);
      }
      await new Promise((res) => setTimeout(res, 3000));
    }
  }
};

module.exports = connectDB;
