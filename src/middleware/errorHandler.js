import logger from '../utils/logger.js'
import ApiResponse from '../utils/ApiResponse.js'
import ApiError from '../utils/ApiError.js'

/**
 * Global Error Handler Middleware
 * 
 * Centralized error handling for the entire application.
 * Catches all errors and returns consistent error responses
 * while logging detailed error information for debugging.
 */

const errorHandler = (err, req, res, next) => {
  let error = { ...err }
  error.message = err.message

  // Log error details
  logger.error(`Error ${err.message}`, {
    error: err,
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  })

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found'
    error = new ApiError(404, message)
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered'
    error = new ApiError(400, message)
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message)
    error = new ApiError(400, message)
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token'
    error = new ApiError(401, message)
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired'
    error = new ApiError(401, message)
  }

  // Prisma errors
  if (err.code === 'P2002') {
    const message = 'Duplicate field value entered'
    error = new ApiError(400, message)
  }

  if (err.code === 'P2025') {
    const message = 'Record not found'
    error = new ApiError(404, message)
  }

  // Rate limiting error
  if (err.statusCode === 429) {
    const message = 'Too many requests, please try again later'
    error = new ApiError(429, message)
  }

  // Send error response
  ApiResponse.error(
    res,
    error.message || 'Server Error',
    error.statusCode || 500,
    process.env.NODE_ENV === 'development' ? err.stack : undefined
  )
}

export default errorHandler