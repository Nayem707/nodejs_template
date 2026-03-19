import bcrypt from 'bcryptjs'
import prisma from '../config/database.js'
import JWTUtils from '../utils/jwt.js'
import ApiError from '../utils/ApiError.js'
import logger from '../utils/logger.js'

/**
 * Authentication Service
 *
 * Handles all authentication-related business logic including
 * user registration, login, token management, and password operations.
 */

class AuthService {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Object} - Created user and tokens
   */
  static async register({ email, username, password, firstName, lastName }) {
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }]
      }
    })

    if (existingUser) {
      if (existingUser.email === email) {
        throw new ApiError(400, 'Email already registered')
      }
      if (existingUser.username === username) {
        throw new ApiError(400, 'Username already taken')
      }
    }

    // Hash password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        firstName,
        lastName
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        isActive: true,
        emailVerified: true,
        createdAt: true
      }
    })

    // Generate tokens
    const tokenPayload = { userId: user.id, email: user.email }
    const { accessToken, refreshToken } =
      JWTUtils.generateTokenPair(tokenPayload)

    // Store refresh token
    await this.storeRefreshToken(user.id, refreshToken)

    logger.info(`New user registered: ${user.email}`)

    return {
      user,
      tokens: {
        accessToken,
        refreshToken
      }
    }
  }

  /**
   * Login user
   * @param {Object} credentials - User login credentials
   * @returns {Object} - User and tokens
   */
  static async login({ email, password }) {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      throw new ApiError(401, 'Invalid credentials')
    }

    if (!user.isActive) {
      throw new ApiError(401, 'Account is deactivated')
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid credentials')
    }

    // Generate tokens
    const tokenPayload = { userId: user.id, email: user.email }
    const { accessToken, refreshToken } =
      JWTUtils.generateTokenPair(tokenPayload)

    // Store refresh token
    await this.storeRefreshToken(user.id, refreshToken)

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    logger.info(`User logged in: ${user.email}`)

    return {
      user: userWithoutPassword,
      tokens: {
        accessToken,
        refreshToken
      }
    }
  }

  /**
   * Refresh access token
   * @param {string} refreshToken - Refresh token
   * @returns {Object} - New tokens
   */
  static async refreshToken(refreshToken) {
    if (!refreshToken) {
      throw new ApiError(401, 'Refresh token is required')
    }

    try {
      // Verify refresh token
      const decoded = JWTUtils.verifyRefreshToken(refreshToken)

      // Check if refresh token exists in database
      const storedToken = await prisma.refreshToken.findFirst({
        where: {
          token: refreshToken,
          userId: decoded.userId,
          expiresAt: {
            gt: new Date()
          }
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              username: true,
              firstName: true,
              lastName: true,
              isActive: true
            }
          }
        }
      })

      if (!storedToken) {
        throw new ApiError(401, 'Invalid refresh token')
      }

      if (!storedToken.user.isActive) {
        throw new ApiError(401, 'Account is deactivated')
      }

      // Generate new tokens
      const tokenPayload = {
        userId: storedToken.user.id,
        email: storedToken.user.email
      }
      const tokens = JWTUtils.generateTokenPair(tokenPayload)

      // Remove old refresh token and store new one
      await prisma.refreshToken.delete({
        where: { id: storedToken.id }
      })

      await this.storeRefreshToken(storedToken.user.id, tokens.refreshToken)

      return {
        user: storedToken.user,
        tokens
      }
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new ApiError(401, 'Refresh token expired')
      }
      if (error.name === 'JsonWebTokenError') {
        throw new ApiError(401, 'Invalid refresh token')
      }
      throw error
    }
  }

  /**
   * Logout user
   * @param {string} refreshToken - Refresh token to revoke
   */
  static async logout(refreshToken) {
    if (refreshToken) {
      await prisma.refreshToken.deleteMany({
        where: { token: refreshToken }
      })
    }
  }

  /**
   * Logout from all devices
   * @param {string} userId - User ID
   */
  static async logoutAll(userId) {
    await prisma.refreshToken.deleteMany({
      where: { userId }
    })
  }

  /**
   * Store refresh token in database
   * @param {string} userId - User ID
   * @param {string} refreshToken - Refresh token
   */
  static async storeRefreshToken(userId, refreshToken) {
    // Calculate expiration date (7 days from now)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
        expiresAt
      }
    })
  }

  /**
   * Clean expired refresh tokens
   */
  static async cleanExpiredTokens() {
    const result = await prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    })

    logger.info(`Cleaned ${result.count} expired refresh tokens`)
    return result.count
  }
}

export default AuthService
