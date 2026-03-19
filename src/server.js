import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

import config from './config/config.js'
import logger from './utils/logger.js'

import errorHandler from './middleware/errorHandler.js'
import notFound from './middleware/notFound.js'
import routes from './routes/index.routes.js'
import { generalLimiter } from './utils/limiter.js'

/**
 * Express Server Setup
 *
 * Main server file that configures Express app with all middleware,
 * routes, and error handling. Implements security best practices
 * and production-ready configurations.
 */

const app = express()

// Start server
const PORT = config.server.port
const NODE_ENV = config.server.env
const CORS_ORIGIN = config.cors.origin
const CORS_CREDENTIALS = config.cors.credentials

// Trust proxy for accurate IP addresses behind reverse proxy
app.set('trust proxy', 1)

// Security middleware
const securityPolicies = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:']
    }
  },
  crossOriginEmbedderPolicy: false
}

app.use(helmet(securityPolicies))

// CORS configuration
const allowedOrigins = {
  origin: CORS_ORIGIN,
  credentials: CORS_CREDENTIALS,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(allowedOrigins))

// Rate limiting middleware
app.use(generalLimiter)

// Logging middleware
if (config.server.env === 'development') {
  app.use(morgan('dev'))
} else {
  app.use(
    morgan('combined', {
      stream: {
        write: message => logger.info(message.trim())
      }
    })
  )
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// API routes
app.use('/api', routes)

// 404 handler
app.use(notFound)
// Global error handler
app.use(errorHandler)

const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running in ${NODE_ENV} mode on port ${PORT}`)
  logger.info(
    `📊 Health check available at http://localhost:${PORT}/api/health`
  )

  if (NODE_ENV === 'development') {
    logger.info(
      `📖 API Documentation available at http://localhost:${PORT}/api/docs`
    )
  }
})

// Graceful shutdown
const gracefulShutdown = signal => {
  logger.info(`${signal} received. Starting graceful shutdown...`)

  server.close(err => {
    if (err) {
      logger.error('Error during server close:', err)
      process.exit(1)
    }

    logger.info('Server closed successfully')
    process.exit(0)
  })

  // Force close after 30 seconds
  setTimeout(() => {
    logger.error('Forced shutdown due to timeout')
    process.exit(1)
  }, 30000)
}

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))

// Handle uncaught exceptions
process.on('uncaughtException', err => {
  logger.error('Uncaught Exception:', err)
  process.exit(1)
})

// Handle unhandled promise rejections
process.on('unhandledRejection', err => {
  logger.error('Unhandled Rejection:', err)
  server.close(() => {
    process.exit(1)
  })
})

export default app
