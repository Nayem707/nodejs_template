/**
 * Async Handler Utility
 *
 * Wraps async route handlers to automatically catch and forward
 * any errors to the Express error handling middleware.
 * This eliminates the need for try-catch blocks in every async controller.
 */

const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

export default asyncHandler
