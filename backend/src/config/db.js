const mongoose = require('mongoose');

let cachedDb = null;

const connectDB = async () => {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }
  if (mongoose.connection.readyState === 2) {
    return new Promise(resolve => {
      mongoose.connection.once('connected', () => resolve(mongoose.connection));
    });
  }
  try {
    mongoose.connection.removeAllListeners('connected');
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 30000,
      maxPoolSize: 1,
    });
    cachedDb = conn;
    return conn;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    cachedDb = null;
    return null;
  }
};

module.exports = connectDB;
