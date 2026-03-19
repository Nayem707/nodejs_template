import express from 'express'
import ApiResponse from '../../utils/ApiResponse.js'
import asyncHandler from '../../utils/asyncHandler.js'
import auth from '../../middleware/auth.js'
import prisma from '../../config/database.js'
import config from '../../config/config.js'

/**
 * Test Routes
 *
 * Provides test endpoints for health checks and protected route testing.
 */

const router = express.Router()

/**
 * Root endpoint
 * GET /api/
 */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    res.json({
      success: true,
      message: 'Express Backend API',
      version: '1.0.0',
      environment: config.dev.nodeEnv,
      timestamp: new Date().toISOString(),
      endpoints: {
        health: '/api/health',
        auth: {
          register: 'POST /api/auth/register',
          login: 'POST /api/auth/login',
          refresh: 'POST /api/auth/refresh',
          logout: 'POST /api/auth/logout',
          profile: 'GET /api/auth/me',
          logoutAll: 'POST /api/auth/logout-all'
        },
        test: {
          protected: 'GET /api/test/protected'
        }
      }
    })
  })
)

/**
 * Health check endpoint
 * GET /api/health
 */
router.get(
  '/health',
  asyncHandler(async (req, res) => {
    // Check database connection
    let dbStatus = 'connected'
    try {
      await prisma.$queryRaw`SELECT 1`
    } catch (error) {
      dbStatus = 'disconnected'
    }

    const healthInfo = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      database: dbStatus,
      memory: {
        used:
          Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) /
          100,
        total:
          Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) /
          100
      }
    }

    ApiResponse.success(res, healthInfo, 'System is healthy')
  })
)

/**
 * Protected test endpoint
 * GET /api/test/protected
 */
router.get(
  '/protected',
  auth,
  asyncHandler(async (req, res) => {
    ApiResponse.success(
      res,
      {
        message: 'You have access to this protected route!',
        user: req.user,
        timestamp: new Date().toISOString()
      },
      'Protected route accessed successfully'
    )
  })
)

export default router
