import jwt from 'jsonwebtoken'
import config from '../config/config.js'

/**
 * JWT Utility Functions
 *
 * Provides methods for generating, verifying, and managing JWT tokens
 * for both access and refresh token authentication system.
 */

class JWTUtils {
  /**
   * Generate an access token
   * @param {Object} payload - The payload to encode in the token
   * @returns {string} - The generated access token
   */
  static generateAccessToken(payload) {
    return jwt.sign(payload, config.jwt.accessSecret, {
      expiresIn: config.jwt.accessExpiresIn,
      issuer: 'express-backend',
      audience: 'express-frontend'
    })
  }

  /**
   * Generate a refresh token
   * @param {Object} payload - The payload to encode in the token
   * @returns {string} - The generated refresh token
   */
  static generateRefreshToken(payload) {
    return jwt.sign(payload, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiresIn,
      issuer: 'express-backend',
      audience: 'express-frontend'
    })
  }

  /**
   * Verify an access token
   * @param {string} token - The token to verify
   * @returns {Object} - The decoded token payload
   * @throws {Error} - If token is invalid or expired
   */
  static verifyAccessToken(token) {
    return jwt.verify(token, config.jwt.accessSecret, {
      issuer: 'express-backend',
      audience: 'express-frontend'
    })
  }

  /**
   * Verify a refresh token
   * @param {string} token - The token to verify
   * @returns {Object} - The decoded token payload
   * @throws {Error} - If token is invalid or expired
   */
  static verifyRefreshToken(token) {
    return jwt.verify(token, config.jwt.refreshSecret, {
      issuer: 'express-backend',
      audience: 'express-frontend'
    })
  }

  /**
   * Generate both access and refresh tokens
   * @param {Object} payload - The payload to encode in the tokens
   * @returns {Object} - Object containing both tokens
   */
  static generateTokenPair(payload) {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload)
    }
  }

  /**
   * Extract token from Authorization header
   * @param {string} authHeader - The Authorization header value
   * @returns {string|null} - The extracted token or null
   */
  static extractTokenFromHeader(authHeader) {
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7)
    }
    return null
  }
}

export default JWTUtils
