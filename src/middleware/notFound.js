import ApiResponse from '../utils/ApiResponse.js'

/**
 * Not Found Middleware
 * 
 * Handles requests to undefined routes and returns
 * a standardized 404 error response.
 */

const notFound = (req, res) => {
  ApiResponse.notFound(res, `Route ${req.originalUrl} not found`)
}

export default notFound