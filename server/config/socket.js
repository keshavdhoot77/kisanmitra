const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

/**
 * Socket.IO instance placeholder
 * @type {Server | null}
 */
let io = null;

/**
 * Map tracking online users
 * Key: userId (string) -> Value: Set of active socket IDs
 * Allows handling multiple active connections/tabs per user
 * @type {Map<string, Set<string>>}
 */
const onlineUsers = new Map();

/**
 * Initialize Socket.IO with HTTP server instance
 * 
 * - Configures CORS based on CLIENT_URL environment variable
 * - Authenticates incoming connections via JWT in handshake auth/headers
 * - Automatically joins authenticated users to user-specific room `user_<userId>`
 * - Maintains active online user tracking in onlineUsers Map
 * - Handles connection cleanup on disconnect
 * 
 * @param {import('http').Server} httpServer - The Node.js HTTP server instance
 * @returns {Server} The initialized Socket.IO server instance
 */
const initSocket = (httpServer) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

  io = new Server(httpServer, {
    cors: {
      origin: clientUrl,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      credentials: true,
    },
  });

  // JWT Authentication middleware for Socket.IO
  io.use((socket, next) => {
    try {
      const rawToken =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization;

      if (!rawToken) {
        return next(new Error('Authentication error: Token is required'));
      }

      // Handle both standard tokens and 'Bearer <token>' format
      const token = rawToken.startsWith('Bearer ')
        ? rawToken.slice(7).trim()
        : rawToken.trim();

      const secret = process.env.JWT_SECRET;
      if (!secret) {
        return next(new Error('Internal server error: JWT secret not configured'));
      }

      const decoded = jwt.verify(token, secret);
      socket.user = decoded;
      next();
    } catch (error) {
      console.error(`[Socket Auth Error] Failed connection attempt from ${socket.id}: ${error.message}`);
      return next(new Error(`Authentication error: ${error.message}`));
    }
  });

  // Connection event handler
  io.on('connection', (socket) => {
    const userId = String(socket.user.id || socket.user._id || socket.user.userId);
    socket.userId = userId;

    // Join dedicated user room for targeted notifications/messages
    const userRoom = `user_${userId}`;
    socket.join(userRoom);

    // Track active connection for user
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId).add(socket.id);

    console.log(`[Socket] User connected: ${userId} (Socket ID: ${socket.id}, Total connections for user: ${onlineUsers.get(userId).size})`);

    // Handle user disconnect
    socket.on('disconnect', (reason) => {
      console.log(`[Socket] Socket disconnected: ${socket.id} (User: ${userId}, Reason: ${reason})`);

      if (onlineUsers.has(userId)) {
        const userSockets = onlineUsers.get(userId);
        userSockets.delete(socket.id);

        if (userSockets.size === 0) {
          onlineUsers.delete(userId);
          console.log(`[Socket] User went offline: ${userId}`);
        }
      }
    });

    // Handle socket error
    socket.on('error', (err) => {
      console.error(`[Socket Error] Socket ID ${socket.id} error:`, err);
    });
  });

  console.log('[Socket] Socket.IO server initialized successfully');
  return io;
};

/**
 * Get the initialized Socket.IO instance
 * Throws an error if called before initSocket()
 * 
 * @returns {Server} The initialized Socket.IO server instance
 */
const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO has not been initialized. Please call initSocket(httpServer) first.');
  }
  return io;
};

module.exports = {
  initSocket,
  getIO,
  onlineUsers,
};
