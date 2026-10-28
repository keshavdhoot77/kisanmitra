const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication Middleware: protect
 * Extracts Bearer token from req.headers.authorization, verifies it with jwt.verify
 * using process.env.JWT_SECRET, finds the user by decoded.id using User model
 * (excluding password), and attaches the user document to req.user.
 *
 * Returns 401 if no token is provided, if token is invalid, or if user is not found.
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Check Authorization header for Bearer token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Return 401 if token is missing
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route. No token provided.',
        errors: ['Authentication token is required'],
      });
    }

    // Verify JWT token with secret
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ success: false, message: 'Authentication is not configured.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user in database, excluding password field
    const userId = decoded.id || decoded._id;
    const user = await User.findById(userId).select('-password');

    // Return 401 if user no longer exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. User belonging to this token no longer exists.',
        errors: ['User not found'],
      });
    }

    if (user.suspended) {
      return res.status(403).json({ success: false, message: 'This account has been suspended.' });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    // Pass JWT errors (JsonWebTokenError, TokenExpiredError) to errorHandler
    next(error);
  }
};

/**
 * Authorization Middleware: authorize
 * Returns a middleware function that checks if req.user.role is in the allowed roles.
 * Also checks req.user.userType to seamlessly support persona-based authorization.
 * Returns 403 if user is not authorized.
 *
 * @param {...string} roles - Allowed roles (e.g., 'admin', 'user', 'farmer', 'buyer')
 * @returns {Function} Express middleware function
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    try {
      // Ensure protect middleware ran first
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized. Authentication required.',
          errors: ['Authentication required before authorization check'],
        });
      }

      // Check if user's role or userType matches any of the allowed roles
      const userRole = req.user.role;
      const userType = req.user.userType;
      const isAuthorized =
        roles.includes(userRole) || (userType && roles.includes(userType));

      if (!isAuthorized) {
        return res.status(403).json({
          success: false,
          message: `User role '${userRole}' is not authorized to access this route.`,
          errors: [
            `Access forbidden: required role(s) [${roles.join(', ')}], current role '${userRole}'`,
          ],
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  protect,
  authorize,
};
