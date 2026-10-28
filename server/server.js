const express = require('express');
const http = require('http');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = require('./config/db');
const { initSocket } = require('./config/socket');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const listingRoutes = require('./routes/listings');
const uploadRoutes = require('./routes/upload');
const offerRoutes = require('./routes/offers');
const orderRoutes = require('./routes/orders');
const priceRoutes = require('./routes/prices');
const chatRoutes = require('./routes/chat');
const reviewRoutes = require('./routes/reviews');
const adminRoutes = require('./routes/admin');
const notificationRoutes = require('./routes/notifications');

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server);

// ─── Middleware ──────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Health Check ────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  const databaseConnected = mongoose.connection.readyState === 1;
  res.status(databaseConnected ? 200 : 503).json({
    success: databaseConnected,
    message: 'KisanMitra API is running 🌾',
    database: databaseConnected ? 'connected' : 'unavailable',
    databaseSource: databaseConnected ? connectDB.mode : 'unavailable',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Reject database-backed requests quickly instead of letting Mongoose buffer
// commands until they time out. Dashboard prices return an explicit unavailable response.
app.use('/api', (req, res, next) => {
  if (req.path === '/health' || req.path === '/prices/dashboard' || mongoose.connection.readyState === 1) {
    return next();
  }
  return res.status(503).json({
    success: false,
    message: 'Database is unavailable. Check the MongoDB connection and try again.',
    errors: ['MongoDB connection is not ready'],
  });
});

// ─── API Routes ──────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/prices', priceRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ─── Global Error Handler ─────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  const databaseConnected = await connectDB();
  if (!databaseConnected) {
    console.error('[MongoDB] API is starting in degraded mode; database-backed requests will return 503.');
  }
  server.listen(PORT, () => {
    console.log(`\n🌾  KisanMitra API Server`);
    console.log(`📡  Port     : ${PORT}`);
    console.log(`🔧  Mode     : ${process.env.NODE_ENV}`);
    console.log(`🌐  Client   : ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
    console.log(`✅  Ready    : http://localhost:${PORT}/api/health\n`);
  });
};

startServer().catch((error) => {
  console.error('[Server] Startup failed:', error.message);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err.message);
  server.close(() => process.exit(1));
});

module.exports = { app, server };
