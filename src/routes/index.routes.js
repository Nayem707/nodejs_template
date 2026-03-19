import express from 'express'
import authRoutes from './auth/auth.routes.js'
import testRoutes from './docs/test.routes.js'

/**
 * Main Routes Index
 *
 * Centralizes all route definitions and applies them to the main router
 * with appropriate prefixes for API versioning and organization.
 */

const router = express.Router()

// API Routes
router.use('/auth', authRoutes)
// Test routes
router.use('/test', testRoutes)

export default router
