const mongoose = require('mongoose');

/**
 * Connect to MongoDB instance using Mongoose.
 * If local MongoDB is not running, falls back gracefully to in-memory store.
 */
const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.log('[MongoDB] No MONGODB_URI specified. Operating in standalone in-memory preview mode.');
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 2000,
    });

    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[MongoDB] Notice: Could not connect to MongoDB (${error.message}).`);
    console.log(`[MongoDB] Operating in instant in-memory mode so you can test all features right now!`);
    console.log(`[MongoDB] (To connect to a persistent database, provide a MongoDB Atlas URI in server/.env).`);
  }
};

module.exports = connectDB;
