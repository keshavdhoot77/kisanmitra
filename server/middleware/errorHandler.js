/**
 * Global Error Handler Middleware
 *
 * Catches all unhandled errors thrown across Express routes and controllers.
 * Formats errors uniformly into { success: false, message: '...', errors: [...] }.
 *
 * Handles:
 * - Mongoose CastError (bad ObjectId) -> 400
 * - Mongoose ValidationError -> 400 with field messages
 * - Duplicate key error (MongoDB code 11000) -> 400
 * - JWT errors (JsonWebTokenError, TokenExpiredError) -> 401
 * - Multer errors (e.g. file size exceeded) -> 400
 * - Generic 500 errors with safe message in production, full stack in development
 *
 * @param {Error} err - Error object
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 */
const errorHandler = (err, req, res, next) => {
  const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;

  // Log error in development environment for debugging
  if (isDev) {
    console.error('[Error Handler Log]:', {
      name: err.name,
      message: err.message,
      code: err.code,
      stack: err.stack,
    });
  }

  let statusCode = err.statusCode || (res.statusCode >= 400 ? res.statusCode : 500);
  let message = err.message || 'Internal Server Error';
  let errors = [];

  // 1. Mongoose Bad ObjectId / CastError -> 400
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Resource not found. Invalid ID format for '${err.path}'.`;
    errors = [`Invalid format for ${err.path}: ${err.value}`];
  }

  // 2. Mongoose Schema Validation Error -> 400 with field messages
  else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation error occurred.';
    errors = Object.values(err.errors || {}).map((val) => val.message);
  }

  // 3. MongoDB Duplicate Key Error (Code 11000) -> 400
  else if (err.code === 11000) {
    statusCode = 400;
    const duplicateKeys = Object.keys(err.keyValue || {});
    const fieldName = duplicateKeys.length > 0 ? duplicateKeys[0] : 'field';
    const fieldValue = err.keyValue ? err.keyValue[fieldName] : '';
    message = `Duplicate field value entered for '${fieldName}'. Please use another value.`;
    errors = [`Field '${fieldName}' with value '${fieldValue}' already exists`];
  }

  // 4. JWT Verification Error -> 401
  else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token. Authorization denied.';
    errors = ['Invalid token'];
  }

  // 5. JWT Expiration Error -> 401
  else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token has expired. Please log in again.';
    errors = ['Token expired'];
  }

  // 6. Multer File Upload Errors -> 400
  else if (err.name === 'MulterError') {
    statusCode = 400;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File size exceeds the allowed limit.';
      errors = ['File size limit exceeded'];
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      message = `Unexpected upload field or too many files uploaded for '${err.field}'.`;
      errors = [err.message];
    } else {
      message = err.message || 'File upload error.';
      errors = [err.message];
    }
  }

  // 7. Generic 500 Internal Server Errors
  if (statusCode === 500) {
    if (!isDev) {
      // In production, mask internal error details
      message = 'Internal server error. Please try again later.';
      errors = ['An unexpected error occurred on the server'];
    } else {
      // In development, preserve original error message
      message = err.message || 'Internal Server Error';
      if (errors.length === 0) {
        errors = [err.message || 'Internal Server Error'];
      }
    }
  } else if (errors.length === 0) {
    errors = [message];
  }

  // Consistent API response format
  const responsePayload = {
    success: false,
    message,
    errors,
  };

  // Include stack trace only in development
  if (isDev && err.stack) {
    responsePayload.stack = err.stack;
  }

  return res.status(statusCode).json(responsePayload);
};

module.exports = errorHandler;
