import AuthService from '../../services/auth.service.js'
import ApiResponse from '../../utils/ApiResponse.js'
import ApiError from '../../utils/ApiError.js'
import asyncHandler from '../../utils/asyncHandler.js'

/**
 * Authentication Controller
 *
 * Handles HTTP requests for authentication endpoints including
 * registration, login, token refresh, and logout operations.
 */

class AuthController {
  /**
   * Register new user
   * POST /api/auth/register
   */
  static register = asyncHandler(async (req, res) => {
    const { email, username, password, firstName, lastName } = req.body

    // Basic validation
    if (!email || !username || !password) {
      throw new ApiError(400, 'Email, username, and password are required')
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new ApiError(400, 'Invalid email format')
    }

    // Password strength validation
    if (password.length < 6) {
      throw new ApiError(400, 'Password must be at least 6 characters long')
    }

    // Username validation
    if (username.length < 3) {
      throw new ApiError(400, 'Username must be at least 3 characters long')
    }

    const result = await AuthService.register({
      email: email.toLowerCase().trim(),
      username: username.trim(),
      password,
      firstName: firstName?.trim(),
      lastName: lastName?.trim()
    })

    ApiResponse.success(res, result, 'User registered successfully', 201)
  })

  /**
   * Login user
   * POST /api/auth/login
   */
  static login = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    // Basic validation
    if (!email || !password) {
      throw new ApiError(400, 'Email and password are required')
    }

    const result = await AuthService.login({
      email: email.toLowerCase().trim(),
      password
    })

    ApiResponse.success(res, result, 'Login successful')
  })

  /**
   * Refresh access token
   * POST /api/auth/refresh
   */
  static refresh = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body

    if (!refreshToken) {
      throw new ApiError(400, 'Refresh token is required')
    }

    const result = await AuthService.refreshToken(refreshToken)
    ApiResponse.success(res, result, 'Token refreshed successfully')
  })

  /**
   * Logout user
   * POST /api/auth/logout
   */
  static logout = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body

    await AuthService.logout(refreshToken)
    ApiResponse.success(res, null, 'Logout successful')
  })

  /**
   * Logout from all devices
   * POST /api/auth/logout-all
   */
  static logoutAll = asyncHandler(async (req, res) => {
    const userId = req.user.id

    await AuthService.logoutAll(userId)
    ApiResponse.success(res, null, 'Logged out from all devices successfully')
  })

  /**
   * Get current user profile
   * GET /api/auth/me
   */
  static getProfile = asyncHandler(async (req, res) => {
    ApiResponse.success(
      res,
      { user: req.user },
      'Profile retrieved successfully'
    )
  })
}

export default AuthController
