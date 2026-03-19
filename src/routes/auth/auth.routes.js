import express from 'express'
import AuthController from '../../controllers/auth/auth.controller.js'
import auth from '../../middleware/auth.js'

/**
 * Authentication Routes
 *
 * Defines all authentication-related endpoints including
 * registration, login, token management, and user profile.
 */

const router = express.Router()

// Public routes
router.post('/login', AuthController.login)
router.post('/register', AuthController.register)
router.post('/refresh', AuthController.refresh)
router.post('/logout', AuthController.logout)

// Protected routes
router.use(auth) // Apply auth middleware to all routes below
router.get('/me', AuthController.getProfile)
router.post('/logout-all', AuthController.logoutAll)

export default router
