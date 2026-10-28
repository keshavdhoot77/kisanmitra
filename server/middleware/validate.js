const { validationResult } = require('express-validator');

/**
 * Validates request data against an array of express-validator validation chains.
 *
 * Runs each validation chain on the request object. If validation errors exist,
 * responds with HTTP 400 and formatted error list. Otherwise, proceeds to next middleware.
 *
 * @param {Array} validations - Array of express-validator validation chains
 * @returns {Function} Express middleware function
 *
 * @example
 * router.post(
 *   '/register',
 *   validate([
 *     body('email').isEmail().withMessage('Please provide a valid email'),
 *     body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
 *   ]),
 *   registerController
 * );
 */
const validate = (validations = []) => {
  return async (req, res, next) => {
    // Run all validation chains
    if (Array.isArray(validations)) {
      await Promise.all(validations.map((validation) => validation.run(req)));
    } else if (validations && typeof validations.run === 'function') {
      await validations.run(req);
    }

    // Inspect validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedErrors = errors.array().map((err) => ({
        field: err.path || err.param,
        message: err.msg,
        value: err.value,
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: formattedErrors,
      });
    }

    next();
  };
};

/**
 * Async handler utility to wrap asynchronous controller functions and route handlers.
 * Catches rejected promises / thrown errors and forwards them to Express next() error handler.
 *
 * @param {Function} fn - Async controller or route function (req, res, next)
 * @returns {Function} Express middleware wrapper (req, res, next)
 *
 * @example
 * exports.getUsers = asyncHandler(async (req, res, next) => {
 *   const users = await User.find();
 *   res.json({ success: true, data: users });
 * });
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  validate,
  asyncHandler,
};
