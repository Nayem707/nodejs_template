import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Small helper for numeric values
const toNumber = (val, fallback) => (val ? Number(val) : fallback)

// Default rate limit window
const TOTAL_LIMIT = 15 * 60 * 1000 // 15 minutes

/**
 * Application configuration
 *
 * Centralizes all environment variables and configuration settings
 * with proper validation and defaults for production readiness.
 */

export const config = {
  db: {
    url: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === 'true'
  },
  server: {
    port: toNumber(process.env.PORT, 3000),
    env: process.env.NODE_ENV || 'development',
    apiVersion: process.env.API_VERSION || 'v1',
    logLevel: process.env.LOG_LEVEL || 'info'
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: process.env.CORS_CREDENTIALS === 'true'
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRE || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRE || '7d'
  },
  security: {
    bcryptRounds: toNumber(process.env.BCRYPT_ROUNDS, 12),
    encryptionKey: process.env.ENCRYPTION_KEY,
    encryptionIv: process.env.ENCRYPTION_IV
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET
  },
  email: {
    host: process.env.EMAIL_HOST,
    port: toNumber(process.env.EMAIL_PORT, 587),
    from: process.env.EMAIL_FROM,
    username: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD
  },
  admin: {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD
  },
  uploads: {
    maxFileSize: toNumber(process.env.MAX_FILE_SIZE, 10 * 1024 * 1024), // 10MB
    dir: process.env.UPLOAD_DIR || './uploads'
  },
  rateLimit: {
    windowMs: toNumber(process.env.RATE_LIMIT_WINDOW_MS, TOTAL_LIMIT),
    maxRequests: toNumber(process.env.RATE_LIMIT_MAX_REQUESTS, 100),
    authWindowMs: toNumber(process.env.RATE_LIMIT_AUTH_WINDOW_MS, TOTAL_LIMIT),
    authMaxRequests: toNumber(process.env.RATE_LIMIT_AUTH_MAX_REQUESTS, 2)
  }
}

// Validate required environment variables
// List only *truly required* env vars (secrets, not defaults)
const REQUIRED_ENV_VARS = [
  'DATABASE_URL',

  'JWT_SECRET',
  'JWT_REFRESH_SECRET',

  'STRIPE_SECRET_KEY',
  'STRIPE_PUBLISHABLE_KEY',
  'STRIPE_WEBHOOK_SECRET',

  'EMAIL_HOST',
  'EMAIL_FROM',
  'EMAIL_USERNAME',
  'EMAIL_PASSWORD',

  'ADMIN_EMAIL',
  'ADMIN_PASSWORD',

  'ENCRYPTION_KEY',
  'ENCRYPTION_IV',

  'BCRYPT_ROUNDS',

  'MAX_FILE_SIZE',
  'UPLOAD_DIR',

  'RATE_LIMIT_WINDOW_MS',
  'RATE_LIMIT_MAX_REQUESTS',
  'RATE_LIMIT_AUTH_WINDOW_MS',
  'RATE_LIMIT_AUTH_MAX_REQUESTS',

  'CORS_ORIGIN',
  'FRONTEND_URL',
  'CORS_CREDENTIALS'
]

const missingEnv = REQUIRED_ENV_VARS.filter(envVar => !process.env[envVar])

if (missingEnv.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnv.join(', ')}`
  )
}

export default config
