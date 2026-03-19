import winston from 'winston'
import config from '../config/config.js'

/**
 * Logger utility using Winston
 *
 * Provides structured logging with different levels and formats
 * for development and production environments.
 */

const { combine, timestamp, errors, printf, colorize, json } = winston.format

// Custom format for development
const devFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`
})

// Create logger instance
const logger = winston.createLogger({
  level: config.server.env === 'development' ? 'debug' : 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true })
  ),
  defaultMeta: { service: 'express-backend' },
  transports: [
    // Console transport
    new winston.transports.Console({
      format: combine(
        colorize(),
        config.server.env === 'development' ? devFormat : json()
      )
    })
  ]
})

// Add file transports in production
if (config.server.env === 'production') {
  logger.add(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: json()
    })
  )

  logger.add(
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: json()
    })
  )
}

export default logger
