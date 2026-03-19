import rateLimit from 'express-rate-limit'
import { config } from '../config/config.js'

const RATE_LIMIT_WINDOW_MS = config.rateLimit.windowMs
const RATE_LIMIT_MAX = config.rateLimit.max
const RATE_LIMIT_AUTH_WINDOW_MS = config.rateLimit.windowMs
const RATE_LIMIT_AUTH_MAX = config.rateLimit.max

export const generalLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_MAX,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    timestamp: new Date().toISOString()
  },
  standardHeaders: true,
  legacyHeaders: false
})

export const authLimiter = rateLimit({
  windowMs: RATE_LIMIT_AUTH_WINDOW_MS,
  max: RATE_LIMIT_AUTH_MAX,
  message: {
    success: false,
    message:
      'Too many authentication requests from this IP, please try again later.',
    timestamp: new Date().toISOString()
  },
  standardHeaders: true,
  legacyHeaders: false
})
