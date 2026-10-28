const mongoose = require('mongoose');

let _memServer = null;

/**
 * Connect to MongoDB.
 * - Tries MONGODB_URI from .env when configured
 * - In development, falls back to an in-memory MongoDB for local use
 */
const connectDB = async () => {
  connectDB.mode = 'unavailable';
  const uri = process.env.MONGODB_URI;

  // Try primary URI first
  if (uri) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`[MongoDB] Connecting to configured server (Attempt ${attempt}/2)...`);
        const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 6000 });
        connectDB.mode = 'mongodb';
        console.log(`[MongoDB] ✅ Connected to Atlas: ${conn.connection.host}`);
        return true;
      } catch (err) {
        console.warn(`[MongoDB] Attempt ${attempt} failed: ${err.message}`);
        if (attempt < 2) await new Promise(r => setTimeout(r, 2000));
      }
    }
    console.warn('[MongoDB] Configured server connection failed.');
  }

  if (process.env.NODE_ENV === 'production') {
    console.error('[MongoDB] Refusing to use ephemeral storage in production. Configure MONGODB_URI.');
    return false;
  }

  // Fallback: embedded in-memory MongoDB (perfect for local dev)
  try {
    console.log('[MongoDB] Starting embedded MongoDB (local dev mode)...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    _memServer = await MongoMemoryServer.create();
    const memUri = _memServer.getUri();
    await mongoose.connect(memUri);
    connectDB.mode = 'memory';
    console.log('[MongoDB] ✅ Embedded MongoDB running — data resets on server restart.');
    console.log('[MongoDB] 💡 To persist data, set a valid MONGODB_URI in server/.env');
    return true;

  } catch (memErr) {
    console.error('[MongoDB] ❌ Could not start embedded MongoDB:', memErr.message);
    console.error('[MongoDB] Please set a valid MONGODB_URI in server/.env');
    return false;
  }
};

connectDB.mode = 'unavailable';

module.exports = connectDB;
