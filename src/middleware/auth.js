import JWTUtils from '../utils/jwt.js'
import ApiResponse from '../utils/ApiResponse.js'
import ApiError from '../utils/ApiError.js'
import asyncHandler from '../utils/asyncHandler.js'
import prisma from '../config/database.js'

/**
 * Authentication Middleware
 *
 * Protects routes by verifying JWT access tokens and attaching
 * the authenticated user to the request object.
 */

const auth = asyncHandler(async (req, res, next) => {
  // Get token from header
  const token = JWTUtils.extractTokenFromHeader(req.headers.authorization)

  if (!token) {
    return ApiResponse.unauthorized(res, 'Access token is required')
  }

  try {
    // Verify token
    const decoded = JWTUtils.verifyAccessToken(token)

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        isActive: true,
        emailVerified: true
      }
    })

    if (!user) {
      return ApiResponse.unauthorized(res, 'User not found')
    }

    if (!user.isActive) {
      return ApiResponse.unauthorized(res, 'Account is deactivated')
    }

    // Attach user to request
    req.user = user

    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return ApiResponse.unauthorized(res, 'Access token expired')
    }

    if (error.name === 'JsonWebTokenError') {
      return ApiResponse.unauthorized(res, 'Invalid access token')
    }

    throw error
  }
})

export default auth
